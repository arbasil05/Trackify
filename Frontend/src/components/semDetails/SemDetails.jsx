import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SemDetails.css'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const SemDetails = ({ isDark, userSem, onDataRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [semesterToDelete, setSemesterToDelete] = useState(null);

    // Handle keyboard events for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showModal) return;

            if (e.key === 'Enter') {
                confirmDelete();
            } else if (e.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showModal, semesterToDelete]);

    const deleteSem = (semester) => {
        const url = `${import.meta.env.VITE_BACKEND_API}/api/semester/${semester}`;
        axios.delete(url, { withCredentials: true })
            .then(() => {
                toast.success(`Data deleted successfully`);
                onDataRefresh();
            })
            .catch(() => {
                toast.error('Failed to delete semester');
            });
    };

    const handleDelete = (semester) => {
        setSemesterToDelete(semester);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (semesterToDelete) {
            deleteSem(semesterToDelete);
            closeModal();
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSemesterToDelete(null);
    };


    const sortedSemesters = Object.entries(userSem || {})
        .filter(([_, credit]) => credit > 0)
        .sort(([a], [b]) => {
            const numA = parseInt(a.replace('sem', ''), 10);
            const numB = parseInt(b.replace('sem', ''), 10);
            return numA - numB;
        });

    return (
        <>
            <div className={`userdetails-container ${isDark ? 'dark' : ''}`}>
                <div className="userdetails-header">
                    <h2>Uploaded Semester Details</h2>
                </div>

                {sortedSemesters.length === 0 ? (
                    <p className="no-sem-message">No Semester details found.</p>
                ) : (
                    sortedSemesters.map(([semester, credit]) => (
                        <div
                            key={semester}
                            className={`semdetails-list ${isDark ? 'dark' : ''}`}
                        >
                            <div className="semdetails-list-right">
                                <h3 className="semester-list-title">
                                    {semester.replace(/sem/, 'Semester ')}
                                </h3>
                                <p>Credits : {credit}</p>
                            </div>
                            <div className="semdetails-list-left">
                                <FontAwesomeIcon
                                    onClick={() => handleDelete(semester)}
                                    className="trash-icon"
                                    icon={faTrash}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className={`modal-content ${isDark ? 'dark' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3>Delete {semesterToDelete?.replace(/sem/, 'Semester ')}?</h3>
                        </div>
                        <div className="modal-body">
                            <p>This action cannot be undone. All data for this semester will be permanently removed.</p>
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
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SemDetails;
