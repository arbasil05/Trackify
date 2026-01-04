# Trackify Project Documentation

## Overview
Trackify is a full-stack academic progress tracker that allows users to upload semester result PDFs, automatically parses course data, and visualizes academic progress, CGPA, and credit distribution.

---

## Project Structure

```
Non-Scoft-Trackify/
├── Backend/
│   ├── config/           # Database config
│   ├── controller/       # Route controllers (auth, feedback, semester, user)
│   ├── middleware/       # Custom middlewares (auth, PDF parsing, validation)
│   ├── models/           # Mongoose models (User, NonScoftCourse, etc.)
│   ├── routes/           # Express route definitions
│   ├── utils/            # Utility functions
│   ├── package.json      # Backend dependencies
│   └── server.js         # Express app entry point
├── Frontend/
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite config
└── README.md
```

---


## Backend Flow: PDF Upload & Data Update (with Variable Details)

1. **User uploads a PDF** via the frontend ("Upload Sem Result").
2. **Route:** POST `/api/semester/upload` (see `Backend/routes/semesterRoutes.js`)
   - **Middlewares:**
     - `authMiddleware`: Verifies user authentication, attaches user ID to `req.id`.
     - `multer`: Handles file upload, attaches file buffer to `req.file.buffer`.
     - `pdfMiddleware`: Parses PDF, extracts course info, attaches parsed array to `req.subjects`.
   - **Controller:** `uploadFile` in `semesterController.js` processes the parsed data.
3. **PDF Parsing (pdfMiddleware.js):**
   - **`req.file.buffer`**: Contains the raw PDF file data.
   - **`pdfParse(dataBuffer)`**: Extracts text from the PDF.
   - **`text`**: The extracted text from the PDF.
   - **`subjectRegex`**: Regex pattern to extract course details (code, name, grade, credits, etc.).
   - **`subjects` (array):** Each element is an object with parsed course info (code, name, grade, credits, etc.).
   - **`req.subjects`**: The array of parsed course objects, passed to the next middleware/controller.
4. **Database Update (uploadFile in semesterController.js):**
   - **`id`**: User ID from `req.id`.
   - **`user`**: The user document fetched from the database.
   - **`subs`**: Alias for `req.subjects`, the array of parsed courses.
   - **`courseEntries` (array):** Prepared array of course records to be added to the user (each with course ID, grade, gradePoint, sem, category, etc.).
   - **`existingSemCourses` (array):** User's courses for the current semester.
   - **`total_sem_credits` (number):** Sum of credits for the new courses being added this upload.
   - **`semTotalUpdate` (object):** Key-value pair to update the user's semester total credits (e.g., `{ 'sem_total.Sem1': 24 }`).
   - **`User.courses` (array):** Stores all course records for the user, each referencing a NonScoftCourse document.
   - **`User.sem_total` (object):** Maps semester names to total credits earned in that semester.
5. **Frontend Data Refresh:**
   - The frontend calls `/api/user/courseByUser` to fetch updated user stats.
   - **Backend controller (`userController.js`):**
     - **`user.courses`**: Populated with NonScoftCourse documents for each course.
     - **`courseDetails` (array):** Each element contains course name, codes, credits, category, grade, gradePoint, and semester.
     - **`totalCredits` (number):** Sum of all credits (excluding non-CGPA courses).
     - **`CGPA` (number):** Weighted average of grade points, calculated as `totalWeightedPoints / totalCredits`.
     - **`user_sem_credits` (object):** Maps semester names to total credits (from `user.sem_total`).


---


## Models (with Field Descriptions)

### User
- **name, email, reg_no, grad_year, dept, password**: User profile fields.
- **sem_total (object):** Maps semester names (e.g., 'Sem1') to total credits earned in that semester.
- **courses (array):** Each element is an object:
   - `course`: ObjectId reference to a NonScoftCourse document.
   - `gradePoint`: Numeric grade point for the course.
   - `grade`: Letter grade for the course.
   - `sem`: Semester name (e.g., 'Sem1').
   - `category`: Course category (e.g., 'HS', 'PC', etc.).
   - `code19`, `code24`: Course codes for different schemes.

### NonScoftCourse
- **name**: Course name.
- **code19, code24**: Course codes for different academic schemes.
- **credits**: Number of credits for the course.
- **department (object):** Maps department names to course categories (e.g., `{ CSE: 'PC', ECE: 'ES' }`).


---


## Frontend Flow (with Variable Details)
- Built with React (Vite).
- **User.jsx** (main user dashboard page):
   - **`userDetails` (object):** Stores user profile info (name, email, reg_no, dept, grad_year).
   - **`userSem` (object):** Maps semester names to total credits (from backend `user_sem_credits`).
   - **`courseDetails` (array):** List of all user courses with details (name, code, credits, grade, etc.).
   - **`CGPA` (number):** User's current CGPA, displayed on dashboard.
   - **`totalCredits` (number):** Total credits earned, displayed on dashboard.
   - **`runningTotal` (object):** Category-wise credit totals (HS, BS, ES, PC, PE, OE, EEC, MC).
- **Upload Sem Result** button triggers PDF upload, which updates backend and refreshes all the above variables.


---


## Key Endpoints
- `POST /api/semester/upload` — Upload semester PDF (expects a PDF file in the `pdf` field)
- `GET /api/user/courseByUser` — Get user stats and course breakdown (returns user profile, CGPA, total credits, semester credits, and course details)


---

## Common Issues & Fixes
- **Switching to NonScoftCourse:** Ensure the User model references `NonScoftCourse` and all population logic is updated accordingly.
- **Stats not updating:** Check backend controller logic and ensure correct population and calculation.

---

## Usage Instructions
1. Start MongoDB and backend server (`npm start` in Backend).
2. Start frontend (`npm run dev` in Frontend).
3. Register/login, then upload a semester PDF.
4. Dashboard updates with parsed results and stats.

---

## Flowchart

```mermaid
graph TD;
    A[User uploads PDF] --> B[Express route /upload]
    B --> C[authMiddleware]
    C --> D[multer (file upload)]
    D --> E[pdfMiddleware (parse PDF)]
    E --> F[Query NonScoftCourse]
    F --> G[Controller: uploadFile]
    G --> H[Update User.courses & sem_total]
    H --> I[Frontend fetches /courseByUser]
    I --> J[Dashboard updates]
```

---

## Contributors
- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite

---

For further details, see code comments and individual module READMEs.
