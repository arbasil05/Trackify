import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './SemDetails.css'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const SemDetails = ({ isDark }) => {
    return (
        <div className={`userdetails-container ${isDark ? 'dark' : ''}`}>
            <div className="userdetails-header">
                <h2>Uploaded Semester Details</h2>
            </div>
            <div className={`semdetails-list ${isDark ? 'dark' : ''}`}>
                <div className="semdetails-list-right">
                    <h3 className='semester-list-title'>Semester 1</h3>
                    <p>Credits : 25</p>
                </div>
                <div className="semdetails-list-left">
                    <FontAwesomeIcon className='trash-icon' icon={faTrash} />
                </div>
            </div>
        </div>
    )
}

export default SemDetails
