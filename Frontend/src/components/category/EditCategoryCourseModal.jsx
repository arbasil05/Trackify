import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditCategoryCourseModal = ({ dark, courseData, onClose, onSuccess }) => {

    // Helper to extract nice code to display
    const getCode = () => {
        if (courseData.type === 'manual') return courseData.code24; // Normalized to put code in code24/19
        // For parsed, pick the one that is not NA, or just join them
        if (courseData.code24 !== "NA") return courseData.code24;
        return courseData.code19;
    };

    // Helper to parse sem number
    const getSemNumber = (semString) => {
        if (!semString) return "";
        if (typeof semString === 'number') return semString;
        return semString.replace("sem", "");
    };

    const [course, setCourse] = useState({
        course_name: courseData.name || "",
        code: getCode(),
        credits: courseData.credits,
        gradePoint: courseData.gradePoint,
        sem: getSemNumber(courseData.sem),
        category: courseData.category,
    });

    const isParsed = courseData.type === 'parsed';

    const disabledStyle = {
        backgroundColor: dark ? "#374151" : "#e5e7eb",
        color: dark ? "#9ca3af" : "#6b7280",
        cursor: "not-allowed",
    };

    const handleChange = (key, value) => {
        setCourse(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        const { course_name, code, credits, gradePoint, sem, category } = course;

        if (!gradePoint || !sem || !category) {
            toast.error("Please fill all required fields");
            return;
        }

        // Additional validation for manual courses
        if (!isParsed) {
            if (!course_name || !code || credits === "") {
                toast.error("Fill all fields");
                return;
            }
            // Code regex check (same as in other modal)
            const codeRegex = /^\d{2}[A-Za-z]{2}\d{3}$/;
            if (!codeRegex.test(code)) {
                toast.error("Invalid Course Code Format (e.g., 19CS401)");
                return;
            }
        }

        if (!Number.isInteger(Number(gradePoint)) || gradePoint < 1 || gradePoint > 10) {
            toast.error("Grade Point must be 1–10");
            return;
        }

        // Prepare semester string based on type
        // Parsed -> "semX", Manual -> "X"
        const semPayload = isParsed ? `sem${sem}` : sem.toString();

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/editCourse`,
                {
                    courseId: courseData._id,
                    type: courseData.type,
                    course_name,
                    code,
                    credits,
                    gradePoint,
                    sem: semPayload,
                    category,
                },
                { withCredentials: true }
            );

            toast.success("Course updated successfully");
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
                {isParsed ? "You can only edit Grade and Semester for this course." : "Update course details."}
            </p>

            <div>
                <label className="field-label">Course Code</label>
                <input
                    id="edit-category-course-code"
                    placeholder="e.g., 19CS401"
                    value={course.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    disabled={isParsed}
                    style={isParsed ? disabledStyle : {}}
                />
            </div>
            <div>
                <label className="field-label">Course Name</label>
                <input
                    id="edit-category-course-name"
                    placeholder="e.g., Data Structures"
                    value={course.course_name}
                    onChange={(e) => handleChange("course_name", e.target.value)}
                    disabled={isParsed}
                    style={isParsed ? disabledStyle : {}}
                />
            </div>

            <div className="row-flex">
                <div>
                    <label className="field-label">Credits</label>
                    <input
                        id="edit-category-course-credits"
                        type="number"
                        placeholder="0-5"
                        value={course.credits}
                        onChange={(e) => handleChange("credits", e.target.value)}
                        disabled={isParsed}
                        style={isParsed ? disabledStyle : {}}
                    />
                </div>
                <div>
                    <label className="field-label">Grade Point</label>
                    <input
                        id="edit-category-course-grade"
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
                    id="edit-category-course-sem"
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
                    id="edit-category-course-category"
                    value={course.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    disabled={isParsed}
                    style={isParsed ? disabledStyle : {}}
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
export default EditCategoryCourseModal;
