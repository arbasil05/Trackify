import { useEffect, useState } from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import axios from "axios";
import UserHeader from "../components/userheader/UserHeader";
import UserDetails from "../components/userdetails/UserDetails";
import SemDetails from "../components/semDetails/SemDetails";

const User = ({ isDark, setIsDark, onDataRefresh }) => {

    const [userDetails, setUserDetails] = useState({});
    const [userSem,setUserSem] = useState({});
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`, { withCredentials: true })
            .then((res) => {
                const { user,user_sem_credits } = res.data;
                setUserDetails(user);
                setUserSem(user_sem_credits);
            })
            .catch((error) => {
                // console.log(error);
            })
            .finally(()=>{
                setLoading(false)
            })

    }, [])
    return (
        <div>
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} name={userDetails.name} />
            <UserHeader isDark={isDark}/>
            <UserDetails isDark={isDark} userDetails={userDetails} loading={loading} onDataRefresh={onDataRefresh} />
            <SemDetails isDark={isDark} userSem={userSem} loading={loading} onDataRefresh={onDataRefresh} />
        </div>
    )
}

export default User
