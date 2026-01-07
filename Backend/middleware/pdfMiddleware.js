import Course from "../models/Course.js";


// Helper function to safely escape any regex special characters and remove null bytes
function sanitizeForRegex(str) {
    // Remove null bytes and other control characters
    str = str.replace(/[\0-\x1F\x7F]/g, "");
    // Escape regex special characters
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async (req, res, next) => {
    if (!req.file || !req.file.buffer) {
        return next(new Error("No PDF file buffer found in req.file.buffer"));
    }

    const dataBuffer = req.file.buffer;

    try {
        const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
        const pdfData = await pdfParse(dataBuffer);
        let text = pdfData.text;
        text = text.replace(/ODD\W+JUNIOR/g, "ODDJUNIOR");

        req.body.text = text;

        const subjects = [];
        // Regex to parse subject details in PDF text
        const subjectRegex = /(ODDJUNIOR|EVEN|ODD)\s*(\d*[A-Z]+\d+)-([\s\S]*?)(\d{1,2})\s*([A-Z]\+?)\s*(\d+)\s*Pass/gu;

        let match;
        while ((match = subjectRegex.exec(text)) !== null) {
            let code = match[2].trim();
            let rawName = match[3].replace(/\n+/g, " ").trim();
            const gradePoint = Number(match[4]);
            const grade = match[5];
            const credit = Number(match[6]);

            // Sanitize course name for regex query
            const safeName = sanitizeForRegex(rawName);

            const matchedEntry = await Course.findOne({
                $or: [
                    { code24: code.toUpperCase() },
                    { code19: code.toUpperCase() },
                    { name: new RegExp(`^${safeName}$`, "i") }
                ]
            }).lean();

            if (matchedEntry) {
                if (matchedEntry.category === "OE" || matchedEntry.category === "Unknown") {
                    continue;
                }

                subjects.push({
                    code,
                    name: matchedEntry.name,
                    gradePoint,
                    grade,
                    credit,
                    code19: matchedEntry.code19,
                    code24: matchedEntry.code24,
                    credits: matchedEntry.credits,
                    category: matchedEntry.category,
                    department: matchedEntry.department
                });
            } else {
                console.log(`No MongoDB match found for code: '${code}' or name: '${rawName}'`);
            }
        }

        req.subjects = subjects;
        next();
    } catch (err) {
        console.error("Error parsing PDF:", err);
        next(err);
    }
};

