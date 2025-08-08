import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SemDetails.css'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SemDetails = ({ isDark, userSem }) => {
    const nav = useNavigate();

    const deleteSem = (semester) => {
        const url = `http://localhost:5001/api/semester/${semester}`;
        axios.delete(url, { withCredentials: true })
            .then((res) => {
                toast.success(`Data deleted successfully`);
                console.log(res);
                nav('/')
                setTimeout(() => nav('/user'), 1)
            })
            .catch((error) => {
                console.log(error);
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
                            <FontAwesomeIcon onClick={() => deleteSem(semester)} className="trash-icon" icon={faTrash} />
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SemDetails;
