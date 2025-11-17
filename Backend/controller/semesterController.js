import Course from "../models/Course.js";
import User from "../models/User.js";

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
        if (!Array.isArray(subs) || subs.length === 0) {
            return res.status(400).json({ error: "Check if the PDF is correct and has selectable text" });
        }

        const existingSemCourses = user.courses.filter(
            c => c.sem === req.body.sem
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
                console.warn(`Skipping course: No valid query fields in ${JSON.stringify(course)}`);
                continue;
            }

            const courseEntry =
                queryConditions.length > 1
                    ? await Course.findOne({ $or: queryConditions })
                    : await Course.findOne(queryConditions[0]);

            if (!courseEntry) {
                console.log(`Course not found: ${course.name || course.code19 || course.code24}`);
                continue;
            }

            // Updated: Check for duplicates globally across ALL user courses (any semester), not just the current sem
            const alreadyExists = user.courses.some(
                ec => ec.course._id.toString() === courseEntry._id.toString()
            );
            if (alreadyExists) {
                console.log(`Duplicate found: ${courseEntry.name}`);
                continue;
            }

            total_sem_credits += courseEntry.credits;

            courseEntries.push({
                course: courseEntry._id,
                grade: course.grade,
                gradePoint: course.gradePoint,
                sem: req.body.sem,
                category: courseEntry.department[userDept]
                    ? courseEntry.department[userDept]
                    : courseEntry.department[Object.keys(courseEntry.department)[0]],
                code19: course.code19,
                code24: course.code24
            });
        }

        if (courseEntries.length === 0) {
            return res.status(400).json({ error: "No new valid courses found to append" });
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
        const semesters = [...new Set(user.courses.map(course => course.sem))];
        res.status(200).json({ semesters });
    } catch (error) {
        console.log(`Error in /existingSemesters ${error}`);
        res.status(500).json({ message: "Error", error: error });
    }
}

export async function deleteSem(req, res) {
    try {
        const id = req.id;
        const { semester } = req.params

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $pull: { courses: { sem: semester } },
                $unset: { [`sem_total.${semester}`]: "" }
            },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: `Deleted ${semester}`, data: updatedUser });
    }
    catch (error) {
        console.log(`Error in deleteSem ${error}`);
        res.status(500).json({ message: "Internal server error" });

    }

}