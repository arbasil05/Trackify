import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './UserHeader.css'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
const UserHeader = ({ isDark }) => {
  return (
    <div className='userheader-container'>
      <Link to="/" className={isDark?"back-link":"back-link-light"}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </Link>
      <h2>User Profile</h2>
    </div>
  )
}

export default UserHeader
