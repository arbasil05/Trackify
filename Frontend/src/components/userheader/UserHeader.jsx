import { faChevronLeft, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './UserHeader.css'
import { Link } from 'react-router-dom'

const UserHeader = ({ onAddCourse, onSearchAdd }) => {
  return (
    <div className='userheader-container'>
      <div className='userheader-content'>
        <div className="userheader-title-row">
            <Link to="/" className="back-link">
              <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
            <h1>User Profile</h1>
        </div>
        <p>Manage your personal details, achievements, and course records.</p>
      </div>

      <div className="userheader-actions">
        <button className="user-action-btn search-btn" onClick={onSearchAdd} title="Search & Add Course">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <span>Search Course</span>
        </button>
        <button className="user-action-btn add-btn" onClick={onAddCourse} title="Add Course Manually">
            <FontAwesomeIcon icon={faPlus} />
            <span>Manual Add</span>
        </button>
      </div>
    </div>
  )
}
export default UserHeader
