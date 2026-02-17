import NonScoftCourse from "../models/NonScoftCourse.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import MissingCourse from "../models/MissingCourse.js";
import { waitUntil } from "@vercel/functions";
import { evaluateAchievements } from "../services/achievementService.js";
import { SCOFT_DEPARTMENTS, GRADE_MAP } from "../utils/constants.js";

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

        const newAchievements = await evaluateAchievements(id);

        return res.status(200).json({
            message: "Courses appended successfully",
            courseEntries,
            missing_subs,
            userCourses: updatedUser.courses,
            newAchievements
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
        // console.log(`Error in /existingSemesters ${error}`);
        res.status(500).json({ message: "Error", error: error });
    }
}

export async function deleteSem(req, res) {
    try {
        const id = req.id;
        const { semester } = req.params;
        const semNumber = semester.replace("sem", "");

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $pull: {
                    courses: { sem: semester },
                    user_added_courses: { sem: semNumber },
                },
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
        let courses = req.body;

        if (
            !courses ||
            (Array.isArray(courses) && courses.length === 0) ||
            (typeof courses === "object" && Object.keys(courses).length === 0)
        ) {
            return res.status(400).json({
                message: "No courses provided",
            });
        }

        if (!Array.isArray(courses)) {
            courses = [courses];
        }

        for (const course of courses) {
            const { course_name, code, credits, gradePoint, sem, category } =
                course;

            if (
                !course_name ||
                !code ||
                !credits ||
                !gradePoint ||
                !sem ||
                !category
            ) {
                return res.status(400).json({
                    message: "One or more courses have missing fields",
                });
            }
        }

        const codes = courses.map((c) => c.code);

        const user = await User.findById(id).populate("courses.course");

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        const existsInUserAdded = user.user_added_courses.some((course) =>
            codes.includes(course.code)
        );

        const existsInCourses = user.courses.some((courseEntry) => {
            const course = courseEntry.course;
            return (
                codes.includes(course.code19) || codes.includes(course.code24)
            );
        });

        if (existsInUserAdded || existsInCourses) {
            return res.status(409).json({
                message:
                    "One or more course codes already exist in your courses",
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
                grade: GRADE_MAP[Number(c.gradePoint)] || "NA",
                isNonCgpa: c.isNonCgpa || false,
            };
        });

        const updatedUser = await User.findByIdAndUpdate(
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

        if (!updatedUser) {
            return res.status(401).json({
                message: "Error while adding courses",
            });
        }
        const trackMissingCourses = Promise.all(
            formattedCourses.map((c) =>
                MissingCourse.findOneAndUpdate(
                    { code: c.code },
                    {
                        // set only upon insert and not on updates
                        $setOnInsert: {
                            name: c.course_name,
                            category: c.category,
                            credits: c.credits,
                        },
                        // add user id to submittedBy array
                        $addToSet: { submittedBy: id },
                    },
                    { upsert: true }

                ).catch((err) => console.log("MissingCourse tracking failed:", err.message))
            )
        );
        if (typeof waitUntil === "function") {
            waitUntil(trackMissingCourses);
        } else {
            trackMissingCourses.catch(() => { }); // fire and forget 
        }

        const newAchievements = await evaluateAchievements(id);

        return res.status(200).json({
            message: "Courses added successfully",
            data: updatedUser,
            newAchievements
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
    } catch (e) {
        console.log(`Error while deleting courses ${e}`);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// this is for editing user added courses in the user profile page

export async function handleCourseUpdate(req, res) {
    try {
        const id = req.id;
        const {
            courseId,
            course_name,
            code,
            credits,
            gradePoint,
            sem,
            category,
            isNonCgpa,
        } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const user = await User.findById(id).populate("courses.course");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        /* -------------------- DUPLICATE CHECKS -------------------- */


        const existsInUserAdded = user.user_added_courses.some(
            (course) =>
                course.code === code &&
                course._id.toString() !== courseId
        );


        const existsInCourses = user.courses.some((courseEntry) => {
            const course = courseEntry.course;
            return (
                course.code19 === code ||
                course.code24 === code
            );
        });

        if (existsInUserAdded || existsInCourses) {
            return res.status(409).json({
                message: "Course code already exists in your courses",
            });
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
                    "user_added_courses.$.credits": Number(credits),
                    "user_added_courses.$.gradePoint": Number(gradePoint),
                    "user_added_courses.$.grade": GRADE_MAP[Number(gradePoint)] || "NA",
                    "user_added_courses.$.sem": Number(sem),
                    "user_added_courses.$.category": category,
                    "user_added_courses.$.isNonCgpa": isNonCgpa !== undefined ? isNonCgpa : false,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res
                .status(404)
                .json({ message: "User or Course not found" });
        }
const newAchievements = await evaluateAchievements(id);

        return res.status(200).json({
            message: "Course updated successfully",
            user_added_courses: updatedUser.user_added_courses,
            newAchievements

        });
    } catch (e) {
        console.log(`Error while updating course ${e}`);
        return res.status(500).json({
            message: "Internal server error",
        });
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
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleGetAllCourses(req, res) {
    try {
        const id = req.id;
        const user = await User.findById(id)
            .populate("courses.course")
            .select("courses user_added_courses");
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        const courses = user.courses.map((course) => ({
            ...course.toObject(),
            type: "parsed",
        }));

        const user_added_courses = user.user_added_courses.map((course) => ({
            ...course.toObject(),
            type: "manual",
        }));

        return res.status(200).json({
            message: "Courses Retrieved Successfully",
            courses: courses,
            user_added_courses: user_added_courses,
        });
    } catch (e) {
        console.log(`Error while fetching courses ${e}`);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllMissingCourses(req, res) {
    try {
        const missingCourses = await MissingCourse.find().select("-submittedBy -__v");
        return res.status(200).json({
            message: "Missing courses retrieved successfully",
            missingCourses,
        });
    } catch (e) {
        console.log(`Error while fetching missing courses ${e}`);
        res.status(500).json({ message: "Internal server error" });
    }
}


// controller is for editing courses in the Category page
//  doing this way cuz in the category page both user added and parsed courses exist
//  dont be too smart and refactor this

export async function handleEditCourse(req, res) {
    try {
        const id = req.id;

        if (!req.body) {
            return res.status(400).json({
                message: "Request body is empty or invalid content-type",
            });
        }

        const {
            courseId,
            type,
            course_name,
            code,
            credits,
            gradePoint,
            sem,
            category,
            isNonCgpa,
        } = req.body;

        if (!courseId || !type) {
            return res.status(400).json({
                message: "Course ID and type are required",
            });
        }

        const user = await User.findById(id).populate("courses.course");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (type === "manual") {
            // Check for duplicates if code is being updated
            if (code) {
                const existsInUserAdded = user.user_added_courses.some(
                    (c) => c.code === code && c._id.toString() !== courseId
                );

                const existsInCourses = user.courses.some((entry) => {
                    const c = entry.course;
                    return c.code19 === code || c.code24 === code;
                });

                if (existsInUserAdded || existsInCourses) {
                    return res.status(409).json({
                        message: "Course code already exists",
                    });
                }
            }

            const courseToUpdate = user.user_added_courses.id(courseId);
            if (!courseToUpdate) {
                return res.status(404).json({ message: "Course not found" });
            }

            if (course_name) courseToUpdate.course_name = course_name;
            if (code) courseToUpdate.code = code;
            if (credits) courseToUpdate.credits = Number(credits);
            if (gradePoint) {
                courseToUpdate.gradePoint = Number(gradePoint);
                courseToUpdate.grade = GRADE_MAP[Number(gradePoint)] || "NA";
            }
            if (sem) courseToUpdate.sem = sem;
            if (category) courseToUpdate.category = category;
            if (isNonCgpa !== undefined) courseToUpdate.isNonCgpa = isNonCgpa;

        } else if (type === "parsed") {
            const courseToUpdate = user.courses.id(courseId);
            if (!courseToUpdate) {
                return res.status(404).json({ message: "Course not found" });
            }

            // For parsed courses, we only update mutable fields
            if (gradePoint) {
                courseToUpdate.gradePoint = Number(gradePoint);
                courseToUpdate.grade = GRADE_MAP[Number(gradePoint)] || "NA";
            }
            if (sem) courseToUpdate.sem = sem;
            if (category) courseToUpdate.category = category;
        } else {
            return res.status(400).json({ message: "Invalid course type" });
        }

        await user.save();

        const courses = user.courses.map((course) => ({
            ...course.toObject(),
            type: "parsed",
        }));

        const user_added_courses = user.user_added_courses.map((course) => ({
            ...course.toObject(),
            type: "manual",
        }));

        // Note: handleEditCourse didn't have evaluateAchievements call in the provided snippet range in previous turns, 
        // but it modifies courses so it should trigger evaluation. 
        // I will add it here.
        const newAchievements = await evaluateAchievements(id);

        return res.status(200).json({
            message: "Course updated successfully",
            courses,
            user_added_courses,
            newAchievements
        });

    } catch (error) {
        console.error("Error in handleEditCourse:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function handleDeleteCourseByType(req, res) {
    try {
        const id = req.id;
        const { courseId, type } = req.body;

        if (!courseId || !type) {
            return res.status(400).json({
                message: "Course ID and type are required",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (type === "manual") {
            const courseToDelete = user.user_added_courses.id(courseId);
            if (!courseToDelete) {
                return res.status(404).json({ message: "Course not found" });
            }
            // Use $pull to remove
            await User.findByIdAndUpdate(id, {
                $pull: { user_added_courses: { _id: courseId } }
         
        
        // No achievement evaluation on deletion, per requirements
        
          });
        } else if (type === "parsed") {
            const courseToDelete = user.courses.id(courseId);
            if (!courseToDelete) {
                return res.status(404).json({ message: "Course not found" });
            }
            await User.findByIdAndUpdate(id, {
                $pull: { courses: { _id: courseId } }
            });
        } else {
            return res.status(400).json({ message: "Invalid course type" });
        }

        return res.status(200).json({
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.error("Error in handleDeleteCourseByType:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}




