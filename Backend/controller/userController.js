import User from "../models/User.js";
import Course from "../models/Course.js";
import NonScoftCourse from "../models/NonScoftCourse.js";

const SCOFT_DEPARTMENTS = ["CSE", "AIML", "AIDS", "IOT", "IT", "CYBER"];


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
        // console.log(`User department : ${userDept}`);

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

        const nonCGPACourses = ["19MC805", "19MC804", "SH6707", "19EY707", "19MC801", "19MC807", "19MC808", "19MC809"];

        const courseDetails = user.courses
            .map(({ course, grade, gradePoint, sem, category, code19, code24 }) => {
                if (!course) return null;
                if (nonCGPACourses.includes(course.code19) || nonCGPACourses.includes(course.code24)) {
                    totalCredits += 0;
                    totalWeightedPoints += 0;
                } else {
                    totalCredits += course.credits;
                    totalWeightedPoints +=
                        course.credits != 0 && !isNaN(gradePoint)
                            ? course.credits * gradePoint
                            : 0;
                }

                let deptToAdd = course.department[userDept];

                if (!deptToAdd) {
                    deptToAdd = course.department[Object.keys(course.department)[0]];
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
                        // if (course.code19 === "19MC805" || course.code19 === "19MC804" || course.code24==="SH6707" || course.code19==="19EY707") break;
                        MC += course.credits;
                        break;
                    default:
                        break;
                }

                // console.log(HS, BS, ES, PC, PE, OE, EEC, MC);


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

        // console.log("MC : ", MC);

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
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
            totalCredits: HS + BS + ES + PC + PE + OE + EEC + MC,
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
        const { name, grad_year, dept, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, grad_year, dept },
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


export async function recommendation(req, res) {
    try {
        const id = req.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userName = user.name;
        const grad_year = user.grad_year;
        const userDept = user.dept;
        const user_courses = user.courses;
        const userCourseIds = user_courses.map(c => c.course.toString());

        const isUserScoft = SCOFT_DEPARTMENTS.includes(userDept);
        const targetModel = isUserScoft ? Course : NonScoftCourse;

        let recommendedCourses = await targetModel.find({
            [`department.${userDept}`]: { $exists: true },
            _id: { $nin: userCourseIds }
        });


        recommendedCourses = recommendedCourses.filter(course => {
            if (grad_year === "2027" && course.code19 === "NA") {
                return false;
            }
            if (grad_year !== "2027" && course.code24 === "NA") {
                return false;
            }
            return true;
        });


        const grouped = {};
        for (const course of recommendedCourses) {
            const category = course.department[userDept];
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(course);
        }


        const result = {};
        for (const [category, courses] of Object.entries(grouped)) {
            result[category] = courses;
        }

        const categoryOrder = ["HS", "BS", "ES", "PC", "PE", "EEC", "MC"];


        const orderedResult = {};
        for (const cat of categoryOrder) {
            if (result[cat]) {
                orderedResult[cat] = result[cat];
            }
        }

        res.status(200).json({
            recommendedCourses: orderedResult,
            userName: userName,
            grad_year: grad_year
        });

    } catch (error) {
        console.log(`Error in recommendation ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}
