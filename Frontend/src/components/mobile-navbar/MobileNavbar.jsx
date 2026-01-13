import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faCompass, faUserCircle, faPowerOff, faBars, faTimes, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './MobileNavbar.css';

const MobileNavbar = ({ dark, setIsDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const nav = useNavigate();
    const location = useLocation();

    const handlelogout = () => {
        const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/logout`;
        axios.post(url, {}, { withCredentials: true })
            .then(() => {
                toast.success("Logged out successfully");
                nav("/login");
            })
            .catch((error) => {
                toast.error("Error while logging out");
            })
    }

    const handleDarkModeToggle = () => {
        setIsDark(!dark);
        localStorage.setItem("isDark", !dark);
    };

    return (
        <div className={`mobile-navbar ${dark ? 'dark' : ''}`}>
             <div className="mobile-nav-header">
                  <div className="mobile-logo">
                        <Link to="/" onClick={() => setIsOpen(false)}>
                            <h1><span className='mobile-logo-span'>Trac</span>kify</h1>
                        </Link>
                  </div>
                  <div className="mobile-nav-right">
                        <div className="mobile-theme-toggle" onClick={handleDarkModeToggle}>
                            {dark ? (
                                <FontAwesomeIcon icon={faMoon} className="mobile-toggle-icon" />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mobile-toggle-icon"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M 12 0 C 11.4 0 11 0.4 11 1 L 11 2 C 11 2.6 11.4 3 12 3 C 12.6 3 13 2.6 13 2 L 13 1 C 13 0.4 12.6 0 12 0 z M 4.1992188 3.1992188 C 3.9492188 3.1992187 3.7 3.3 3.5 3.5 C 3.1 3.9 3.1 4.5003906 3.5 4.9003906 L 4.1992188 5.5996094 C 4.5992187 5.9996094 5.1996094 5.9996094 5.5996094 5.5996094 C 5.9996094 5.1996094 5.9996094 4.5992188 5.5996094 4.1992188 L 4.9003906 3.5 C 4.7003906 3.3 4.4492188 3.1992188 4.1992188 3.1992188 z M 19.800781 3.1992188 C 19.550781 3.1992188 19.299609 3.3 19.099609 3.5 L 18.400391 4.1992188 C 18.000391 4.5992187 18.000391 5.1996094 18.400391 5.5996094 C 18.800391 5.9996094 19.400781 5.9996094 19.800781 5.5996094 L 20.5 4.9003906 C 20.9 4.5003906 20.9 3.9 20.5 3.5 C 20.3 3.3 20.050781 3.1992188 19.800781 3.1992188 z M 12 5 A 7 7 0 0 0 5 12 A 7 7 0 0 0 12 19 A 7 7 0 0 0 19 12 A 7 7 0 0 0 12 5 z M 1 11 C 0.4 11 0 11.4 0 12 C 0 12.6 0.4 13 1 13 L 2 13 C 2.6 13 3 12.6 3 12 C 3 11.4 2.6 11 2 11 L 1 11 z M 22 11 C 21.4 11 21 11.4 21 12 C 21 12.6 21.4 13 22 13 L 23 13 C 23.6 13 24 12.6 24 12 C 24 11.4 23.6 11 23 11 L 22 11 z M 4.9003906 18.099609 C 4.6503906 18.099609 4.3992188 18.200391 4.1992188 18.400391 L 3.5 19.099609 C 3.1 19.499609 3.1 20.1 3.5 20.5 C 3.9 20.9 4.5003906 20.9 4.9003906 20.5 L 5.5996094 19.800781 C 5.9996094 19.400781 5.9996094 18.800391 5.5996094 18.400391 C 5.3996094 18.200391 5.1503906 18.099609 4.9003906 18.099609 z M 19.099609 18.099609 C 18.849609 18.099609 18.600391 18.200391 18.400391 18.400391 C 18.000391 18.800391 18.000391 19.400781 18.400391 19.800781 L 19.099609 20.5 C 19.499609 20.9 20.1 20.9 20.5 20.5 C 20.9 20.1 20.9 19.499609 20.5 19.099609 L 19.800781 18.400391 C 19.600781 18.200391 19.349609 18.099609 19.099609 18.099609 z M 12 21 C 11.4 21 11 21.4 11 22 L 11 23 C 11 23.6 11.4 24 12 24 C 12.6 24 13 23.6 13 23 L 13 22 C 13 21.4 12.6 21 12 21 z"
                                    />
                                </svg>
                            )}
                        </div>
                        <div className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
                            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                        </div>
                  </div>
             </div>
             
             {/* Dropdown Menu */}
             <div className={`mobile-nav-menu ${isOpen ? 'open' : ''}`}>
                  <Link to="/" onClick={() => setIsOpen(false)}>
                        <div className={`mobile-nav-item ${location.pathname === "/" ? "active" : ""}`}>
                            <FontAwesomeIcon icon={faChartPie} />
                            <p>Dashboard</p>
                        </div>
                  </Link>
                  
                  <Link to="/explore" onClick={() => setIsOpen(false)}>
                         <div className={`mobile-nav-item ${location.pathname === "/explore" ? "active" : ""}`}>
                            <FontAwesomeIcon icon={faCompass} />
                            <p>Explore</p>
                        </div>
                  </Link>

                  <Link to="/user" onClick={() => setIsOpen(false)}>
                        <div className={`mobile-nav-item ${location.pathname === "/user" ? "active" : ""}`}>
                            <FontAwesomeIcon icon={faUserCircle} />
                            <p>User Profile</p>
                        </div>
                  </Link>

                    <div className="mobile-nav-item logout" onClick={handlelogout}>
                        <FontAwesomeIcon icon={faPowerOff} />
                        <p>Logout</p>
                    </div>
             </div>
        </div>
    )
}
export default MobileNavbar;
