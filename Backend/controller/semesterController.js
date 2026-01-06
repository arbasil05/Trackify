import NonScoftCourse from "../models/NonScoftCourse.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

const SCOFT_DEPARTMENTS = ["CSE", "AIML", "AIDS", "IOT", "IT", "CYBER"];
const gradeMap = { 10: "O", 9: "A+", 8: "A", 7: "B+", 6: "B", 5: "C" };

export async function uploadFile(req, res) {
    const courseEntries = [];
    try {
        const id = req.id;
        if (!id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        // Get user info
        const user = await User.findById(id).populate("courses.course");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userDept = user.dept;

        // console.log("HELLO : ", req.subjects);
        const subs = req.subjects;
        const missing_subs = req.missing_subjects;
        if (!Array.isArray(subs) || subs.length === 0) {
            return res.status(400).json({
                error: "Check if the PDF is correct and has selectable text",
            });
        }

        const existingSemCourses = user.courses.filter(
            (c) => c.sem === req.body.sem
        );

        let total_sem_credits = 0;

        // Changed to a sequential for...of loop for predictable behavior (original Promise.all was parallel and buggy for early returns)
        for (const course of subs) {
            const queryConditions = [];
            if (course.code19 && course.code19 !== "NA") {
                queryConditions.push({ code19: course.code19 });
            }
            if (course.code24 && course.code24 !== "NA") {
                queryConditions.push({ code24: course.code24 });
            }
            if (course.name) {
                queryConditions.push({ name: course.name });
            }

            if (queryConditions.length === 0) {
                console.warn(
                    `Skipping course: No valid query fields in ${JSON.stringify(
                        course
                    )}`
                );
                continue;
            }
            // if department is scoft, search in Course collection else NonScoftCourse collection
            const isUserScoft = SCOFT_DEPARTMENTS.includes(userDept);
            const targetModel = isUserScoft ? Course : NonScoftCourse;
            let courseEntry =
                queryConditions.length > 1
                    ? await targetModel.findOne({ $or: queryConditions })
                    : await targetModel.findOne(queryConditions[0]);

            if (!courseEntry) {
                console.log(
                    `Course not found: ${course.name || course.code19 || course.code24
                    }`
                );
                continue;
            }

            // Updated: Check for duplicates globally across ALL user courses (any semester), not just the current sem
            const alreadyExists = user.courses.some(
                (ec) => ec.course._id.toString() === courseEntry._id.toString()
            );
            if (alreadyExists) {
                console.log(`Duplicate found: ${courseEntry.name}`);
                continue;
            }

            total_sem_credits += courseEntry.credits;

            courseEntries.push({
                course: courseEntry._id,
                grade: course.grade,
                modelType: isUserScoft ? "Course" : "NonScoftCourse",
                gradePoint: course.gradePoint,
                sem: req.body.sem,
                category: courseEntry.department[userDept]
                    ? courseEntry.department[userDept]
                    : courseEntry.department[
                    Object.keys(courseEntry.department)[0]
                    ],
                code19: course.code19,
                code24: course.code24,
            });
        }

        if (courseEntries.length === 0) {
            return res
                .status(400)
                .json({ error: "No new valid courses found to append" });
        }

        // New: Correctly calculate the updated semester total credits (existing + new)
        const existing_sem_credits = existingSemCourses.reduce(
            (acc, ec) => acc + ec.course.credits,
            0
        );
        const new_total = existing_sem_credits + total_sem_credits;

        const semName = req.body.sem;
        const semTotalUpdate = {};
        semTotalUpdate[`sem_total.${semName}`] = new_total;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $push: { courses: { $each: courseEntries } },
                $set: semTotalUpdate,
            },
            { new: true, runValidators: true }
        ).populate("courses.course");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "Courses appended successfully",
            courseEntries,
            missing_subs,
            userCourses: updatedUser.courses,
        });
    } catch (error) {
        console.error("Error in uploadFile:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getExistingSemesters(req, res) {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        const semesters = [
            ...new Set(user.courses.map((course) => course.sem)),
        ];
        res.status(200).json({ semesters });
    } catch (error) {
        console.log(`Error in /existingSemesters ${error}`);
        res.status(500).json({ message: "Error", error: error });
    }
}

