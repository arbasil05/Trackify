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
        // Updated regex: Reorder alternation to prefer longer "ODDJUNIOR" first, with 'u' flag for Unicode
        const subjectRegex =
            /(ODDJUNIOR|EVEN|ODD)\s*(\d*[A-Z]+\d+)-([\s\S]*?)(\d{1,2})\s*([A-Z]\+?)\s*(\d+)\s*Pass/gu;

        let match;
        while ((match = subjectRegex.exec(text)) !== null) {
            let code = match[2];
            let name = match[3];
            const gradePoint = Number(match[4]);
            const grade = match[5];
            const credit = Number(match[6]);

            // Log the raw match for debugging
            console.log(`Matched: code='${code}', name='${name}', gradePoint=${gradePoint}, grade=${grade}, credit=${credit}`);

            // Clean up code and name
            code = code.trim();
            name = name.replace(/\n+/g, " ").trim();
            name = name
                .replace(/(ODDJUNIOR|EVEN|ODD)\s*\d*[A-Z]+\d+-.*$/, "")
                .trim();

            // Create initial subject object
            const subject = { code, name, gradePoint, grade, credit };

            // Search for matching entry in data with robust trimming and case normalization
            const codeClean = code.toUpperCase();
            const matchedEntry = data.find((entry) => {
                const code24 = (entry.code24 || '').trim().toUpperCase();
                const code19 = (entry.code19 || '').trim().toUpperCase();
                const codeMatch = code24 === codeClean || code19 === codeClean;

                const title = (entry.name || '').trim().toLowerCase();
                const cleanedName = name.trim().toLowerCase();
                const nameMatch = title === cleanedName || cleanedName === title;

                // Log for debugging
                if (codeMatch) console.log(`Code match found for ${codeClean} in JSON`);

                return codeMatch || nameMatch;
            });

            if (matchedEntry) {
                // Skip if category is "OE" or "Unknown"
                if (matchedEntry.category === "OE" || matchedEntry.category === "Unknown") {
                    console.log(`Skipping subject with code ${code} due to category: ${matchedEntry.category}`);
                    continue;
                }

                subject.code19 = matchedEntry.code19;
                subject.code24 = matchedEntry.code24;
                subject.credits = matchedEntry.credits;
                subject.category = matchedEntry.category;
                subject.name = matchedEntry.name; // Use name from scoft_courses.json
                if (matchedEntry.department) {
                    subject.department = matchedEntry.department;
                }
                subjects.push(subject);
            } else {
                // Log unmatched for debugging
                console.log(`No JSON match found for code: '${code}' or name: '${name}'`);
                continue;
            }
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
