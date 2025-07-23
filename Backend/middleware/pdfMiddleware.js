import fs from 'fs';

// Load the data from courses.json
const dataRaw = fs.readFileSync('./courses.json', 'utf8');
const data = JSON.parse(dataRaw); // courses.json is a flat array

export const pdfMiddleware = async (req, res, next) => {
  if (!req.file || !req.file.buffer) {
    return next(new Error('No PDF file buffer found in req.file.buffer'));
  }

  const dataBuffer = req.file.buffer;

  try {
    // Dynamic import to load 'pdf-parse' only when needed
    const pdfModule = await import('pdf-parse');
    const pdf = pdfModule.default;

    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text;

    // Set the extracted text to req.body.text
    req.body.text = text;

    // Proceed with subject extraction
    const subjects = [];
    const subjectRegex = /(EVEN|ODD|ODD-JUNIOR)(\d+[A-Z]+\d+)-([\s\S]*?)(\d{1,2}[A-Z]\+?\d?)Pass/g;
    let match;

    while ((match = subjectRegex.exec(text)) !== null) {
      const code = match[2]; // e.g., 19EN101
      let name = match[3];   // Description text

      // Clean up the name: replace newlines with spaces and trim
      name = name.replace(/\n+/g, ' ').trim();

      // Remove any leaked subject patterns
      name = name.replace(/(EVEN|ODD|ODD-JUNIOR)\d+[A-Z]+\d+-.*$/, '').trim();

      // Create initial subject object
      const subject = { code, name };

      // Search for matching entry in data
      const matchedEntry = data.find(entry => {
        const codeMatch = (entry.code24 === code) || (entry.code19 === code);
        const title = entry.name || '';
        const nameMatch = title.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(title.toLowerCase());
        return codeMatch || nameMatch;
      });

      if (matchedEntry) {
        // Enrich subject with all required fields from courses.json
        subject.code19 = matchedEntry.code19;
        subject.code24 = matchedEntry.code24;
        subject.credits = matchedEntry.credits;
        subject.category = matchedEntry.category;
        subject.name = matchedEntry.name; // Use the exact name from courses.json
      } else {
        // Handle no match
        console.warn(`No match found for code: ${code}, name: ${name}`);
        subject.code19 = null;
        subject.code24 = null;
        subject.credits = 0;
        subject.category = 'Unknown';
      }

      subjects.push(subject);
    }

    // Attach enriched subjects to req for use in subsequent middleware/routes
    req.subjects = subjects;

    // Call next() to continue
    next();
  } catch (err) {
    console.error('Error parsing PDF:', err);
    next(err); // Pass error to Express error handler
  }
};