import './Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faPowerOff, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ dark }) => {

    const location = useLocation();

    return (
        <div className={dark ? 'sidebar-container dark-mode' : 'sidebar-container'}>
            <div className="sidebar-menu-wrap">
                <div className="sidebar-title">
                    <Link to="/">
                        <h1><span className='siebar-title-span'>Trac</span>kify</h1>
                    </Link>
                </div>
                <div className="sidebar-menu">
                    <Link to="/">
                        <div className={`sidebarDash ${location.pathname === "/" ? "active" : ""}`}>
                            <FontAwesomeIcon icon={faChartPie} />
                            <p>Dashboard</p>
                        </div>
                    </Link>
                    <Link to="/user">
                        <div className={`sidebarprofile ${location.pathname === "/user" ? "active" : ""}`}>
                            <FontAwesomeIcon icon={faUserCircle} />
                            <p>User Profile</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div>
                <button className={dark?'logout-button-dark':'logout-button-light'}>
                    <FontAwesomeIcon icon={faPowerOff} />
                    <p>Logout</p>
                </button>
            </div>
        </div>
    )
}

export default Sidebar
