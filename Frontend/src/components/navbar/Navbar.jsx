import { useState } from "react"
import {useNavigate} from "react-router-dom"
import {handlelogout} from "../../utils/logout"
import "./Navbar.css"


const Navbar = () => {
    const nav = useNavigate();
    return (

        <div className="navbar">
            <h1 className="title">
                Trackify
            </h1>
            <button onClick={()=>handlelogout(nav)} className="logout-button">
                Logout
            </button>
        </div>

    )
}

export default Navbar
