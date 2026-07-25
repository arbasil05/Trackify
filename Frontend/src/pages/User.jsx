import { useState, useEffect } from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import MobileNavbar from "../components/mobile-navbar/MobileNavbar"
import UserDetails from "../components/userdetails/UserDetails";
import SemDetails from "../components/semDetails/SemDetails";
import Spinner from "../components/spinner/Spinner";
import { useNavigate } from "react-router-dom";
import UserAddedCourses from "../components/user_added_courses/UserAddedCourses";
import AddSingleCourseModal from "../components/navbar/AddSingleCourseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Badge from "../components/badge_display/Badge";
import "./User.css";

const User = () => {
    const { user, dashboardData, loading: authLoading, refreshUser, fetchUser } = useAuth();
    const { isDark } = useTheme();

    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch data if missing (e.g. direct access)
    useEffect(() => {
        if (!dashboardData) {
            fetchUser();
        }
    }, [dashboardData, fetchUser]);

    const handleRefresh = () => {
        refreshUser(); // Refresh context data
    };

    if (authLoading || !dashboardData) {
        return <Spinner message="Loading profile..." />;
    }

    return (
        <div>
            <MobileNavbar />
            <Sidebar />
            <Navbar 
                title="User Profile" 
                subtitle="Manage your academic details and customize your preferences."
            >
                <button className="dashboard-action-btn search-btn" onClick={() => navigate('/explore')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <span>Search & Add</span>
                </button>
                <button className="dashboard-action-btn add-btn" onClick={() => setAddCourseModalOpen(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add Course</span>
                </button>
            </Navbar>
            
            <div className="user-bento-grid">
                <UserDetails userDetails={user || {}} onDataRefresh={handleRefresh} />
                <Badge/>
                <SemDetails userSem={dashboardData.userSemCredits} onDataRefresh={handleRefresh} />
                <UserAddedCourses userAddedCourses={dashboardData.userAddedCourses} onRefresh={handleRefresh} />
            </div>

            {addCourseModalOpen && (
                <div className="modal-overlay">
                    <div className={`custom-modal narrow-modal ${isDark ? "dark" : ""}`}>
                        <AddSingleCourseModal
                            onClose={() => setAddCourseModalOpen(false)}
                            onSuccess={() => {
                                setAddCourseModalOpen(false);
                                handleRefresh();
                            }}
                        />
                    </div>
                </div>
            )}

        </div>
    )
}

export default User
