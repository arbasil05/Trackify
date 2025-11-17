import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'
import Exploretitle from '../components/explore-title/Exploretitle'
import AvailableCourses from '../components/courses_available/AvailableCourses'
import axios from 'axios'

const Explore = ({ isDark, setIsDark }) => {
  const [recCourses, setRecCourses] = useState({})
  const [username, setUsername] = useState("")
  const [gradYear, setGradYear] = useState("")
  const [loading, setLoading] = useState(true)   // ✅ NEW: loading state

  useEffect(() => {
    const url = `${import.meta.env.VITE_BACKEND_API}/api/user/recommendation`

    setLoading(true) // start loading when making request
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.recommendedCourses) {
          setRecCourses(res.data.recommendedCourses)
          setUsername(res.data.userName)
          setGradYear(res.data.grad_year)
        }
      })
      .catch((err) => {
        console.error("Error fetching recommended courses:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div>
      <Sidebar dark={isDark} />
      <Navbar dark={isDark} setIsDark={setIsDark} name={username} />
      <Exploretitle />
      <AvailableCourses
        dark={isDark}
        recommendedCourses={recCourses}
        username={username}
        grad_year={gradYear}
        Loading={loading} 
      />
    </div>
  )
}

export default Explore
