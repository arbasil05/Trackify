import { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import MobileNavbar from '../components/mobile-navbar/MobileNavbar'
import Navbar from '../components/navbar/Navbar'
import Exploretitle from '../components/explore-title/Exploretitle'
import AvailableCourses from '../components/courses_available/AvailableCourses'
import axios from 'axios'
import Spinner from '../components/spinner/Spinner'
import { useAuth } from '../context/AuthContext'

const Explore = ({ isDark, setIsDark }) => {
  const { user, loading: authLoading, fetchUser } = useAuth();
  const [recCourses, setRecCourses] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch user if missing
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user, fetchUser]);

  useEffect(() => {
    if (!user) return; // Wait for user data
    
    const url = `${import.meta.env.VITE_BACKEND_API}/api/user/recommendation`

    setLoading(true)
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.recommendedCourses) {
          setRecCourses(res.data.recommendedCourses)
        }
      })
      .catch((err) => {
        console.error("Error fetching recommended courses:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user])

  if (loading || authLoading || !user) {
    return <Spinner isDark={isDark} message="Loading recommendations..." />;
  }

  return (
    <div>
      <MobileNavbar dark={isDark} setIsDark={setIsDark} />
      <Sidebar dark={isDark} />
      <Navbar dark={isDark} setIsDark={setIsDark} name={user?.name || ''} />
      <Exploretitle />
      <AvailableCourses
        dark={isDark}
        recommendedCourses={recCourses}
        username={user?.name || ''}
        grad_year={user?.grad_year || ''}
        Loading={loading}
      />
    </div>
  )
}

export default Explore

