import Achievement from "../models/Achievement.js";
import User from "../models/User.js";

const TOTAL_CREDITS_DATA = {
    "AIDS": { 2027: 164, default: 169 },
    "AIML": { 2027: 168, default: 168 },
    "CSE": { 2027: 164, default: 167 },
    "CYBER": { 2027: 169, default: 171 },
    "IOT": { 2027: 170, default: 171 },
    "IT": { 2027: 164, default: 167 },
    "ECE": { 2027: 169, default: 164 },
    "EEE": { 2027: 167, default: 165 },
    "MECH": { 2027: 169, default: 168 },
    "CIVIL": { 2027: 167, default: 165 },
    "BME": { 2027: 169, default: 168 },
    "MED": { 2027: 169, default: 169 },
    "EIE": { 2027: 165, default: 165 },
    "CHEM": { 2027: 166, default: 163 },
};

const CREDIT_REQUIREMENTS = {
    CSE: {
        2027: { HS: 11, BS: 23, ES: 25, PC: 58, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 25, ES: 25, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    IT: {
        2027: { HS: 11, BS: 23, ES: 25, PC: 58, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 25, ES: 25, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    AIDS: {
        2027: { HS: 14, BS: 21, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 23, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    AIML: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 27, ES: 28, PC: 51, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    CYBER: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 54, PE: 17, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    IOT: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    ECE: {
        2027: { HS: 13, BS: 24, ES: 28, PC: 58, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 21, ES: 23, PC: 61, PE: 15, EEC: 16, MC: 3, OE: 12 },
    },
    EEE: {
        2027: { HS: 13, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 11, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3, OE: 12 },
    },
    EIE: {
        2027: { HS: 11, BS: 25, ES: 25, PC: 58, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: NaN, BS: NaN, ES: NaN, PC: NaN, PE: NaN, EEC: NaN, MC: NaN, OE: NaN },
    },
    MECH: {
        2027: { HS: 13, BS: 24, ES: 26, PC: 54, PE: 21, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 10, BS: 25, ES: 29, PC: 55, PE: 18, EEC: 16, MC: 3, OE: 12 },
    },
    CIVIL: {
        2027: { HS: 13, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 10, BS: 22, ES: 25, PC: 62, PE: 15, EEC: 16, MC: 3, OE: 12 },
    },
    CHEM: {
        2027: { HS: 13, BS: 28, ES: 24, PC: 55, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 26, ES: 17, PC: 58, PE: 18, EEC: 16, MC: 3, OE: 12 },
    },
    BME: {
        2027: { HS: 13, BS: 27, ES: 29, PC: 57, PE: 12, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 10, BS: 23, ES: 30, PC: 60, PE: 18, EEC: 18, MC: 2, OE: 7 },
    },
    MED: {
        2027: { HS: 13, BS: 27, ES: 30, PC: 56, PE: 12, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: NaN, BS: NaN, ES: NaN, PC: NaN, PE: NaN, EEC: NaN, MC: NaN, OE: NaN },
    },
};

const BASE_CATEGORIES = ["HS", "BS", "ES", "PC", "PE", "OE", "EEC", "MC"];

const INITIAL_ACHIEVEMENTS = [
    {
        key: "CREDIT_50",
        title: "Half Century",
        description: "Earned 50 total credits",
        icon: "star-half-stroke",
        type: "TOTAL_CREDITS",
        condition: { threshold: 50 }
    },
    {
        key: "CREDIT_100",
        title: "Century Club",
        description: "Earned 100 total credits",
        icon: "trophy",
        type: "TOTAL_CREDITS",
        condition: { threshold: 100 }
    },
    {
        key: "DEGREE_COMPLETE",
        title: "Mission Accomplished",
        description: "Completed total credits required for degree",
        icon: "award",
        type: "TOTAL_CREDITS",
        condition: { dynamicThreshold: true } // New condition type
    },
    {
        key: "STRAIGHT_A_SEM",
        title: "Straight A's",
        description: "All grades A, A+ or O in a single semester",
        icon: "graduation-cap",
        type: "SEMESTER_GRADES",
        condition: { allowedGrades: ["A", "A+", "O"] }
    },
    {
        key: "SEM_30_CREDITS",
        title: "Heavy Lifter",
        description: "Completed 30+ credits in a single semester",
        icon: "dumbbell",
        type: "SEMESTER_CREDITS",
        condition: { threshold: 30 }
    },
    // Category achievements (generic, thresholds handled in logic)
    ...BASE_CATEGORIES.map(cat => ({
        key: `CATEGORY_COMPLETE_${cat}`,
        title: `${cat} Master`,
        description: `Completed all required credits for ${cat}`,
        icon: "layer-group",
        type: "CATEGORY_COMPLETE",
        category: cat,
        condition: { category: cat } // Logic will look up requirement
    }))
];

export const seedAchievements = async () => {
    try {
        for (const ach of INITIAL_ACHIEVEMENTS) {
            const exists = await Achievement.findOne({ key: ach.key });
            if (!exists) {
                await Achievement.create(ach);
                console.log(`Seeded achievement: ${ach.key}`);
            }
        }
    } catch (error) {
        console.error("Error seeding achievements:", error);
    }
};

/**
 * Evaluates achievements for a user and updates their profile.
 * @param {string} userId - The user ID to evaluate
 * @returns {Promise<Array<string>>} - Array of newly unlocked achievement keys
 */
export const evaluateAchievements = async (userId) => {
    try {
        const user = await User.findById(userId).populate("courses.course");
        if (!user) return [];

        // 1. Calculate stats
        let totalCredits = 0;
        const categoryCredits = { "HS": 0, "BS": 0, "ES": 0, "PC": 0, "PE": 0, "OE": 0, "EEC": 0, "MC": 0 };
        const semesterData = {}; // { "sem1": { credits: 0, grades: [] } }

        const processCourse = (c, isUserAdded = false) => {
            const credits = c.credits || 0;
            const category = c.category;
            const grade = c.grade;
            const sem = c.sem;

            // Only count valid courses towards totals
            // Logic mirrored from userController.js roughly
            // userController seems to filter isNonCGPA for totalCredits but not categories?
            // We will trust the credits value.

            const numericGrade = c.gradePoint; // Assuming this is available
            
            // Skip failed courses for "earned" credits?
            // Usually 'U' or 'F' means 0 credits earned. 
            // In the provided User.js, grade is String, gradePoint is Number.
            // If gradePoint is 0, usually implies fail.
            const isPass = c.gradePoint > 0;

            if (isPass) {
                totalCredits += credits;
                if (categoryCredits[category] !== undefined) {
                    categoryCredits[category] += credits;
                }

                if (!semesterData[sem]) {
                    semesterData[sem] = { credits: 0, grades: [] };
                }
                semesterData[sem].credits += credits;
                semesterData[sem].grades.push(grade);
            }
        };

        // Process parsed courses
        user.courses.forEach(c => {
             // Access nested course details if populated, or direct properties if flattened
             // User model has `course` as ObjectId ref.
             // But we need `credits` which is on the `Course` model, NOT the `User` model (except user_added_courses)
             // The User model `courses` array has `course` (ref), `gradePoint`, `grade`, `sem`, `category`.
             // `credits` is NOT on the User.courses items. It is on the referenced Course object.
             
             if (c.course && c.course.credits) {
                 processCourse({
                     ...c.toObject(),
                     credits: c.course.credits // Get credits from populated course
                 });
             }
        });

        // Process user added courses
        user.user_added_courses.forEach(c => {
            processCourse(c, true);
        });


        // 2. Fetch all active achievements
        const allAchievements = await Achievement.find({ isActive: true });
        const existingKeys = new Set(user.achievements.map(a => a.key));
        const newUnlocked = [];

        // 3. Check conditions
        for (const ach of allAchievements) {
            if (existingKeys.has(ach.key)) continue;

            let unlocked = false;
            const cond = ach.condition instanceof Map ? Object.fromEntries(ach.condition) : ach.condition;

            // Determine requirements for this user
            const yearKey = user.grad_year === "2027" ? "2027" : "2028";
            // Handle cases where dept might not be in our map fallback to something safe or strict
            const deptReqs = CREDIT_REQUIREMENTS[user.dept] && (CREDIT_REQUIREMENTS[user.dept][yearKey] || CREDIT_REQUIREMENTS[user.dept]["2028"]);
            
            // For Total Credits
            const totalReqMap = TOTAL_CREDITS_DATA[user.dept];
            const requiredTotal = totalReqMap ? (totalReqMap[yearKey] || totalReqMap.default) : 160;

            switch (ach.type) {
                case "TOTAL_CREDITS":
                    if (cond.dynamicThreshold) {
                         if (totalCredits >= requiredTotal) {
                            unlocked = true;
                         }
                    } else if (totalCredits >= cond.threshold) {
                        unlocked = true;
                    }
                    break;
                
                case "SEMESTER_CREDITS":
                    // Check if ANY semester meets the threshold
                    const threshold = cond.threshold;
                    for (const sem in semesterData) {
                        if (semesterData[sem].credits >= threshold) {
                            unlocked = true;
                            break;
                        }
                    }
                    break;

                case "SEMESTER_GRADES":
                    // Check if ANY semester has ONLY allowed grades
                    const allowed = new Set(cond.allowedGrades);
                    for (const sem in semesterData) {
                        const grades = semesterData[sem].grades;
                        if (grades.length > 0 && grades.every(g => allowed.has(g))) {
                            unlocked = true;
                            break;
                        }
                    }
                    break;

                case "CATEGORY_COMPLETE":
                    if (deptReqs) {
                        // Look up requirement for this specific category
                        const catReq = deptReqs[cond.category];
                        if (catReq && !isNaN(catReq) && categoryCredits[cond.category] >= catReq) {
                            unlocked = true;
                        }
                    } else if (cond.required && categoryCredits[cond.category] >= cond.required) {
                         // Fallback to legacy static requirement if dynamic data missing
                         unlocked = true;
                    }
                    break;
            }

            if (unlocked) {
                newUnlocked.push({ key: ach.key, unlockedAt: new Date() });
            }
        }

        // 4. Update User if needed
        if (newUnlocked.length > 0) {
            user.achievements.push(...newUnlocked);
            await user.save();
            return newUnlocked.map(u => u.key);
        }

        return [];

    } catch (error) {
        console.error("Error evaluating achievements:", error);
        return [];
    }
};
