import { useState, useEffect } from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import MobileNavbar from "../components/mobile-navbar/MobileNavbar"
import UserHeader from "../components/userheader/UserHeader";
import UserDetails from "../components/userdetails/UserDetails";
import SemDetails from "../components/semDetails/SemDetails";
import Spinner from "../components/spinner/Spinner";
import UserAddedCourses from "../components/user_added_courses/UserAddedCourses";
import AddSingleCourseModal from "../components/navbar/AddSingleCourseModal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const User = () => {
    const { user, dashboardData, loading: authLoading, refreshUser, fetchUser } = useAuth();
    const { isDark } = useTheme();

    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);

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
            <Navbar name={user?.name} onDataRefresh={handleRefresh} onAddCourse={() => setAddCourseModalOpen(true)} />
            <UserHeader onAddCourse={() => setAddCourseModalOpen(true)} />
            <UserDetails userDetails={user || {}} onDataRefresh={handleRefresh} />
            <SemDetails userSem={dashboardData.userSemCredits} onDataRefresh={handleRefresh} />
            <UserAddedCourses userAddedCourses={dashboardData.userAddedCourses} onRefresh={handleRefresh} />

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
