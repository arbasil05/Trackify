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

        const { name, reg_no, grad_year, dept, password } = req.body;

        if (!name || !reg_no || !grad_year || !dept || !password) {
            throw new Error("Missing fields!");
        }

        const user = await User.create({
            name,
            reg_no,
            grad_year,
            dept,
            password,
        });

        // create the token for the session
        const token = jwt.sign({ id: user._id }, SECRET_JWT_KEY);

        console.log(`JWT Token generated successfully : ${token}`);

        // create cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        // res.cookie('jwt', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 24 * 60 * 60 * 1000
        // })

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

        const { reg_no, password } = req.body;

        if (!reg_no || !password) {
            throw new Error("Missing Fields");
        }

        const user = await User.findOne({ reg_no });
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

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        // res.cookie('jwt', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 24 * 60 * 60 * 1000
        // })

        console.log(`Cookie created Succesfully`);

        res.status(200).json({ user: user, message: "Success" });
    } catch (error) {
        console.log(`Error in /login ${error}`);
        res.status(401).json({ message: "Error while logging in" });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        // res.cookie('jwt', token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: "none",
        //     maxAge: 24 * 60 * 60 * 1000
        // })

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

        // Process courses from req.subjects
        console.log("HELLO : ", req.subjects);
        const subs = req.subjects;
        if (!Array.isArray(subs) || subs.length === 0) {
            return res
                .status(400)
                .json({ error: "No valid subjects provided" });
        }

        let total_sem_credits = 0;

        // Find course ObjectIds
        await Promise.all(
            subs.map(async (course) => {
                console.log(course);

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

                console.log("Looking for:", queryConditions);

                if (queryConditions.length === 0) {
                    console.warn(
                        `Skipping course: No valid query fields in ${JSON.stringify(
                            course
                        )}`
                    );
                    return;
                }

                const courseEntry =
                    queryConditions.length > 1
                        ? await Course.findOne({ $or: queryConditions })
                        : await Course.findOne(queryConditions[0]);

                if (!courseEntry) {
                    console.log(
                        `Course not found: ${course.name || course.code19 || course.code24
                        }`
                    );
                    return;
                }

                total_sem_credits += courseEntry.credits;

                courseEntries.push({
                    course: courseEntry._id,
                    grade: course.grade,
                    gradePoint: course.gradePoint,
                    sem: req.body.sem,
                });
            })
        );

        console.log(total_sem_credits);

        const semName = req.body.sem;

        if (courseEntries.length === 0) {
            return res
                .status(400)
                .json({ error: "No valid courses found to append" });
        }

        const semTotalUpdate = {};
        semTotalUpdate[`sem_total.${semName}`] = total_sem_credits;

        // Append courses to User document
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $addToSet: { courses: { $each: courseEntries } },
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
            .map(({ course, grade, gradePoint, sem }) => {
                if (!course) return null;
                totalCredits += course.credits;
                totalWeightedPoints +=
                    course.credits != 0 && !isNaN(gradePoint)
                        ? course.credits * gradePoint
                        : 0;
                console.log(course.department[userDept]);

                switch (course.department[userDept]) {
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

                console.log(HS, BS ,ES,PC,PE,OE,EEC,MC);


        return {
            name: course.name,
            code: course.code,
            category: course.category,
            credits: course.credits,
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

    res.status(200).json({
        user: {
            name: user.name,
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
