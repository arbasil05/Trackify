import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import "./SingleCourse.css";

const AddSingleCourseModal = ({ onClose, onSuccess }) => {
    const { isDark: dark } = useTheme();
    const [course, setCourse] = useState({
        course_name: "",
        code: "",
        credits: "",
        gradePoint: "",
        sem: "",
        category: "",
        isNonCgpa: false,
    });
    const [missingCoursesMap, setMissingCoursesMap] = useState({});
    const [autoFilled, setAutoFilled] = useState(false);

    useEffect(() => {
        const fetchMissingCourses = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API}/api/semester/missingCourses`,
                    { withCredentials: true }
                );
                const map = {};
                res.data.missingCourses?.forEach((c) => {
                    if (c.code) {
                        map[c.code.toUpperCase().trim()] = {
                            name: c.name,
                            credits: c.credits,
                            category: c.category,
                        };
                    }
                });
                setMissingCoursesMap(map);
            } catch (err) {
                console.log("Could not fetch missing courses for auto-fill");
            }
        };
        fetchMissingCourses();
    }, []);

    const handleChange = (key, value) => {
        setCourse((prev) => {
            const updated = { ...prev, [key]: value };

            // Auto-fill when code changes
            if (key === "code") {
                const normalizedCode = value.toUpperCase().trim();
                const match = missingCoursesMap[normalizedCode];
                if (match) {
                    updated.course_name = match.name || prev.course_name;
                    updated.credits = match.credits ?? prev.credits;
                    updated.category = match.category || prev.category;
                    setAutoFilled(true);
                } else {
                    setAutoFilled(false);
                }
            }

            return updated;
        });
    };

    const handleSubmit = async () => {
        const { course_name, code, credits, gradePoint, sem, category, isNonCgpa } =
            course;

        if (
            !course_name ||
            !code ||
            credits === "" ||
            gradePoint === "" ||
            !sem ||
            !category
        ) {
            toast.error("Fill all fields");
            return;
        }

        if (!Number.isInteger(Number(credits)) || credits < 0 || credits > 5) {
            toast.error("Credits must be 0–5");
            return;
        }

        if (
            !Number.isInteger(Number(gradePoint)) ||
            gradePoint < 1 ||
            gradePoint > 10
        ) {
            toast.error("Grade Point must be 1–10");
            return;
        }

        const codeRegex = /^\d{2}[A-Za-z]{2}\d{3}$/;
        if (!codeRegex.test(code)) {
            toast.error("Invalid Course Code Format (e.g., 19CS401)");
            return;
        }

        const formattedCode = code.toUpperCase();
        const formattedName = course_name.replace(/\b\w/g, c => c.toUpperCase());
        const payload = { ...course, code: formattedCode, course_name: formattedName };

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/addCourses`,
                payload,
                { withCredentials: true }
            );

            toast.success("Course added");
             if (res.data?.newAchievements?.length > 0) {
                 toast.success("🏆 Achievement Unlocked!", {
                     duration: 5000,
                 });
             }
            onSuccess();
        } catch (err) {
            toast.error("Failed to add course");
        }
    };

    return (
        <div className={`add-course-wrapper${dark ? " dark" : ""}`}>
            <h2>Add Course</h2>
            <p className="important-caption">
                Add only the courses that got missed
            </p>

            <div>
                <label className="field-label">Course Code</label>
                <input
                    placeholder="e.g., 19CS401"
                    value={course.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                />
            </div>
            <div>
                <label className="field-label">Course Name</label>
                <input
                    placeholder="e.g., Data Structures"
                    value={course.course_name}
                    onChange={(e) => handleChange("course_name", e.target.value)}
                />
            </div>
            {autoFilled && (
                <p style={{ color: "#4caf50", fontSize: "0.85rem", margin: "4px 0" }}>
                    Auto-filled from community data, Kindly check the details before submitting
                </p>
            )}
            <div className="row-flex">
                <div>
                    <label className="field-label">Credits</label>
                    <input
                        type="number"
                        placeholder="0-5"
                        value={course.credits}
                        onChange={(e) => handleChange("credits", e.target.value)}
                    />
                </div>
                <div>
                    <label className="field-label">Grade Point</label>
                    <input
                        type="number"
                        placeholder="1-10"
                        value={course.gradePoint}
                        onChange={(e) => handleChange("gradePoint", e.target.value)}
                    />
                </div>
            </div>
            <div className="row-flex">
                <div>
                    <label className="field-label">Semester</label>
                    <select value={course.sem} onChange={(e) => handleChange("sem", e.target.value)}>
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <option key={sem} value={sem}>
                                {sem}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="field-label">Category</label>
                    <select value={course.category} onChange={(e) => handleChange("category", e.target.value)}>
                        <option value="">Select Category</option>
                        <option value="HS">HS</option>
                        <option value="BS">BS</option>
                        <option value="ES">ES</option>
                        <option value="PC">PC</option>
                        <option value="PE">PE</option>
                        <option value="OE">OE</option>
                        <option value="EEC">EEC</option>
                        <option value="MC">MC</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", margin: "4px 0", gap: "8px" }}>
                <input
                    type="checkbox"
                    id="isNonCgpa"
                    style={{ width: "auto", margin: 0, cursor: "pointer" }}
                    checked={course.isNonCgpa}
                    onChange={(e) => handleChange("isNonCgpa", e.target.checked)}
                />
                <label htmlFor="isNonCgpa" className="field-label" style={{ marginBottom: 0, cursor: "pointer", display: "inline-block" }}>
                    Non CGPA Course
                </label>
                <div className="info-tooltip-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 32 32" fill="#4880ff" className="info-icon">
                        <path d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 Z M 15 10 L 15 12 L 17 12 L 17 10 Z M 15 14 L 15 22 L 17 22 L 17 14 Z"></path>
                    </svg>
                    <div className="tooltip-text">Excluded from CGPA calculation</div>
                </div>
            </div>

            <div className="form-actions">
                <button className="btn proceed" onClick={handleSubmit}>
                    Save
                </button>
                <button className="btn cancel" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddSingleCourseModal;
