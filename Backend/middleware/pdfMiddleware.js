import fs from "fs";

const dataRaw = fs.readFileSync("./scoft_courses.json", "utf8");
const data = JSON.parse(dataRaw); // scoft_courses.json is a flat array

export const pdfMiddleware = async (req, res, next) => {
    if (!req.file || !req.file.buffer) {
        return next(new Error("No PDF file buffer found in req.file.buffer"));
    }

    const dataBuffer = req.file.buffer;

    try {
        const pdfModule = await import("pdf-parse");
        const pdf = pdfModule.default;

        const pdfData = await pdf(dataBuffer);
        let text = pdfData.text;
        console.log(text);


        // Clean up text if necessary
        text = text.replace(/ODD\W+JUNIOR/g, "ODDJUNIOR");

        // Set the extracted text to req.body.text
        req.body.text = text;
        console.log("Before regex");

        console.log(req.body.text);


        const subjects = [];
        // Capture: semType, code, name, gradePoint, grade, credit
        // Example: ODD 19CS415-Cryptography 8  A 3 Pass
        // Regex groups: 1-semester type, 2-code, 3-name, 4-gradePoint, 5-grade, 6-credit
        const subjectRegex =
            /(EVEN|ODD|ODDJUNIOR)\s*(\d+[A-Z]+\d+)-([\s\S]*?)(\d{1,2})\s*([A-Z]\+?)\s*(\d+)\s*Pass/g;

        let match;

        while ((match = subjectRegex.exec(text)) !== null) {
            const code = match[2];
            let name = match[3];
            const gradePoint = Number(match[4]);
            const grade = match[5];
            const credit = Number(match[6]);

            // Clean up name
            name = name.replace(/\n+/g, " ").trim();
            name = name
                .replace(/(EVEN|ODD|ODD-JUNIOR)\d+[A-Z]+\d+-.*$/, "")
                .trim();

            // Create initial subject object
            const subject = { code, name, gradePoint, grade, credit };

            // Search for matching entry in data
            const matchedEntry = data.find((entry) => {
                const codeMatch =
                    entry.code24 === code || entry.code19 === code;
                const title = entry.name || "";
                const nameMatch =
                    title.toLowerCase() === name.toLowerCase() ||
                    name.toLowerCase() === title.toLowerCase();
                return codeMatch || nameMatch;
            });

            if (matchedEntry && (matchedEntry.category !== "OE" || matchedEntry.category !== "Unknown")) {
                subject.code19 = matchedEntry.code19;
                subject.code24 = matchedEntry.code24;
                subject.credits = matchedEntry.credits;
                subject.category = matchedEntry.category;
                subject.name = matchedEntry.name; // Use name from scoft_courses.json
                if (matchedEntry.department) {
                    subject.department = matchedEntry.department;
                }
            } else {
                continue;
            }

            subjects.push(subject);
        }

        // Attach info for further use
        req.subjects = subjects;

        // PROTIP: If you only want grade points and codes, you can filter here:
        // req.gradePoints = subjects.map(s => ({ code: s.code, gradePoint: s.gradePoint }));

        next();
    } catch (err) {
        console.error("Error parsing PDF:", err);
        next(err);
    }
};
