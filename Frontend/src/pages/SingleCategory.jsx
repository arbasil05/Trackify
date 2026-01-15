import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faArrowUp, faArrowDown, faPencil, faTrash, faArrowsLeftRight, faUser, faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Modal from "react-modal";
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import emptyGhostAnimation from '../assets/lottie/empty-ghost.json';
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import MobileNavbar from '../components/mobile-navbar/MobileNavbar';
import EditCategoryCourseModal from "../components/category/EditCategoryCourseModal";
import { useAuth } from '../context/AuthContext';
import "./SingleCategory.css";

Modal.setAppElement("#root");

const categoryNames = {
    HS: "Humanities and science",
    BS: "Basic Sciences",
    ES: "Engineering Sciences",
    PC: "Professional Core",
    PE: "Professional Electives",
    EEC: "Employment Enhancement Courses",
    MC: "Mandatory Courses",
    OE: "Open Electives"
};

const creditRequirements = {
    CSE: {
        2027: { HS: 11, BS: 23, ES: 25, PC: 58, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 25, ES: 25, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    IT: {
        2027: { HS: 11, BS: 23, ES: 25, PC: 58, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 25, ES: 25, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    AIDS: {
        2027: { HS: 14, BS: 21, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 23, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    AIML: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 27, ES: 28, PC: 51, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    CYBER: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 54, PE: 17, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    IOT: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4, OE: 12 },
    },
    ECE: {
        2027: { HS: 13, BS: 24, ES: 28, PC: 58, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 21, ES: 23, PC: 61, PE: 15, EEC: 16, MC: 3, OE: 12 },
    },
    EEE: {
        2027: { HS: 13, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 11, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3, OE: 12 },
    },
    EIE: {
        2027: { HS: 11, BS: 25, ES: 25, PC: 58, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: NaN, BS: NaN, ES: NaN, PC: NaN, PE: NaN, EEC: NaN, MC: NaN, OE: NaN },
    },
    MECH: {
        2027: { HS: 13, BS: 24, ES: 26, PC: 54, PE: 21, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 10, BS: 25, ES: 29, PC: 55, PE: 18, EEC: 16, MC: 3, OE: 12 },
    },
    CIVIL: {
        2027: { HS: 13, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 10, BS: 22, ES: 25, PC: 62, PE: 15, EEC: 16, MC: 3, OE: 12 },
    },
    CHEM: {
        2027: { HS: 13, BS: 28, ES: 24, PC: 55, PE: 15, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 13, BS: 26, ES: 17, PC: 58, PE: 18, EEC: 16, MC: 3, OE: 12 },
    },
    BME: {
        2027: { HS: 13, BS: 27, ES: 29, PC: 57, PE: 12, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: 10, BS: 23, ES: 30, PC: 60, PE: 18, EEC: 18, MC: 2, OE: 7 },
    },
    MED: {
        2027: { HS: 13, BS: 27, ES: 30, PC: 56, PE: 12, EEC: 16, MC: 3, OE: 12 },
        2028: { HS: NaN, BS: NaN, ES: NaN, PC: NaN, PE: NaN, EEC: NaN, MC: NaN, OE: NaN },
    },
};

const normalizeCourses = (dbCourses = [], userAdded = []) => {
    const mappedDbCourses = dbCourses.map((entry) => {
        const c = entry.course;
        return {
            _id: entry._id,
            type: entry.type,
            name: c.name,
            credits: c.credits,
            grade: entry.grade,
            gradePoint: entry.gradePoint, // Map gradePoint
            sem: entry.sem,
            category: entry.category,
            code19: entry.code19 || c.code19,
            code24: entry.code24 || c.code24,
        };
    });

    const mappedUserAdded = userAdded.map((c) => ({
        _id: c._id,
        type: c.type,
        name: c.course_name,
        credits: c.credits,
        grade: c.grade,
        gradePoint: c.gradePoint, // Map gradePoint
        sem: `sem${c.sem}`,
        category: c.category,
        code19: c.code,
        code24: c.code,
    }));

    return [...mappedDbCourses, ...mappedUserAdded];
};

function SingleCategory({ isDark, setIsDark }) {
    const { category } = useParams();
    const { user, dashboardData, refreshUser, loading: authLoading, fetchUser } = useAuth();

    const isOldCode = user?.grad_year === "2027";
    const requiredCredits = creditRequirements?.[user?.dept]?.[user?.grad_year]?.[category] || 0;

    const allCourses = useMemo(() => {
        if (!dashboardData) return [];
        return normalizeCourses(dashboardData.courses, dashboardData.userAddedCourses);
    }, [dashboardData]);

    const courses = useMemo(() => {
        return allCourses.filter(c => c.category === category);
    }, [allCourses, category]);

    const totalCredits = useMemo(() => {
        return courses.reduce((sum, c) => sum + Number(c.credits), 0);
    }, [courses]);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [showUserAddedOnly, setShowUserAddedOnly] = useState(false);

    // Fetch data if missing (e.g. direct access)
    useEffect(() => {
        if (!dashboardData) {
            fetchUser();
        }
    }, [dashboardData, fetchUser]);

    const [sortConfig, setSortConfig] = useState(() => {
        try {
            const saved = localStorage.getItem("courseSortConfig");
            return saved ? JSON.parse(saved) : { key: null, direction: null };
        } catch {
            return { key: null, direction: null };
        }
    });

    const toRoman = (num) => {
        const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
        return roman[num - 1] || num;
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        const newConfig = { key, direction };
        setSortConfig(newConfig);
        localStorage.setItem("courseSortConfig", JSON.stringify(newConfig));
    };

    const getSortedCourses = () => {
        let filteredCourses = courses;
        if (showUserAddedOnly) {
            filteredCourses = courses.filter(c => c.type === 'manual');
        }

        if (!sortConfig.key) return filteredCourses;

        return [...filteredCourses].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'sem') {
                aValue = a.sem ? parseInt(a.sem.toString().replace('sem', ''), 10) : 0;
                bValue = b.sem ? parseInt(b.sem.toString().replace('sem', ''), 10) : 0;
            } else if (sortConfig.key === 'credits') {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            } else if (sortConfig.key === 'grade') {
                aValue = (aValue || '').toString().toLowerCase();
                bValue = (bValue || '').toString().toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const displayCourses = getSortedCourses();

    const handleDeleteClick = (course) => {
        setCourseToDelete(course);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCourseToDelete(null);
    };

    const confirmDelete = async () => {
        if (!courseToDelete) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/semester/deleteCourseById`, {
                data: { courseId: courseToDelete._id, type: courseToDelete.type },
                withCredentials: true
            });
            toast.success("Course deleted successfully");
            refreshUser(); // Sync context data
            closeDeleteModal();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to delete course");
        }
    };



    // Show skeleton if loading or missing data
    if (authLoading || !dashboardData) {
        return (
            <div className={`single-category-container ${isDark ? "dark" : ""}`}>
                <Navbar dark={isDark} setIsDark={setIsDark} name={user?.name || "User"} />
                <div className="single-category-main">
                    <Sidebar dark={isDark} />
                    <div className={`single-category-content ${isDark ? 'dark' : ''}`}>
                        {/* Skeleton for Header */}
                        <div className="category-header">
                            <div>
                                <Link style={{ visibility: 'hidden' }} to="/" className="back-link">
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </Link>
                            </div>
                            <div>
                                <h1 style={{ visibility: 'hidden' }} className="category-title">
                                    {categoryNames[category] || category}
                                </h1>
                            </div>
                        </div>

                        {/* Skeleton for Stats Cards */}
                        <div className={isDark ? 'skeleton-dark stats-container' : 'skeleton-light stats-container'}>
                            {[...Array(3)].map((_, index) => (
                                <div key={index} className="stat-card" style={{ visibility: 'hidden' }}>
                                    <div>
                                        <h3 style={{ visibility: 'hidden' }}>Total credits</h3>
                                        <div style={{ visibility: 'hidden' }} className="stat-number">0</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Skeleton for Courses Table */}
                        <div className="table-container">
                            <div className={isDark ? 'skeleton-dark' : 'skeleton-light'}>
                                <table className="courses-table" style={{ visibility: 'hidden' }}>
                                    <thead>
                                        <tr>
                                            <th>SUBJECT CODE</th>
                                            <th>SUBJECT NAME</th>
                                            <th>CREDITS</th>
                                            <th>GRADE</th>
                                            <th>SEMESTER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(3)].map((_, index) => (
                                            <tr key={index}>
                                                <td style={{ visibility: 'hidden' }}>CODE</td>
                                                <td style={{ visibility: 'hidden' }}>Name</td>
                                                <td style={{ visibility: 'hidden' }}>0</td>
                                                <td style={{ visibility: 'hidden' }}>A</td>
                                                <td style={{ visibility: 'hidden' }}>1</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`single-category-container ${isDark ? "dark" : ""}`}>
            <MobileNavbar dark={isDark} setIsDark={setIsDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} name={user.name} />

            <div className="single-category-main">
                <Sidebar dark={isDark} />

                <div
                    className={`single-category-content ${isDark ? "dark" : ""
                        }`}
                >
                    <div className="category-header">
                        <Link
                            to="/"
                            className={isDark ? "back-link" : "back-link-light"}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Link>
                        <h1 className="category-title">
                            {categoryNames[category] || category}
                        </h1>
                    </div>

                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Credits Completed</h3>
                                <div className="stat-number">{totalCredits}</div>
                            </div>
                            <img src="/cup.png" alt="Courses" className="stat-icon" />
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Credits Remaining</h3>
                                <div
                                    className="stat-number"
                                >
                                    {Math.max(0, requiredCredits - totalCredits)}
                                </div>
                            </div>
                            <img
                                src="/Courses.png"
                                alt="Remaining"
                                className="stat-icon"
                            />
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Total Credits Required</h3>
                                <div className="stat-number">{requiredCredits}</div>
                            </div>
                            <img
                                src="/graduation.png"
                                alt="Graduation"
                                className="stat-icon"
                            />
                        </div>
                    </div>

                    <div className="mobile-scroll-hint">
                        <FontAwesomeIcon icon={faArrowsLeftRight} fade />
                        <span>Swipe to view table</span>
                    </div>
                    <div className="table-container">
                        <table className="courses-table">
                            <thead>
                                <tr>
                                    <th style={{ minWidth: '140px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            SUBJECT CODE
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: showUserAddedOnly ? '#4880ff' : 'inherit',
                                                    opacity: showUserAddedOnly ? 1 : 0.3,
                                                    fontSize: '12px'
                                                }}
                                                onClick={() => setShowUserAddedOnly(prev => !prev)}
                                                title={showUserAddedOnly ? "Show All Courses" : "Show User Added Courses Only"}
                                            />
                                        </div>
                                    </th>
                                    <th>SUBJECT NAME</th>
                                    <th
                                        onClick={() => handleSort('credits')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                        title="Click to sort by credits"
                                    >
                                        CREDITS
                                        {sortConfig.key === 'credits' ? (
                                            sortConfig.direction === 'asc' ?
                                                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '8px' }} /> :
                                                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '8px' }} />
                                        ) : (
                                            <span style={{ marginLeft: '8px', opacity: 0.3 }}>⇅</span>
                                        )}
                                    </th>
                                    <th
                                        onClick={() => handleSort('grade')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                        title="Click to sort by grade"
                                    >
                                        GRADE
                                        {sortConfig.key === 'grade' ? (
                                            sortConfig.direction === 'asc' ?
                                                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '8px' }} /> :
                                                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '8px' }} />
                                        ) : (
                                            <span style={{ marginLeft: '8px', opacity: 0.3 }}>⇅</span>
                                        )}
                                    </th>
                                    <th
                                        onClick={() => handleSort('sem')}
                                        style={{ cursor: 'pointer', userSelect: 'none' }}
                                        title="Click to sort by semester"
                                    >
                                        SEMESTER
                                        {sortConfig.key === 'sem' ? (
                                            sortConfig.direction === 'asc' ?
                                                <FontAwesomeIcon icon={faArrowUp} style={{ marginLeft: '8px' }} /> :
                                                <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: '8px' }} />
                                        ) : (
                                            <span style={{ marginLeft: '8px', opacity: 0.3 }}>⇅</span>
                                        )}
                                    </th>
                                    <th style={{ textAlign: 'center' }}>EDIT</th>
                                    <th style={{ textAlign: 'center' }}>DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                            {showUserAddedOnly ? (
                                                <p style={{ color: '#6b7280', margin: 0 }}>No user-added courses in this category</p>
                                            ) : (
                                                <div className="no-courses">
                                                    <Lottie
                                                        animationData={emptyGhostAnimation}
                                                        loop
                                                        autoplay
                                                        style={{ width: '200px', height: '200px', marginLeft: 'auto', marginRight: 'auto' }}
                                                    />
                                                    <p>Upload semester result to view courses here</p>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    displayCourses.map((course, index) => (
                                        <tr key={index}>
                                            <td style={{ position: 'relative' }}>
                                                <div style={{ display: 'inline-block', position: 'relative' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        right: '100%',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        display: 'flex',
                                                        gap: '8px',
                                                        marginRight: '12px',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center'
                                                    }}>
                                                        {course.type === 'manual' && (
                                                            <div className="info-tooltip-container">
                                                                <FontAwesomeIcon icon={faUser} style={{ color: '#4880ff', fontSize: '14px' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isOldCode
                                                        ? course.code19
                                                        : course.code24}
                                                </div>
                                            </td>
                                            <td>{course.name}</td>
                                            <td>{course.credits}</td>
                                            <td>{course.grade}</td>
                                            <td className="sem-number">
                                                {toRoman(
                                                    parseInt(
                                                        course.sem.slice(3)
                                                    )
                                                )}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <FontAwesomeIcon
                                                    icon={faPencil}
                                                    className="pencil-icon"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setEditModalOpen(true);
                                                    }}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="trash-icon"
                                                    onClick={() => handleDeleteClick(course)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Modal
                        isOpen={editModalOpen}
                        onRequestClose={() => setEditModalOpen(false)}
                        className={`custom-modal ${isDark ? "dark" : ""}`}
                        overlayClassName="modal-overlay"
                    >
                        {selectedCourse && (
                            <EditCategoryCourseModal
                                dark={isDark}
                                courseData={selectedCourse}
                                onClose={() => setEditModalOpen(false)}
                                onSuccess={() => {
                                    setEditModalOpen(false);
                                    refreshUser(); // Sync context data
                                }}
                            />
                        )}
                    </Modal>

                    {showDeleteModal && (
                        <div className="modal-overlay" onClick={closeDeleteModal}>
                            <div
                                className={`modal-content ${isDark ? 'dark' : ''}`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header">
                                    <h3>Delete Course?</h3>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete <b>{courseToDelete?.name}</b>?</p>
                                    <p>This action cannot be undone.</p>
                                </div>
                                <div className="modal-actions">
                                    <button
                                        className="modal-btn modal-btn-delete"
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="modal-btn modal-btn-cancel"
                                        onClick={closeDeleteModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SingleCategory;
