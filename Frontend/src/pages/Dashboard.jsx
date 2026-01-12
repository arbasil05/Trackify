import { useEffect, useState } from 'react';
import Barchart from '../components/barchart/BarChart';
import Category from '../components/category/Category';
import Information from '../components/information/Information';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import Spinner from '../components/spinner/Spinner';
import Modal from "react-modal";
import { faKey, faLandmark, faPen, faPencil, faPlus, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




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

  const [modalIsOpen, setModalIsOpen] = useState(() => {
    return !localStorage.getItem('hasSeenNewFeatures');
  });

  const handleCloseModal = () => {
    setModalIsOpen(false);
    localStorage.setItem('hasSeenNewFeatures', 'true');
  };

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    setAuthLoading(true);

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_API}/api/user/userDetails`,
        { withCredentials: true }
      )
      .then(() => setAuthChecked(true))
      .catch(() => {
        toast.error("Please login or signup to continue");
        nav("/login");
      })
      .finally(() => setAuthLoading(false));
  }, []);

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    if (!authChecked) return;

    setLoading(true);

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_API}/api/user/courseByUser`,
        { withCredentials: true }
      )
      .then((res) => {
        const {
          user,
          user_sem_credits,
          totalCredits,
          runningTotal,
          CGPA,
        } = res.data;

        setUserDetails(user);
        setUserSemCredits(user_sem_credits || {});
        setTotalCredits(Number(totalCredits) || 0);
        setRunningTotal(runningTotal || {});
        setCgpa(CGPA || "");
      })
      .finally(() => setLoading(false));
  }, [authChecked]);

  /* ================= LOADING STATES ================= */
  if (authLoading) {
    return <Spinner isDark={isDark} message="Waking up server..." />;
  }

  if (!authChecked) return null;

  /* ================= RENDER ================= */

  const features = [
    {
      id: 1,
      emoji: faLandmark,
      color: "#3b82f6",
      bgColor: "#dbeafe",
      title: "All Departments Supported",
      desc: "Trackify now works for both SCOFT and NON-SCOFT departments."
    },
    {
      id: 2,
      emoji: faWarning,
      color: "#f59e0b",
      bgColor: "#fef3c7",
      title: "Missing Course Alerts",
      desc: "You’ll be notified if any course is not found after PDF parsing."
    },
    {
      id: 3,
      emoji: faPlus,
      color: "#10b981",
      bgColor: "#d1fae5",
      title: "Add Courses Manually",
      desc: "Missing courses can now be added from your User Profile."
    },
    {
      id: 4,
      emoji: faPen,
      color: "#8b5cf6",
      bgColor: "#ede9fe",
      title: "Edit Course Info",
      desc: "Course names and credits can be edited from the Categories page."
    },
    {
      id: 5,
      emoji: faKey,
      color: "#ec4899",
      bgColor: "#fce7f3",
      title: "Forgot Password",
      desc: "Recover your account easily using the new password reset option."
    }
  ];

  return (
    <div>

      <Modal
        isOpen={modalIsOpen}
        className={`custom-modal ${isDark ? "dark" : ""} medium-modal dashboard-news-modal`}>
        <div className="important-info-dash">
          <div className='modal-contents'>
            <h2 className="important-header">
              What's new ✨
            </h2>
            <div className="important-caption">
              Here's what we have improved to make Trackify even better!
            </div>
          </div>
          <div>
            {
              features.map((c) => {
                return (
                  <div id={c.id} key={c.id} className={`features-parent ${isDark ? 'dark' : ''}`}>
                    <div className='features-emoji' style={{ color: c.color, backgroundColor: c.bgColor }}>
                      <FontAwesomeIcon icon={c.emoji} />
                    </div>
                    <div className='features-content'>
                      <div className='features-title'>
                        {c.title}
                      </div>
                      <div className='features-desc'>
                        {c.desc}
                      </div>
                    </div>

                  </div>
                )
              })
            }
          </div>
          <div className='feature-button'>
            <button className='btn proceed' onClick={handleCloseModal}>
              Got it
            </button>
          </div>
        </div>

      </Modal>

      <Sidebar dark={isDark} />

      <Navbar
        onDataRefresh={onDataRefresh}
        dark={isDark}
        setIsDark={setIsDark}
        name={userDetails.name || ''}
      />

      <Information
        dark={isDark}
        user={userDetails}
        cgpa={cgpa}
        totalCredits={totalCredits}
        userSemCredits={userSemCredits}
        Loading={Loading}
      />

      <div className="wrapper">
        <Barchart
          dark={isDark}
          userSemCredits={userSemCredits}
          Loading={Loading}
        />
        <Category
          dark={isDark}
          runningTotal={runningTotal}
          Loading={Loading}
        />
      </div>

      <hr />
      <Footer />
    </div>
  );
};

export default Dashboard;
