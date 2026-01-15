import { useEffect, useState } from 'react';
import Barchart from '../components/barchart/BarChart';
import Category from '../components/category/Category';
import Information from '../components/information/Information';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import MobileNavbar from '../components/mobile-navbar/MobileNavbar';
import DashboardHeader from '../components/dashboardheader/DashboardHeader';
import Footer from '../components/footer/Footer';
import Spinner from '../components/spinner/Spinner';
import Modal from "react-modal";
import { faKey, faLandmark, faMobileScreen, faPlus, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    id: 1,
    emoji: faMobileScreen,
    color: "#06b6d4",
    bgColor: "#cffafe",
    title: "Mobile Friendly",
    desc: "Trackify is now fully responsive and optimized for mobile screens."
  },
  {
    id: 2,
    emoji: faLandmark,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    title: "All Departments Supported",
    desc: "Trackify now works for both SCOFT and NON-SCOFT departments."
  },
  {
    id: 3,
    emoji: faWarning,
    color: "#f59e0b",
    bgColor: "#fef3c7",
    title: "Missing Course Alerts",
    desc: "You'll be notified if any course is not found after PDF parsing."
  },
  {
    id: 4,
    emoji: faPlus,
    color: "#10b981",
    bgColor: "#d1fae5",
    title: "Add & Edit Courses",
    desc: "Missing courses can be added and existing course details can be edited from your User Profile."
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

const Dashboard = ({ isDark, setIsDark, onDataRefresh }) => {
  const { user, dashboardData, loading: authLoading, isAuthenticated, fetchUser } = useAuth();

  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [modalIsOpen, setModalIsOpen] = useState(() => {
    return !localStorage.getItem('hasSeenNewFeatures');
  });

  const handleCloseModal = () => {
    setModalIsOpen(false);
    localStorage.setItem('hasSeenNewFeatures', 'true');
  };

  /* ================= FETCH DATA ON MOUNT ================= */
  useEffect(() => {
    if (!dashboardData) {
      fetchUser();
    }
  }, [dashboardData, fetchUser]);

  /* ================= LOADING STATES ================= */
  if (authLoading || !dashboardData) {
    return <Spinner isDark={isDark} message="Waking up server..." />;
  }

  if (!isAuthenticated || !user) return null;

  /* ================= RENDER ================= */



  return (
    <div>

      <Modal
        isOpen={modalIsOpen}
        // isOpen={true}
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

      <MobileNavbar dark={isDark} setIsDark={setIsDark} />
      <Sidebar dark={isDark} />

      <Navbar
        onDataRefresh={onDataRefresh}
        dark={isDark}
        setIsDark={setIsDark}
        name={user.name || ''}
        externalModalOpen={uploadModalOpen}
        setExternalModalOpen={setUploadModalOpen}
      />

      <DashboardHeader isDark={isDark} onUpload={() => setUploadModalOpen(true)} />

      <Information
        dark={isDark}
        user={user}
        cgpa={dashboardData.cgpa}
        totalCredits={dashboardData.totalCredits}
        userSemCredits={dashboardData.userSemCredits}
        Loading={false}
      />

      <div className="wrapper">
        <Barchart
          dark={isDark}
          userSemCredits={dashboardData.userSemCredits}
          Loading={false}
        />
        <Category
          dark={isDark}
          runningTotal={dashboardData.runningTotal}
          Loading={false}
        />
      </div>

      <hr />
      <Footer />
    </div>
  );
};

export default Dashboard;
