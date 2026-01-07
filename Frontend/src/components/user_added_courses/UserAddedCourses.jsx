import "./UserAddedCourses.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import EditCourseModal from "./EditCoursesModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

Modal.setAppElement("#root");

const UserAddedCourses = ({ isDark, refreshTrigger }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        fetchUserAddedCourses();
    }, [refreshTrigger]);

    // Handle keyboard events for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showDeleteModal) return;

            if (e.key === 'Enter') {
                confirmDelete();
            } else if (e.key === 'Escape') {
                closeDeleteModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showDeleteModal, courseToDelete]);

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
            await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/semester/deleteCourse`, {
                data: { code: courseToDelete.code },
                withCredentials: true
            });
            toast.success("Course deleted successfully");
            fetchUserAddedCourses();
            closeDeleteModal();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete course");
        }
    };

    const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

    return (
        <div className={`userdetails-container ${isDark ? "dark" : ""}`}>
            <div className="userdetails-header">
                <h2>Courses Added by You</h2>
            </div>

            {loading ? (
                <p className="empty-message">Loading courses...</p>
            ) : courses.length === 0 ? (
                <p className="no-course-message">No courses found.</p>
            ) : (
                <div className={`useradded-table-wrapper${isDark ? " dark" : ""}`}>
                    <table className={`useradded-table${isDark ? " dark" : ""}`}>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Course</th>
                                <th className="center">Category</th>
                                <th className="center">Credits</th>
                                <th className="center">Grade</th>
                                <th className="center">Semester</th>
                                <th className="center">Edit</th>
                                <th className="center">Delete</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map((course) => (
                                <tr key={course._id}>
                                    <td className="mono">{course.code}</td>
                                    <td>{course.course_name}</td>
                                    <td className="center">{course.category}</td>
                                    <td className="center">{course.credits}</td>
                                    <td className={`center grade ${course.grade}`}>
                                        {course.grade}
                                    </td>
                                    <td className="center">
                                        {roman[course.sem]}
                                    </td>
                                    <td className="center">
                                        <FontAwesomeIcon
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setEditModalOpen(true);
                                            }}
                                            className="pencil-icon"
                                            icon={faPencil}
                                            title="Edit Course"
                                        />
                                    </td>
                                    <td className="center">
                                        <FontAwesomeIcon
                                            onClick={() => handleDeleteClick(course)}
                                            className="trash-icon"
                                            icon={faTrash}
                                            title="Delete Course"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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

            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div
                        className={`modal-content ${isDark ? 'dark' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Delete {courseToDelete?.code}?</h3>
                        </div>
                        <div className="modal-body">
                            <p>This action cannot be undone. This course will be permanently removed.</p>
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
    );
};

export default UserAddedCourses;
