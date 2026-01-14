import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditCourseModal = ({ dark, courseData, onClose, onSuccess }) => {
    const [course, setCourse] = useState({
        course_name: courseData.course_name,
        code: courseData.code,
        credits: courseData.credits,
        gradePoint: courseData.gradePoint,
        sem: courseData.sem,
        category: courseData.category,
    });

    const handleChange = (key, value) => {
        setCourse(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const { course_name, code, credits, gradePoint, sem, category } = course;

        if (!course_name || !code || credits === "" || gradePoint === "" || !sem || !category) {
            toast.error("Fill all fields");
            return;
        }

        if (!Number.isInteger(Number(credits)) || credits < 0 || credits > 5) {
            toast.error("Credits must be 0–5");
            return;
        }

        if (!Number.isInteger(Number(gradePoint)) || gradePoint < 1 || gradePoint > 10) {
            toast.error("Grade Point must be 1–10");
            return;
        }

        const codeRegex = /^\d{2}[A-Za-z]{2}\d{3}$/;
        if (!codeRegex.test(code)) {
            toast.error("Invalid Course Code Format (e.g., 19CS401)");
            return;
        }

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/updateCourse`,
                {
                    courseId: courseData._id,
                    course_name,
                    code,
                    credits,
                    gradePoint,
                    sem,
                    category,
                },
                { withCredentials: true }
            );

            toast.success("Course updated");
            onSuccess();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to update course";

            toast.error(msg);
        }
    };


    return (
        <div className={`add-course-wrapper${dark ? " dark" : ""}`}>
            <h2>Edit Course</h2>
            <p className="important-caption">
                Update course details carefully
            </p>

            <div>
                <label className="field-label">Course Code</label>
                <input
                    id="edit-course-code"
                    placeholder="e.g., 19CS401"
                    value={course.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                />
            </div>
            <div>
                <label className="field-label">Course Name</label>
                <input
                    id="edit-course-name"
                    placeholder="e.g., Data Structures"
                    value={course.course_name}
                    onChange={(e) => handleChange("course_name", e.target.value)}
                />
            </div>

            <div className="row-flex">
                <div>
                    <label className="field-label">Credits</label>
                    <input
                        id="edit-course-credits"
                        type="number"
                        placeholder="0-5"
                        value={course.credits}
                        onChange={(e) => handleChange("credits", e.target.value)}
                    />
                </div>
                <div>
                    <label className="field-label">Grade Point</label>
                    <input
                        id="edit-course-grade"
                        type="number"
                        placeholder="1-10"
                        value={course.gradePoint}
                        onChange={(e) => handleChange("gradePoint", e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label className="field-label">Semester</label>
                <select
                    id="edit-course-sem"
                    value={course.sem}
                    onChange={(e) => handleChange("sem", e.target.value)}
                >
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
                <select
                    id="edit-course-category"
                    value={course.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                >
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

export default EditCourseModal;
