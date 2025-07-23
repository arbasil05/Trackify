import Navbar from '../components/navbar/Navbar'
import MainCard from '../components/maincard/MainCard'
import Category from '../components/category/Category'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useState } from 'react'

const Home = () => {
    const nav = useNavigate();
    const totalCredits = useState({})

    useEffect(()=>{
        const url = "http://localhost:5001/api/protected";
        axios.get(url,{withCredentials:true})
             .then((res)=>{
                console.log(res);
             })
             .catch((error)=>{
                toast.error("Please register or signup to view");
                nav("/login");
                console.log(`Error : ${error}`);
                
             })

    },[])
    return (
        <div>
           <Navbar/>
           <MainCard/>
           <Category/>
        </div>
    )
}

export default Home
