import React from 'react'
import Navbar from '../components/navbar/Navbar'
import TotalCredits from '../components/totalCredits/TotalCredits'
import Category from '../components/category/Category'
import UploadButton from '../components/upload/UploadButton'
import BarChart from '../components/barchart/BarChart'
import Welcome from '../components/welcome/Welcome'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Home = () => {
  const nav = useNavigate();

  // useEffect(() => {
  //   const url = "http://localhost:5001/api/protected";
  //   axios.get(url, { withCredentials: true })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((error) => {
  //       toast.error("Please register or signup to view");
  //       nav("/login");
  //       console.log(`Error : ${error}`);

  //     })

  // }, [])

  return (
    <div>

      <Navbar />
      <Welcome />
      <UploadButton />
      <TotalCredits />
      <Category />
      <BarChart />
      
    </div>
  )
}

export default Home
