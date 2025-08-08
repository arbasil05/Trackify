import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
    'OE': 'Open Electives',
    'EEC': 'Employment Enhancement Courses',
    'MC': 'Mandatory Courses'
};

function SingleCategory({ isDark, setIsDark }) {
    const { category } = useParams();
    const [courses, setCourses] = useState([]);
    const [totalCredits, setTotalCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({})
    const [requiredCredits] = useState(10); // This should come from your requirements data
    const [isOldCode, setIsOldCode] = useState(true);


    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5001/api/courseByUser`, { withCredentials: true });
                console.log(response.data);
                setUser(response.data.user);
                const oldCode = response.data.user.reg_no.slice(4, 6);
                console.log(oldCode);
                setIsOldCode(oldCode === '21' || oldCode === '22' || oldCode === '23');
                const filteredCourses = response.data.courseDetails.filter(course => course.category === category);
                setCourses(filteredCourses);
                console.log(filteredCourses);


                // Calculate total credits for this category
                const credits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
                setTotalCredits(credits);
            } catch (error) {
                console.error('Error fetching category data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [category]);

    if (loading) {
        return (
            <div className={`single-category-container ${isDark ? 'dark' : ''}`}>
                <Navbar dark={isDark} setIsDark={setIsDark} name={user.name || "User"} />
                <div className="single-category-main">
                    <Sidebar dark={isDark} />
                    <div className={`single-category-content ${isDark ? 'dark' : ''}`}>
                        <div className="loading-spinner">Loading...</div>
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
                        <Link to="/" className="back-link">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <h1 className="category-title">{categoryNames[category] || category}</h1>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Total credits</h3>
                            <div className="stat-number">{totalCredits}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Total credits required</h3>
                            <div className="stat-number">{requiredCredits}</div>
                        </div>
                        <div className="stat-card">
                            <h3>Courses completed</h3>
                            <div className="stat-number">{courses.length}</div>
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
                                            <td>{course.sem}</td>
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