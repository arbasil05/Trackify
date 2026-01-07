import { useState } from "react";
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

    const handleChange = (key, value) => {
        setCourse((prev) => ({ ...prev, [key]: value }));
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

            <input
                placeholder="Course Name"
                onChange={(e) => handleChange("course_name", e.target.value)}
            />
            <input
                placeholder="Course Code"
                onChange={(e) => handleChange("code", e.target.value)}
            />
            <div className="row-flex">
                <input
                    type="number"
                    placeholder="Credits"
                    onChange={(e) => handleChange("credits", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Grade Point"
                    onChange={(e) => handleChange("gradePoint", e.target.value)}
                />
            </div>
            <select onChange={(e) => handleChange("sem", e.target.value)}>
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                        {sem}
                    </option>
                ))}
            </select>

            <select onChange={(e) => handleChange("category", e.target.value)}>
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
