// Shared constants used across the application

export const SCOFT_DEPARTMENTS = ["CSE", "AIML", "AIDS", "IOT", "IT", "CYBER"];

export const GRADE_MAP = {
    10: "O",
    9: "A+",
    8: "A",
    7: "B+",
    6: "B",
    5: "C"
};

// Returns grade letter for a given grade point, respecting grad_year.
// grad_year > 2028 → 10 maps to "S", otherwise "O".
export function getGrade(gradePoint, gradYear) {
    if (Number(gradePoint) === 10) {
        return Number(gradYear) > 2028 ? "S" : "O";
    }
    return GRADE_MAP[Number(gradePoint)] || "NA";
}
