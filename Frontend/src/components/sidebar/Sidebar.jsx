import './Sidebar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faCompass, faPowerOff, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
const Sidebar = () => {
    const { clearAuth } = useAuth();
    const { isDark: dark } = useTheme();

    const nav = useNavigate();
    const location = useLocation();

    const handlelogout = () => {
        const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/logout`;
        axios.post(url, {}, { withCredentials: true })
            .then(() => {
                clearAuth(); // Clear context state
                toast.success("Logged out successfully");
                nav("/login");
            })
            .catch((error) => {
                toast.error("Error while logging out");
            })
    }

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
                    <Link to="/explore">
                        <div className={`sidebarDash ${location.pathname === "/explore" ? "active" : ""}`}>
                            <FontAwesomeIcon icon={faCompass} />
                            <p>Explore</p>
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
                <button onClick={handlelogout} className={dark ? 'logout-button-dark' : 'logout-button-light'}>
                    <FontAwesomeIcon icon={faPowerOff} />
                    <p>Logout</p>
                </button>
            </div>
        </div>
    )
}

export default memo (Sidebar)
