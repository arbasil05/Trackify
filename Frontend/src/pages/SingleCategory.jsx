import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import "./SingleCategory.css";

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

function SingleCategory({ isDark, setIsDark }) {
    const { category } = useParams();

    const [courses, setCourses] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [requiredCredits, setRequiredCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [isOldCode, setIsOldCode] = useState(true);

    const toRoman = (num) => {
        const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
        return roman[num - 1] || num;
    };

    const normalizeCourses = (dbCourses = [], userAdded = []) => {
        const mappedDbCourses = dbCourses.map((entry) => {
            const c = entry.course;
            return {
                name: c.name,
                credits: c.credits,
                grade: entry.grade,
                sem: entry.sem,
                category: entry.category,
                code19: entry.code19 || c.code19,
                code24: entry.code24 || c.code24,
            };
        });

        const mappedUserAdded = userAdded.map((c) => ({
            name: c.course_name,
            credits: c.credits,
            grade: c.grade,
            sem: `sem${c.sem}`,
            category: c.category,
            code19: c.code,
            code24: c.code,
        }));

        return [...mappedDbCourses, ...mappedUserAdded];
    };

    const fetchRequiredCredits = (dept, year) => {
        setRequiredCredits(
            creditRequirements?.[dept]?.[year]?.[category] || 0
        );
    };

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);

                // fetch all courses
                const courseRes = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API}/api/semester/getAllCourses`,
                    { withCredentials: true }
                );

                const { courses, user_added_courses } = courseRes.data;

                // fetch user
                const userRes = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API}/api/user/userDetails`,
                    { withCredentials: true }
                );

                const userData = userRes.data.user;
                setUser(userData);
                setIsOldCode(userData.grad_year === "2027");

                const allCourses = normalizeCourses(
                    courses,
                    user_added_courses
                );

                const filtered = allCourses.filter(
                    (c) => c.category === category
                );

                setCourses(filtered);

                setTotalCredits(
                    filtered.reduce(
                        (sum, c) => sum + Number(c.credits),
                        0
                    )
                );

                fetchRequiredCredits(userData.dept, userData.grad_year);
            } catch (err) {
                console.error("Error fetching category data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [category]);

    if (loading) {
        return (
            <div className={`single-category-container ${isDark ? "dark" : ""}`}>
                <Navbar dark={isDark} setIsDark={setIsDark} name={user.name || "User"} />
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
                                            <th>SUBJECT CREDITS</th>
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

                    <div className="table-container">
                        {courses.length === 0 ? (
                            <div className="no-courses">
                                <p>No courses found in this category.</p>
                            </div>
                        ) : (
                            <table className="courses-table">
                                <thead>
                                    <tr>
                                        <th>SUBJECT CODE</th>
                                        <th>SUBJECT NAME</th>
                                        <th>SUBJECT CREDITS</th>
                                        <th>GRADE</th>
                                        <th>SEMESTER</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr key={index}>
                                            <td>
                                                {isOldCode
                                                    ? course.code19
                                                    : course.code24}
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCategory;
