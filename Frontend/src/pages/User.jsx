import { useEffect, useState } from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import axios from "axios";
import UserHeader from "../components/userheader/UserHeader";
import UserDetails from "../components/userdetails/UserDetails";
import SemDetails from "../components/semDetails/SemDetails";
import Spinner from "../components/spinner/Spinner";

const User = ({ isDark, setIsDark, onDataRefresh }) => {

    const [userDetails, setUserDetails] = useState({});
    const [userSem, setUserSem] = useState({});
    const [loading, setLoading] = useState(true);

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

    }, [])

    if (loading) {
        return <Spinner isDark={isDark} message="Loading profile..." />;
    }

    return (
        <div>
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} name={userDetails.name} />
            <UserHeader isDark={isDark} />
            <UserDetails isDark={isDark} userDetails={userDetails} onDataRefresh={onDataRefresh} />
            <SemDetails isDark={isDark} userSem={userSem} onDataRefresh={onDataRefresh} />
        </div>
    )
}

export default User
