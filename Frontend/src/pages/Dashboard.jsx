import { useEffect, useState } from 'react';
import Barchart from '../components/barchart/BarChart';
import Cateogory from '../components/category/Cateogory';
import Information from '../components/information/Information';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import Spinner from '../components/spinner/Spinner';

const Dashboard = ({ isDark, setIsDark, onDataRefresh }) => {
  const nav = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [userDetails, setUserDetails] = useState({});
  const [userSemCredits, setUserSemCredits] = useState({});
  const [totalCredits, setTotalCredits] = useState(0);
  const [runningTotal, setRunningTotal] = useState({});
  const [cgpa, setCgpa] = useState("");


  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthLoading(true);
    axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/userDetails`, { withCredentials: true })
      .then(() => setAuthChecked(true))
      .catch(() => {
        toast.error("Please login or signup to continue");
        nav("/login");
      })
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (authChecked) {
      setLoading(true);
      axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`, { withCredentials: true })
        .then((res) => {
          const { user, user_sem_credits, totalCredits, runningTotal, CGPA } = res.data;
          setUserDetails(user);
          setUserSemCredits(user_sem_credits);
          setTotalCredits(Number(totalCredits));
          setRunningTotal(runningTotal);
          setCgpa(CGPA);
        })
        // .catch((err) => (err))
        .finally(() => {
          setLoading(false)
        });

      axios.get(`${import.meta.env.VITE_BACKEND_API}/api/user/userDetails`, { withCredentials: true })
        .then((res) => setUserDetails(prev => ({ ...prev, name: res.data.user.name })))
        .catch((err) => console.log(err));
    }
  }, [authChecked]);

  // Show fullscreen spinner while checking auth (cold start)
  if (authLoading) {
    return <Spinner isDark={isDark} message="Waking up server..." />;
  }

  if (!authChecked) return null;

  return (
    <div>
      <Sidebar dark={isDark} />
      <Navbar onDataRefresh={onDataRefresh} dark={isDark} setIsDark={setIsDark} name={userDetails.name || ''} />
      <Information dark={isDark} user={userDetails} cgpa={cgpa} totalCredits={totalCredits} userSemCredits={userSemCredits} Loading={Loading} />
      <div className="wrapper">
        <Barchart dark={isDark} userSemCredits={userSemCredits} Loading={Loading} />
        <Cateogory dark={isDark} runningTotal={runningTotal} Loading={Loading} />
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default Dashboard;