export async function deleteSem(req, res) {
    try {
        const id = req.id;
        const { semester } = req.params;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $pull: { courses: { sem: semester } },
                $unset: { [`sem_total.${semester}`]: "" },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: `Deleted ${semester}`,
            data: updatedUser,
        });
    } catch (error) {
        console.log(`Error in deleteSem ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleAddCourses(req, res) {
    try {
        const id = req.id;
        const { course_name, code, credits, gradePoint, sem, category } =
            req.body;

        if (
            !course_name ||
            !code ||
            !credits ||
            !gradePoint ||
            !sem ||
            !category
        ) {
            return res.status(400).json({
                message: "Invalid fields",
            });
        }

        const existingCourse = await User.findOne({
            _id: id,
            "user_added_courses.code": code,
        });
        if (existingCourse) {
            return res
                .status(409)
                .json({ message: "The Course code already exists" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            {
                $push: {
                    user_added_courses: {
                        course_name,
                        code,
                        credits,
                        gradePoint,
                        sem,
                        category,
                        grade: gradeMap[gradePoint] || "NA",
                    },
                },
            },
            { new: true }
        );

        if (!user) {
            return res.status(401).json({
                message: "Error while adding course",
            });
        }
        return res.status(200).json({
            message: "Course added successfully",
            data: user,
        });
    } catch (e) {
        console.log(`Error while adding courses ${e}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleAddMultipleCourses(req, res) {

    try {
        const id = req.id;
        const { courses } = req.body;

        if (!Array.isArray(courses) || courses.length === 0) {

            return res.status(400).json({
                message: "Courses array is required"
            })
        }

        for (const course of courses) {
            const { course_name, code, credits, gradePoint, sem, category } = course;

            if (
                !course_name ||
                !code ||
                !credits ||
                !gradePoint ||
                !sem ||
                !category
            ) {
                return res.status(400).json({
                    message: "One or more courses have missing fields"
                });
            }
        }

        const codes = courses.map((c) => c.code);

        const existingCourse = await User.findOne({
            _id: id,
            "user_added_courses.code": { $in: codes },
        });

        if (existingCourse) {
            return res.status(409).json({
                message: "One or more course codes already exist",
            });
        }


        const formattedCourses = courses.map((c) => {
            const semNumber =
                typeof c.sem === "string" && c.sem.startsWith("sem")
                    ? Number(c.sem.replace("sem", ""))
                    : Number(c.sem);

            return {
                course_name: c.course_name,
                code: c.code,
                credits: Number(c.credits),
                gradePoint: Number(c.gradePoint),
                sem: semNumber,
                category: c.category,
                grade: gradeMap[Number(c.gradePoint)] || "NA",
            };
        });


    const user = await User.findByIdAndUpdate(
        id,
        {
            $push: {
                user_added_courses: {
                    $each: formattedCourses,
                },
            },
        },
        { new: true }
    );

    if (!user) {
        return res.status(401).json({
            message: "Error while adding courses",
        });
    }

    return res.status(200).json({
        message: "Courses added successfully",
        data: user,
    });
} catch (e) {
    console.error(`Error while adding courses ${e}`);
    return res.status(500).json({
        message: "Internal server error",
    });
}

}

export async function handleDeleteCourses(req, res) {
    try {
        const id = req.id;
        const { code } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $pull: {
                    user_added_courses: { code: code },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: `Deleted course with code: ${code}`,
            data: updatedUser,
        });
    } catch {
        console.log(`Error while deleting courses ${e}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleCourseUpdate(req, res) {
    try {
        const id = req.id;
        const {
            courseId,
            course_name,
            code,
            credits,
            dept,
            gradePoint,
            sem,
            category,
        } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: id,
                "user_added_courses._id": courseId,
            },
            {
                $set: {
                    "user_added_courses.$.course_name": course_name,
                    "user_added_courses.$.code": code,
                    "user_added_courses.$.credits": credits,
                    "user_added_courses.$.dept": dept,
                    "user_added_courses.$.gradePoint": gradePoint,
                    "user_added_courses.$.grade": gradeMap[gradePoint],
                    "user_added_courses.$.sem": sem,
                    "user_added_courses.$.category": category,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res
                .status(404)
                .json({ message: "User or Course not found" });
        }

        return res.status(200).json({
            message: "Course updated successfully",
            user_added_courses: updatedUser,
        });
    } catch (e) {
        console.log(`Error while updating course ${e}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleGetUserAddedCourses(req, res) {
    try {
        const id = req.id;
        const { user_added_courses } = await User.findById(id).select(
            "user_added_courses"
        );
        if (!user_added_courses) {
            return res.status(404).json({
                message: "No courses found",
            });
        }
        return res.status(200).json({
            message: "Courses retrieved successfully",
            user_added_courses,
        });
    } catch (e) {
        console.log(`Error while retrieving courses ${e}`);
        res.status(500).json({ message: "Internal server error" });
    }
}
