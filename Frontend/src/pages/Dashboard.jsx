import { useEffect, useState } from 'react';
import Barchart from '../components/barchart/Barchart';
import Cateogory from '../components/category/Cateogory';
import Information from '../components/information/Information';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ isDark, setIsDark }) => {
    const nav = useNavigate();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const url = "http://localhost:5001/api/protected";
        axios.get(url, { withCredentials: true })
            .then(() => {
                setAuthChecked(true); // auth passed, allow rendering
            })
            .catch((error) => {
                toast.error("Please login or signup to continue");
                nav("/login");
            });
    }, []);

    if (!authChecked) {
        return null; // nothing is rendered until auth is confirmed
        // Optional: return <div>Loading...</div>
    }

    return (
        <div>
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} />
            <Information dark={isDark} />
            <div className="wrapper">
                <Barchart dark={isDark} />
                <Cateogory dark={isDark} />
            </div>
        </div>
    );
};

export default Dashboard;
