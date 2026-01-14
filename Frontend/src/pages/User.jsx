import { useEffect, useState } from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import MobileNavbar from "../components/mobile-navbar/MobileNavbar"
import axios from "axios";
import UserHeader from "../components/userheader/UserHeader";
import UserDetails from "../components/userdetails/UserDetails";
import SemDetails from "../components/semDetails/SemDetails";
import Spinner from "../components/spinner/Spinner";
import UserAddedCourses from "../components/user_added_courses/UserAddedCourses";
import AddSingleCourseModal from "../components/navbar/AddSingleCourseModal";

const User = ({ isDark, setIsDark, onDataRefresh }) => {

    const [userDetails, setUserDetails] = useState({});
    const [userSem, setUserSem] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
        if (onDataRefresh) onDataRefresh();
    };

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`, { withCredentials: true })
            .then((res) => {
                const { user, user_sem_credits } = res.data;
                setUserDetails(user);
                setUserSem(user_sem_credits);
            })
            .catch(() => { })
            .finally(() => {
                setLoading(false)
            })

    }, [refreshTrigger])

    if (loading) {
        return <Spinner isDark={isDark} message="Loading profile..." />;
    }

    return (
        <div>
            <MobileNavbar dark={isDark} setIsDark={setIsDark} />
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} name={userDetails.name} onDataRefresh={handleRefresh} onAddCourse={() => setAddCourseModalOpen(true)} />
            <UserHeader isDark={isDark} onAddCourse={() => setAddCourseModalOpen(true)} />
            <UserDetails isDark={isDark} userDetails={userDetails} onDataRefresh={handleRefresh} />
            <SemDetails isDark={isDark} userSem={userSem} onDataRefresh={handleRefresh} />
            <UserAddedCourses isDark={isDark} refreshTrigger={refreshTrigger} />

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
