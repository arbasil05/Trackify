import { Link } from 'react-router-dom'
import './Navbar.css'


const Navbar = () => {
  return (
    <div className='navbar-container'>
      <h1 className='navbar-title'>Trackify</h1>
      <Link to="/signup">
        <button className='navbar-button'>Log out</button>
      </Link>

    </div>
  )
}

export default Navbar
