import "./UserAddedCourses.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import EditCourseModal from "./EditCoursesModal";

Modal.setAppElement("#root");

const UserAddedCourses = ({ isDark }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchUserAddedCourses();
    }, []);

    const fetchUserAddedCourses = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/getCourses`,
                { withCredentials: true }
            );
            setCourses(res.data.user_added_courses || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

    return (
        <div className={`userdetails-container ${isDark ? "dark" : ""}`}>
            <div className="userdetails-header">
                <h2>Courses Added by You</h2>
            </div>

            <div className={`useradded-table-wrapper${isDark ? " dark" : ""}`}>
                {loading ? (
                    <p className="empty-message">Loading courses...</p>
                ) : courses.length === 0 ? (
                    <p className="empty-message">No courses found.</p>
                ) : (
                    <table className={`useradded-table${isDark ? " dark" : ""}`}>
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th className="center">Credits</th>
                                <th className="center">Grade</th>
                                <th className="center">Semester</th>
                                <th className="center">Edit</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map((course) => (
                                <tr key={course._id}>
                                    <td className="mono">{course.code}</td>
                                    <td>{course.course_name}</td>
                                    <td className="center">{course.credits}</td>
                                    <td className={`center grade ${course.grade}`}>
                                        {course.grade}
                                    </td>
                                    <td className="center">
                                        {roman[course.sem]}
                                    </td>
                                    <td className="center">
                                        <button
                                            className="edit-btn"
                                            title="Edit Course"
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setEditModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal
                isOpen={editModalOpen}
                onRequestClose={() => setEditModalOpen(false)}
                className={`custom-modal ${isDark ? "dark" : ""}`}
                overlayClassName="modal-overlay"
            >
                {selectedCourse && (
                    <EditCourseModal
                        dark={isDark}
                        courseData={selectedCourse}
                        onClose={() => setEditModalOpen(false)}
                        onSuccess={() => {
                            setEditModalOpen(false);
                            fetchUserAddedCourses();
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default UserAddedCourses;
