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

const User = ({ isDark, setIsDark, onDataRefresh }) => {
    const { user, dashboardData, loading: authLoading, refreshUser, fetchUser } = useAuth();

    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);

    // Fetch data if missing (e.g. direct access)
    useEffect(() => {
        if (!dashboardData) {
            fetchUser();
        }
    }, [dashboardData, fetchUser]);

    const handleRefresh = () => {
        refreshUser(); // Refresh context data
        if (onDataRefresh) onDataRefresh();
    };

    if (authLoading || !dashboardData) {
        return <Spinner isDark={isDark} message="Loading profile..." />;
    }

    return (
        <div>
            <MobileNavbar dark={isDark} setIsDark={setIsDark} />
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} name={user?.name} onDataRefresh={handleRefresh} onAddCourse={() => setAddCourseModalOpen(true)} />
            <UserHeader isDark={isDark} onAddCourse={() => setAddCourseModalOpen(true)} />
            <UserDetails isDark={isDark} userDetails={user || {}} onDataRefresh={handleRefresh} />
            <SemDetails isDark={isDark} userSem={dashboardData.userSemCredits} onDataRefresh={handleRefresh} />
            <UserAddedCourses isDark={isDark} userAddedCourses={dashboardData.userAddedCourses} onRefresh={handleRefresh} />

            {addCourseModalOpen && (
                <div className="modal-overlay">
                    <div className={`custom-modal narrow-modal ${isDark ? "dark" : ""}`}>
                        <AddSingleCourseModal
                            dark={isDark}
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
