import Navbar from "../components/navbar/Navbar"
import Sidebar from "../components/sidebar/Sidebar"

const User = ({ isDark, setIsDark }) => {
    return (
        <div>
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} />
            <h1>
                Coming Soon
            </h1>
        </div>
    )
}

export default User
