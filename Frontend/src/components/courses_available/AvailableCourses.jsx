import { useState, useEffect, useMemo } from 'react';
import './AvailableCourses.css';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import SearchGuideModal from './SearchGuideModal';

const GRADE_OPTIONS = [
    { value: 10, label: "O (10)" },
    { value: 9, label: "A+ (9)" },
    { value: 8, label: "A (8)" },
    { value: 7, label: "B+ (7)" },
    { value: 6, label: "B (6)" },
    { value: 5, label: "C (5)" },
];

const AvailableCourses = ({ recommendedCourses, grad_year, Loading }) => {
    const { isDark: dark } = useTheme();
    const categories = Object.keys(recommendedCourses || {});

    // State for Master (Categories)
    const [activeCategory, setActiveCategory] = useState('');
    
    // State for Detail (Search)
    const [searchQuery, setSearchQuery] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    // State for Adding Course
    const [selectedCourseToAdd, setSelectedCourseToAdd] = useState(null);
    const [sem, setSem] = useState("");
    const [gradePoint, setGradePoint] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    const handleAddCourse = async () => {
        if (!selectedCourseToAdd || !sem || !gradePoint) {
            toast.error("Select semester and grade");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/addFromDB`,
                {
                    courseId: selectedCourseToAdd._id,
                    sem,
                    gradePoint: Number(gradePoint),
                },
                { withCredentials: true }
            );

            toast.success("Course added successfully!");
            if (res.data?.newAchievements?.length > 0) {
                toast.success("🏆 Achievement Unlocked!", { duration: 5000 });
            }
            // Close modal
            setSelectedCourseToAdd(null);
            setSem("");
            setGradePoint("");
            
            // Trigger a page refresh to update recommended list
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to add course";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    // Derived state: filtered courses
    const currentCourses = recommendedCourses[activeCategory] || [];
    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) return currentCourses;
        const lowerQuery = searchQuery.toLowerCase();
        return currentCourses.filter(course => 
            course.name.toLowerCase().includes(lowerQuery) || 
            (course.code19 && course.code19.toLowerCase().includes(lowerQuery)) ||
            (course.code24 && course.code24.toLowerCase().includes(lowerQuery))
        );
    }, [currentCourses, searchQuery]);

    if (Loading || categories.length === 0) {
        return (
            <div className={`explore-app-layout ${dark ? 'dark' : ''}`}>
                <div className="explore-sidebar skeleton-sidebar">
                    <div className="skeleton-sidebar-item"></div>
                    <div className="skeleton-sidebar-item"></div>
                    <div className="skeleton-sidebar-item"></div>
                </div>
                <div className="explore-main">
                    <div className="explore-main-header">
                        <div className="skeleton-search"></div>
                    </div>
                    <div className="explore-app-grid">
                        {[1, 2, 3, 4, 5, 6].map((f) => (
                            <div className="explore-app-card skeleton-card" key={f}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`explore-app-layout ${dark ? 'dark' : ''}`}>
            
            {/* MASTER: Category Sidebar */}
            <div className="explore-sidebar">
                <h3 className="sidebar-title">Categories</h3>
                <div className="sidebar-menu">
                    {categories.map(cat => (
                        <button 
                            key={`cat-${cat}`}
                            className={`sidebar-menu-item ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory(cat);
                                setSearchQuery(''); // Reset search on category change
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <span className="cat-name">{cat}</span>
                            <span className="cat-count">{recommendedCourses[cat]?.length || 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* DETAIL: Course Grid & Search */}
            <div className="explore-main">
                
                <div className="explore-main-header">
                    <div className="explore-main-title">
                        <h2>{getCategoryFullName(activeCategory)}</h2>
                        <span className="category-total-badge">{currentCourses.length} Courses</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="explore-search-box" style={{ margin: 0 }}>
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder={`Search ${activeCategory} courses...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            className="btn outline" 
                            onClick={() => setShowGuide(true)}
                            title="How to search and add courses"
                            style={{ padding: '0 16px', height: '100%', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FontAwesomeIcon icon={faQuestionCircle} />
                            Guide
                        </button>
                    </div>
                </div>

                {filteredCourses.length > 0 ? (
                    <div className="explore-app-grid">
                        {filteredCourses.map(course => (
                            <div 
                                className="explore-app-card interactive" 
                                key={course._id}
                                onClick={() => setSelectedCourseToAdd(course)}
                                title="Click to add this course"
                            >
                                <div className="card-top">
                                    <span className="course-code">
                                        {grad_year === "2027" ? course.code19 : course.code24}
                                    </span>
                                    <span className="course-credits">{course.credits} Cr</span>
                                </div>
                                <h3 className="course-title">{course.name}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="explore-empty-state">
                        <p>No courses found matching "{searchQuery}"</p>
                        <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                            Clear Search
                        </button>
                    </div>
                )}
                
            </div>
            
            {selectedCourseToAdd && (
                <div className="modal-overlay">
                    <div className={`custom-modal narrow-modal add-course-modal ${dark ? 'dark' : ''}`}>
                        <div className="add-course-modal-header">
                            <h2>Add Course</h2>
                            <button className="close-btn" onClick={() => setSelectedCourseToAdd(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        
                        <div className="selected-course-card">
                            <div className="selected-course-info">
                                <h3>{selectedCourseToAdd.name}</h3>
                                <div className="course-card-tags">
                                    <span className="course-tag category-tag">{selectedCourseToAdd.category}</span>
                                    <span className="course-tag credit-tag">{selectedCourseToAdd.credits} Cr</span>
                                </div>
                            </div>

                            <div className="selected-course-fields">
                                <div className="field-group">
                                    <label>Semester</label>
                                    <select value={sem} onChange={(e) => setSem(e.target.value)}>
                                        <option value="">Select</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="field-group">
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

                        <div className="form-actions" style={{ marginTop: '24px' }}>
                            <button
                                className="btn proceed"
                                onClick={handleAddCourse}
                                disabled={submitting}
                                style={{ width: '100%' }}
                            >
                                {submitting ? "Adding..." : "Add to Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {showGuide && (
                <SearchGuideModal onClose={() => setShowGuide(false)} />
            )}
        </div>
    );
};

const getCategoryFullName = (code) => {
    switch (code) {
        case "HS": return "Humanities and Sciences"
        case "BS": return "Basic Sciences"
        case "ES": return "Engineering Sciences"
        case "PC": return "Professional Core"
        case "PE": return "Professional Electives"
        case "EEC": return "Employment Enhancement Courses"
        case "MC": return "Mandatory Courses"
        default: return code
    }
}

export default AvailableCourses;
