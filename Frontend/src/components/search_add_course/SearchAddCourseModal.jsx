import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/ThemeContext";
import "./SearchAddCourseModal.css";

const GRADE_OPTIONS = [
    { value: 10, label: "O (10)" },
    { value: 9, label: "A+ (9)" },
    { value: 8, label: "A (8)" },
    { value: 7, label: "B+ (7)" },
    { value: 6, label: "B (6)" },
    { value: 5, label: "C (5)" },
];

const SearchAddCourseModal = ({ onClose, onSuccess }) => {
    const { isDark: dark } = useTheme();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [sem, setSem] = useState("");
    const [gradePoint, setGradePoint] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const searchCourses = useCallback(async (q) => {
        if (q.trim().length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/searchCourses`,
                { params: { q: q.trim() }, withCredentials: true }
            );
            setResults(res.data.results || []);
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleQueryChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        setSelectedCourse(null);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchCourses(val), 300);
    };

    const handleSelect = (course) => {
        setSelectedCourse(course);
        setResults([]);
        setQuery("");
    };

    const handleClearSelection = () => {
        setSelectedCourse(null);
        setSem("");
        setGradePoint("");
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleSubmit = async () => {
        if (!selectedCourse || !sem || !gradePoint) {
            toast.error("Select a course and fill semester + grade");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/addFromDB`,
                {
                    courseId: selectedCourse._id,
                    sem,
                    gradePoint: Number(gradePoint),
                },
                { withCredentials: true }
            );

            toast.success("Course added!");
            if (res.data?.newAchievements?.length > 0) {
                toast.success("🏆 Achievement Unlocked! Check Profile", {
                    duration: 5000,
                });
            }
            onSuccess();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to add course";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`search-add-wrapper${dark ? " dark" : ""}`}>
            <h2>Search & Add Course</h2>
            <p className="search-description">
                Find a course from the database and add it to your profile
            </p>

            {!selectedCourse ? (
                <>
                    <div className="search-input-container">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search by course name or code..."
                            value={query}
                            onChange={handleQueryChange}
                        />
                    </div>

                    {loading && (
                        <div className="search-status">Searching...</div>
                    )}

                    {!loading && query.trim().length >= 2 && results.length === 0 && (
                        <div className="search-status">No courses found</div>
                    )}

                    {results.length > 0 && (
                        <div className="search-results-grid">
                            {results.map((course) => (
                                <div
                                    key={course._id}
                                    className="search-course-card"
                                    onClick={() => handleSelect(course)}
                                >
                                    <div className="course-card-header">
                                        <h3 className="course-card-title">{course.name}</h3>
                                        <div className="course-card-tags">
                                            <span className="course-tag category-tag">{course.category}</span>
                                            <span className="course-tag credit-tag">{course.credits} Cr</span>
                                        </div>
                                    </div>
                                    <div className="course-card-codes">
                                        {course.code19 !== "NA" && <span className="code-badge">19: {course.code19}</span>}
                                        {course.code24 !== "NA" && <span className="code-badge">24: {course.code24}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="selected-course-card">
                        <div className="selected-course-header">
                            <div className="selected-course-info">
                                <h3>{selectedCourse.name}</h3>
                                <div className="course-card-tags" style={{ marginTop: '8px', marginBottom: '8px' }}>
                                    <span className="course-tag category-tag">{selectedCourse.category}</span>
                                    <span className="course-tag credit-tag">{selectedCourse.credits} Cr</span>
                                    {selectedCourse.code19 !== "NA" && <span className="code-badge">19: {selectedCourse.code19}</span>}
                                    {selectedCourse.code24 !== "NA" && <span className="code-badge">24: {selectedCourse.code24}</span>}
                                </div>
                            </div>
                            <button className="change-btn" onClick={handleClearSelection}>
                                Change
                            </button>
                        </div>

                        <div className="selected-course-fields">
                            <div>
                                <label>Semester</label>
                                <select value={sem} onChange={(e) => setSem(e.target.value)}>
                                    <option value="">Select</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Grade</label>
                                <select value={gradePoint} onChange={(e) => setGradePoint(e.target.value)}>
                                    <option value="">Select</option>
                                    {GRADE_OPTIONS.map((g) => (
                                        <option key={g.value} value={g.value}>{g.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            className="btn proceed"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? "Adding..." : "Add Course"}
                        </button>
                        <button className="btn cancel" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {!selectedCourse && (
                <div className="form-actions">
                    <button className="btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchAddCourseModal;
