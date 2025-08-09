import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SemDetails.css'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"
import toast from 'react-hot-toast';

const SemDetails = ({ isDark, userSem, loading, onDataRefresh }) => {

    const deleteSem = (semester) => {

        const url = `http://localhost:5001/api/semester/${semester}`;
        axios.delete(url, { withCredentials: true })
            .then((res) => {
                toast.success(`Data deleted successfully`);
                console.log(res);
                onDataRefresh();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleDelete = (semester) => {
        const semesterName = semester.replace(/sem/, 'Semester ');

        toast((t) => (
            <div className={`confirm-toast ${isDark ? 'dark' : ''}`}>
                <div className="confirm-toast-header">
                    <h3 className="confirm-toast-title">Delete {semesterName}?</h3>
                    <p className="confirm-toast-message">
                        This action cannot be undone. All data for this semester will be permanently removed.
                    </p>
                </div>
                <div className="confirm-toast-actions">
                    <button
                        className="confirm-btn confirm-btn-delete"
                        onClick={() => {
                            toast.dismiss(t.id);
                            deleteSem(semester);
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className="confirm-btn confirm-btn-cancel"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: {
                background: 'transparent',
                boxShadow: 'none',
                padding: 0,
            }
        });
    };

    const sortedSemesters = Object.entries(userSem).sort(([a], [b]) => {
        const numA = parseInt(a.replace('sem', ''), 10);
        const numB = parseInt(b.replace('sem', ''), 10);
        return numA - numB;
    });

    return (
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
                            <FontAwesomeIcon onClick={() => handleDelete(semester)} className="trash-icon" icon={faTrash} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SemDetails;
