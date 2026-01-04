import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import './SingleCategory.css';

const categoryNames = {
    'HS': 'Humanities and science',
    'BS': 'Basic Sciences',
    'ES': 'Engineering Sciences',
    'PC': 'Professional Core',
    'PE': 'Professional Electives',
    'EEC': 'Employment Enhancement Courses',
    'MC': 'Mandatory Courses'
};

const creditRequirements = {
    // done
    CSE: {
        2027: { HS: 11, BS: 23, ES: 25, PC: 58, PE: 16, EEC: 16, MC: 3 },
        2028: { HS: 13, BS: 25, ES: 25, PC: 56, PE: 16, EEC: 16, MC: 4 }
    },
    // done
    IT: {
        2027: { HS: 11, BS: 23, ES: 25, PC: 58, PE: 16, EEC: 16, MC: 3 },
        2028: { HS: 13, BS: 25, ES: 25, PC: 56, PE: 16, EEC: 16, MC: 4 }
    },
    // done
    AIDS: {
        2027: { HS: 14, BS: 21, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3 },
        2028: { HS: 14, BS: 23, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4 }
    },
    // done
    AIML: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3 },
        2028: { HS: 14, BS: 27, ES: 28, PC: 51, PE: 16, EEC: 16, MC: 4 }
    },
    // done
    CYBER: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 54, PE: 17, EEC: 16, MC: 3 },
        2028: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4 }
    },
    IOT: {
        2027: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 3 },
        2028: { HS: 14, BS: 25, ES: 28, PC: 56, PE: 16, EEC: 16, MC: 4 }
    },
    ECE: {
        2027: { HS: 13, BS: 24, ES: 28, PC: 58, PE: 15, EEC: 16, MC: 3 },
        2028: { HS: 13, BS: 21, ES: 23, PC: 61, PE: 15, EEC: 16, MC: 3 }
    },
    MECH: {
        2027: { HS: 13, BS: 24, ES: 26, PC: 54, PE: 21, EEC: 16, MC: 3 },
        2028: { HS: 10, BS: 25, ES: 29, PC: 55, PE: 18, EEC: 16, MC: 3 }
    },
    CIVIL: {
        2027: { HS: 13, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3 },
        2028: { HS: 10, BS: 22, ES: 25, PC: 62, PE: 15, EEC: 16, MC: 3 }
    },
    EEE: {
        2027: { HS: 13, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3 },
        2028: { HS: 11, BS: 25, ES: 26, PC: 57, PE: 15, EEC: 16, MC: 3 }
    },
    CHEM: {
        2027: { HS: 13, BS: 28, ES: 24, PC: 55, PE: 15, EEC: 16, MC: 3 },
        2028: { HS: 13, BS: 26, ES: 17, PC: 58, PE: 18, EEC: 16, MC: 3 }
    },
    MED: {
        2027: { HS: 13, BS: 27, ES: 30, PC: 56, PE: 12, EEC: 16, MC: 3 },
        2028: { HS: 13, BS: 27, ES: 30, PC: 56, PE: 12, EEC: 16, MC: 3 },
    },
    BME: {
        2027: { HS: 13, BS: 27, ES: 29, PC: 57, PE: 12, EEC: 16, MC: 3 },
        2028: { HS: 10, BS: 23, ES: 30, PC: 60, PE: 18, EEC: 18, MC: 2 }
    },
    EIE: {
        2027: { HS: 11, BS: 25, ES: 25, PC: 58, PE: 15, EEC: 16, MC: 3 },
        2028: { HS: 11, BS: 25, ES: 25, PC: 58, PE: 15, EEC: 16, MC: 3 }
    }
};



function SingleCategory({ isDark, setIsDark }) {
    const { category } = useParams();
    const [courses, setCourses] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [requiredCredits, setRequiredCredits] = useState(0);
    const [isOldCode, setIsOldCode] = useState(true);

    // Function to convert number to Roman numerals
    const toRoman = (num) => {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
        return romanNumerals[num - 1] || num;
    };

    const fetchRequirdCredits = (category, dept, year) => {
        setRequiredCredits(creditRequirements[dept][year][category]);
    }

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`, { withCredentials: true });
                // console.log(response.data);
                setUser(response.data.user);
                const oldCode = response.data.user.grad_year;
                // console.log(oldCode);
                setIsOldCode(oldCode === '2027');
                const filteredCourses = response.data.courseDetails.filter(course => course.category === category);
                setCourses(filteredCourses);
                // console.log(filteredCourses);

                // Calculate total credits for this category
                const credits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
                setTotalCredits(credits);

                // calculate required credits based on user department and graduation year;
                const dept = response.data.user.dept;
                const grad_year = response.data.user.grad_year;
                fetchRequirdCredits(category, dept, grad_year);


            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };





        fetchCategoryData();
        // fetchRequirdCredits();
    }, [category]);

    if (loading) {
        return (
            <div className={`single-category-container ${isDark ? 'dark' : ''}`}>
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
        <div className={`single-category-container ${isDark ? 'dark' : ''}`}>
            <Navbar dark={isDark} setIsDark={setIsDark} name={user.name} />
            <div className="single-category-main">
                <Sidebar dark={isDark} />
                <div className={`single-category-content ${isDark ? 'dark' : ''}`}>
                    {/* Header with back button and title */}
                    <div className="category-header">
                        <Link to="/" className={isDark ? "back-link" : "back-link-light"}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </Link>
                        <h1 className="category-title">{categoryNames[category] || category}</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-container">
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Credits Completed</h3>
                                <div className="stat-number">{totalCredits}</div>
                            </div>
                            <img src="/Courses.png" alt="Courses" className="stat-icon" />
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Total credits required</h3>
                                <div className="stat-number">{requiredCredits}</div>
                            </div>
                            <img src="/graduation.png" alt="Graduation" className="stat-icon" />
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Courses completed</h3>
                                <div className="stat-number">{courses.length}</div>
                            </div>
                            <img src="/cup.png" alt="Achievement" className="stat-icon" />
                        </div>
                    </div>

                    {/* Courses Table */}
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
                                            <td>{`${isOldCode ? course.code19 : course.code24}`}</td>
                                            <td>{course.name}</td>
                                            <td>{course.credits}</td>
                                            <td>{course.grade}</td>
                                            <td className='sem-number'>{toRoman(parseInt(course.sem.slice(3, 5)))}</td>
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