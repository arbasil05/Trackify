import { useEffect, useState } from "react"
import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"
import axios from "axios";

const User = ({ isDark, setIsDark }) => {

    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        axios.get("http://localhost:5001/api/courseByUser", { withCredentials: true })
            .then((res) => {
                const { user } = res.data;
                setUserDetails(user);
            })
            .catch((error) => {
                console.log(error);
            })

    }, [])
    return (
        <div>
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} name={userDetails.name} />
            <h1>
                Coming Soon
            </h1>
        </div>
    )
}

export default User
