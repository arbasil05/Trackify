import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './UserHeader.css'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
const UserHeader = ({isDark}) => {
  return (
    <div className='userheader-container'>
      <Link to="/">
        <FontAwesomeIcon style={isDark? {color:"white"} : {color:"black"}} className='back-icon' icon={faChevronLeft} />
      </Link>
      <h2>User Profile</h2>
    </div>
  )
}

export default UserHeader
