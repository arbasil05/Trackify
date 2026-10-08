// Shared constants used across the application

export const SCOFT_DEPARTMENTS = ["CSE", "AIML", "AIDS", "IOT", "IT", "CYBER"];

export const CATEGORY_CREDIT_REQUIREMENTS = {
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
