import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./SingleCourse.css";

const AddSingleCourseModal = ({ dark, onClose, onSuccess }) => {
    const [course, setCourse] = useState({
        course_name: "",
        code: "",
        credits: "",
        gradePoint: "",
        sem: "",
        category: "",
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
        const { course_name, code, credits, gradePoint, sem, category } =
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

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/addCourses`,
                course,
                { withCredentials: true }
            );

            toast.success("Course added");
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
