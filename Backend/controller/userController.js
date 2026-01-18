import User from "../models/User.js";
import Course from "../models/Course.js";
import NonScoftCourse from "../models/NonScoftCourse.js";
import Achievement from "../models/Achievement.js";
import { evaluateAchievements } from "../services/achievementService.js";

const SCOFT_DEPARTMENTS = ["CSE", "AIML", "AIDS", "IOT", "IT", "CYBER"];


export async function getAchievements(req, res) {
    try {
        const achievements = await Achievement.find({ isActive: true }).select("key title description icon type category");
        res.status(200).json({ achievements });
    } catch (error) {
        console.error("Error fetching achievements:", error);
        res.status(500).json({ message: "Internal server error" });
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
        const userAddedCodes = user.user_added_courses.map(c => c.code);

        let recommendedCourses = await targetModel.find({
            [`department.${userDept}`]: { $exists: true },
            _id: { $nin: userCourseIds }
        });


        recommendedCourses = recommendedCourses.filter(course => {
            if (userAddedCodes.includes(course.code19) || userAddedCodes.includes(course.code24)) {
                return false;
            }
            if (grad_year === "2027" && (course.code19 === "NA" || !course.code19)) {
                return false;
            }
            if (grad_year !== "2027" && (course.code24 === "NA" || !course.code24)) {
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

export async function courseByUserWithUserAdded(req, res) {
    try {
        const id = req.id;

        // Auto-evaluate achievements if none exist or just to ensure consistency
        // This acts as a catch-all trigger for existing users
        const newAchievements = await evaluateAchievements(id);

        const user = await User.findById(id)
            .populate("courses.course")
            .select(
                "name email reg_no dept grad_year courses user_added_courses achievements"
            );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userDept = user.dept;

        /* ================= GLOBAL ACCUMULATORS ================= */
        let totalCredits = 0;
        let totalWeightedPoints = 0;

        let HS = 0,
            BS = 0,
            ES = 0,
            PC = 0,
            PE = 0,
            OE = 0,
            EEC = 0,
            MC = 0;

        const semCredits = {
            sem1: 0,
            sem2: 0,
            sem3: 0,
            sem4: 0,
            sem5: 0,
            sem6: 0,
            sem7: 0,
            sem8: 0,
        };

        const nonCGPACourses = [
            "19MC805",
            "19MC804",
            "SH6707",
            "19EY707",
            "19MC801",
            "19MC807",
            "19MC808",
            "19MC809",
        ];

        if (user.user_added_courses) {
            user.user_added_courses.forEach((c) => {
                if (c.isNonCgpa) {
                    nonCGPACourses.push(c.code);
                }
            });
        }

        /* ================= NORMAL COURSES ================= */
        const courseDetails = user.courses
            .map(({ course, grade, gradePoint, sem, category }) => {
                if (!course) return null;

                const isNonCGPA =
                    nonCGPACourses.includes(course.code19) ||
                    nonCGPACourses.includes(course.code24);

                if (!isNonCGPA) {
                    totalCredits += course.credits;
                    totalWeightedPoints +=
                        !isNaN(gradePoint) && course.credits !== 0
                            ? course.credits * gradePoint
                            : 0;
                }

                // ✅ FIXED semester aggregation
                if (course.credits > 0 && sem in semCredits) {
                    semCredits[sem] += course.credits;
                }

                let deptToAdd = course.department[userDept];
                if (!deptToAdd) {
                    deptToAdd =
                        course.department[
                        Object.keys(course.department)[0]
                        ];
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

        /* ================= USER ADDED COURSES ================= */
        const userAddedCourseDetails = user.user_added_courses.map(
            ({
                course_name,
                code,
                credits,
                grade,
                gradePoint,
                sem,
                category,
            }) => {
                const isNonCGPA = nonCGPACourses.includes(code);

                if (!isNonCGPA) {
                    totalCredits += credits;
                    totalWeightedPoints +=
                        !isNaN(gradePoint) && credits !== 0
                            ? credits * gradePoint
                            : 0;
                }

                const normalizedSem =
                    sem.startsWith("sem") ? sem : `sem${sem}`;

                // ✅ FIXED semester aggregation
                if (credits > 0 && normalizedSem in semCredits) {
                    semCredits[normalizedSem] += credits;
                }

                switch (category) {
                    case "HS":
                        HS += credits;
                        break;
                    case "BS":
                        BS += credits;
                        break;
                    case "ES":
                        ES += credits;
                        break;
                    case "PC":
                        PC += credits;
                        break;
                    case "PE":
                        PE += credits;
                        break;
                    case "OE":
                        OE += credits;
                        break;
                    case "EEC":
                        EEC += credits;
                        break;
                    case "MC":
                        MC += credits;
                        break;
                    default:
                        break;
                }

                return {
                    name: course_name,
                    code,
                    credits,
                    category,
                    grade,
                    gradePoint,
                    sem: normalizedSem,
                };
            }
        );

        const CGPA =
            totalCredits > 0
                ? (totalWeightedPoints / totalCredits).toFixed(4)
                : null;

        return res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                reg_no: user.reg_no,
                dept: user.dept,
                grad_year: user.grad_year,
                achievements: user.achievements || [],
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
            user_sem_credits: semCredits,
            totalCredits: HS + BS + ES + PC + PE + OE + EEC + MC,
            courseDetails,
            userAddedCourseDetails,
            courses: user.courses,
            user_added_courses: user.user_added_courses,
            CGPA,
            newAchievements
        });
    } catch (error) {
        console.log(`Error in combined credits ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}



