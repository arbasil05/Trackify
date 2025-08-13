import User from "../models/User.js";
import Course from "../models/Course.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export async function register(req, res) {
    try {
        if (!req.body) {
            throw new Error("No data recieved");
        }

        const { name, email, reg_no, grad_year, dept, password } = req.body;

        if (!name || !email || !reg_no || !grad_year || !dept || !password) {
            throw new Error("Missing fields!");
        }

        const user = await User.create({
            name,
            email,
            reg_no,
            grad_year,
            dept,
            password,
        });

        // create the token for the session
        const token = jwt.sign({ id: user._id }, SECRET_JWT_KEY);

        console.log(`JWT Token generated successfully : ${token}`);

        // create cookie
        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000,
        // });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        console.log("Cookie set successfully!");
        res.status(201).json({ user: user, message: "Success" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exist" });
        }
        console.log(`Error in /signup ${error}`);
        res.status(500).json({ message: "Error", error: error });
    }
}

export async function login(req, res) {
    try {
        if (!req.body) {
            throw new Error("No data recieved");
        }

        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Missing Fields");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const validUser = await user.compare(password);
        console.log(validUser);
        if (!validUser) {
            throw new Error("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id }, SECRET_JWT_KEY);

        console.log(`JWT token : ${token}`);

        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000,
        // });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        console.log(`Cookie created Succesfully`);

        res.status(200).json({ user: user, message: "Success" });
    } catch (error) {
        console.log(`Error in /login ${error}`);
        res.status(401).json({ message: "Error while logging in" });
    }
}

export async function logout(req, res) {
    try {
        // res.clearCookie("jwt", {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000,
        // });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ message: "Log out successfull" });
    } catch (error) {
        console.log(`Error in logout ${error}`);
    }
}

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

        console.log("HELLO : ", req.subjects);
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
                return res.status(400).json({ error: "No new valid courses found to append" });
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



export async function userDetails(req, res) {
    try {
        const id = req.id;
        const user = await User.findOne({ _id: id });
        res.status(200).json({ user });
    } catch (error) {
        console.log(`Error in userDetails ${error}`);
        res.status(500).json({ message: "Internal server Error" });
    }
}

export async function courseByUser(req, res) {
    try {
        const id = req.id;
        const user = await User.findById(id).populate("courses.course");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const user_sem_credits = user.sem_total;
        const userDept = user.dept;
        console.log(`User department : ${userDept}`);


        let totalCredits = 0,
            totalWeightedPoints = 0,
            HS = 0,
            BS = 0,
            ES = 0,
            PC = 0,
            PE = 0,
            OE = 0,
            EEC = 0,
            MC = 0;

        const courseDetails = user.courses
            .map(({ course, grade, gradePoint, sem, category, code19, code24 }) => {
                if (!course) return null;
                totalCredits += course.credits;
                totalWeightedPoints +=
                    course.credits != 0 && !isNaN(gradePoint)
                        ? course.credits * gradePoint
                        : 0;
                console.log(course.name);

                let deptToAdd = course.department[userDept];

                if (!deptToAdd) {
                    deptToAdd = course.department[Object.keys(course.department)[0]];
                    console.log("moew", deptToAdd)
                }

                switch (deptToAdd) {
                    case "HS":
                        HS += course.credits;
                        break;
                    case "BS":
                        BS += course.credits;
                        break;
                    case "ES":
                        ES += course.credits;
                        break;
                    case "PC":
                        PC += course.credits;
                        break;
                    case "PE":
                        PE += course.credits;
                        break;
                    case "OE":
                        OE += course.credits;
                        break;
                    case "EEC":
                        EEC += course.credits;
                        break;
                    case "MC":
                        MC += course.credits;
                        break;
                    default:
                        break;
                }

                console.log(HS, BS, ES, PC, PE, OE, EEC, MC);


                return {
                    name: course.name,
                    code19: course.code19,
                    code24: course.code24,
                    credits: course.credits,
                    category,
                    grade,
                    gradePoint,
                    sem,
                };
            })
            .filter(Boolean);

        const CGPA =
            totalCredits > 0
                ? (totalWeightedPoints / totalCredits).toFixed(4)
                : null;

        console.log("MC : ", MC);

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                reg_no: user.reg_no,
                dept: user.dept,
                grad_year: user.grad_year,
            },
            runningTotal: {
                HS,
                BS,
                ES,
                PC,
                PE,
                OE,
                EEC,
                MC,
            },
            user_sem_credits,
            totalCredits,
            courseDetails,
            CGPA,
        });
    } catch (error) {
        console.log(`Error in credits ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateProfile(req, res) {
    try {
        const id = req.id;
        const { name, reg_no, grad_year, dept, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, reg_no, grad_year, dept },
            { new: true },
        )

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, data: updatedUser });
    }
    catch (error) {
        console.log(`Error in updateProfile ${error}`);

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