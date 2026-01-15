import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './UserHeader.css'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const UserHeader = ({ onAddCourse }) => {
  const { isDark } = useTheme()
  return (
    <div className='userheader-container'>
      <Link to="/" className={isDark?"back-link":"back-link-light"}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </Link>
      <h2>User Profile</h2>
      <button className={`userdetail-add-btn ${isDark ? 'dark' : ''}`} onClick={onAddCourse}>
          <FontAwesomeIcon icon={faPlus} />
          {/* <span className="btn-text">Add Course</span> */}
      </button>
    </div>
  )
}
export default UserHeader
