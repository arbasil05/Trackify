import { faMoon, faUpload, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { useState, useEffect, useRef, memo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import AddSingleCourseModal from "./AddSingleCourseModal";
import WarningModalStep from "./WarningModalStep";
import UploadModalStep from "./UploadModalStep";
import MissingModalStep from "./MissingModalStep";
import AddCourseFormModalStep from "./AddCourseFormModalStep";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement("#root");

const Navbar = ({ dark, setIsDark, name, onDataRefresh, onAddCourse, externalModalOpen, setExternalModalOpen }) => {
    const { dashboardData, refreshUser } = useAuth();
    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalStep, setModalStep] = useState("warning");
    const [pdf, setPdf] = useState(null);
    const [semValue, setSemValue] = useState("");
    const [missingCourses, setMissingCourses] = useState([]);
    const [addCourses, setAddCourses] = useState([]);
    const isSubmitting = useRef(false);

    // Get existingSemesters from context
    const existingSemesters = dashboardData?.existingSemesters || [];

    const location = useLocation();
    const isUserRoute = location.pathname === "/user";

    // Sync external modal trigger with internal state
    useEffect(() => {
        if (externalModalOpen) {
            setModalIsOpen(true);
            if (setExternalModalOpen) setExternalModalOpen(false); // Reset external trigger
        }
    }, [externalModalOpen, setExternalModalOpen]);

    useEffect(() => {
        const skipWarning = localStorage.getItem("skipWarning");
        setModalStep(skipWarning === "true" ? "upload" : "warning");
    }, []);

    const handleDarkModeToggle = () => {
        setIsDark(!dark);
        localStorage.setItem("isDark", !dark);
    };

    const getGreeting = () => {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const ist = new Date(utc + 5.5 * 60 * 60 * 1000);
        const hour = ist.getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Hope your day went well";
    };

    // --- Modal Step Handlers ---
    const handlePdfSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        if (!pdf || !semValue) {
            toast.error("Please select a semester and PDF");
            isSubmitting.current = false;
            return;
        }

        const formData = new FormData();
        formData.append("pdf", pdf);
        formData.append("sem", semValue);

        const toastId = toast.loading("Uploading...");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_API}/api/semester/upload`,
                formData,
                { withCredentials: true }
            );

            toast.success("Upload successful", { id: toastId });

            if (res.data?.missing_subs?.length) {
                setMissingCourses(res.data.missing_subs);
                setModalStep("missing");
            } else {
                closeCompletely();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Something went wrong", {
                id: toastId,
            });
            console.error(err);
        } finally {
            isSubmitting.current = false;
        }
    };

    const closeCompletely = () => {
        setModalIsOpen(false);
        setPdf(null);
        setSemValue("");
        setMissingCourses([]);
        setAddCourses([]);
        refreshUser(); // Refresh context data
        if (onDataRefresh) onDataRefresh();

        const skipWarning = localStorage.getItem("skipWarning");
        setModalStep(skipWarning === "true" ? "upload" : "warning");
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
        setMissingCourses([]);

        const skipWarning = localStorage.getItem("skipWarning");
        setModalStep(skipWarning === "true" ? "upload" : "warning");
    };

    const handleWarningCheckbox = () => {
        const current = localStorage.getItem("skipWarning") === "true";
        localStorage.setItem("skipWarning", !current);
    };

    const handleAddCoursesSubmit = async () => {
        // Validate all courses have required fields
        for (const course of addCourses) {
            if (!course.credits || !course.gradePoint || !course.category) {
                toast.error("Please fill all fields for each course");
                return;
            }
        }

        const toastId = toast.loading("Saving courses...");

        try {
            // Submit each course
            for (const course of addCourses) {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_API}/api/semester/addCourses`,
                    course,
                    { withCredentials: true }
                );
            }

            toast.success("Courses added successfully", { id: toastId });
            closeCompletely();
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to add courses", {
                id: toastId,
            });
            console.error(err);
        }
    };

    // --- Modal Step Components ---
    const renderModalStep = () => {
        switch (modalStep) {
            case "warning":
                return (
                    <WarningModalStep
                        dark={dark}
                        onClose={handleModalClose}
                        onProceed={() => setModalStep("upload")}
                        onCheckbox={handleWarningCheckbox}
                    />
                );
            case "upload":
                return (
                    <UploadModalStep
                        dark={dark}
                        semValue={semValue}
                        setSemValue={setSemValue}
                        existingSemesters={existingSemesters}
                        pdf={pdf}
                        setPdf={setPdf}
                        onSubmit={handlePdfSubmit}
                        onClose={handleModalClose}
                    />
                );
            case "missing":
                return (
                    <MissingModalStep
                        dark={dark}
                        missingCourses={missingCourses}
                        onContinue={() => {
                            setAddCourses(
                                missingCourses.map((c) => ({
                                    course_name: c.name || "",
                                    code: c.code || "",
                                    credits: "",
                                    gradePoint: "",
                                    sem: semValue,
                                    category: "",
                                }))
                            );
                            setModalStep("AddCourseForm");
                        }}
                        onLater={closeCompletely}
                    />
                );
            case "AddCourseForm":
                return (
                    <AddCourseFormModalStep
                        dark={dark}
                        addCourses={addCourses}
                        setAddCourses={setAddCourses}
                        onSave={handleAddCoursesSubmit}
                        onCancel={closeCompletely}
                    />
                );
            default:
                return null;
        }
    };

    // for adding individual courses


    return (
        <div className="navbar-container">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleModalClose}
                className={`custom-modal ${dark ? "dark" : ""} ${
                    modalStep === "warning" || modalStep === "AddCourseForm"
                        ? "wide-modal"
                        : "narrow-modal"
                }`}
                overlayClassName="modal-overlay"
            >
                {renderModalStep()}
            </Modal>



            {/* ================= NAVBAR ================= */}
            <div className="navbar-wrapper">
                <div className="navbar-message">
                    <h1
                        className="title"
                        style={{ color: dark ? "white" : "black" }}
                    >
                        <span>{getGreeting()},</span> {name}
                    </h1>
                    <p className="description">
                        Track your academic progress and know what else to
                        enroll in
                    </p>
                </div>

                <div className="navbar-button-group">
                    <div className="navbar-upload-button">
                        {!isUserRoute && location.pathname !== "/explore" && (
                            <button onClick={() => setModalIsOpen(true)}>
                                <FontAwesomeIcon
                                    className="upload-button-icon"
                                    icon={faUpload}
                                />
                                <span className="button-text">Upload Sem Result</span>
                            </button>
                        )}

                        {isUserRoute && (
                            <button onClick={onAddCourse} className="navbar-add-course-btn">
                                <FontAwesomeIcon
                                    className="upload-button-icon"
                                    icon={faPlus}
                                />
                                <span className="button-text">Add Course</span>
                            </button>
                        )}
                    </div>
                    <div
                        className="navbar-toggle-button"
                        onClick={handleDarkModeToggle}
                    >
                        {dark ? (
                            <FontAwesomeIcon
                                icon={faMoon}
                                className="toggle-icon"
                            />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="toggle-icon"
                                x="0px"
                                y="0px"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M 12 0 C 11.4 0 11 0.4 11 1 L 11 2 C 11 2.6 11.4 3 12 3 C 12.6 3 13 2.6 13 2 L 13 1 C 13 0.4 12.6 0 12 0 z M 4.1992188 3.1992188 C 3.9492188 3.1992187 3.7 3.3 3.5 3.5 C 3.1 3.9 3.1 4.5003906 3.5 4.9003906 L 4.1992188 5.5996094 C 4.5992187 5.9996094 5.1996094 5.9996094 5.5996094 5.5996094 C 5.9996094 5.1996094 5.9996094 4.5992188 5.5996094 4.1992188 L 4.9003906 3.5 C 4.7003906 3.3 4.4492188 3.1992188 4.1992188 3.1992188 z M 19.800781 3.1992188 C 19.550781 3.1992188 19.299609 3.3 19.099609 3.5 L 18.400391 4.1992188 C 18.000391 4.5992187 18.000391 5.1996094 18.400391 5.5996094 C 18.800391 5.9996094 19.400781 5.9996094 19.800781 5.5996094 L 20.5 4.9003906 C 20.9 4.5003906 20.9 3.9 20.5 3.5 C 20.3 3.3 20.050781 3.1992188 19.800781 3.1992188 z M 12 5 A 7 7 0 0 0 5 12 A 7 7 0 0 0 12 19 A 7 7 0 0 0 19 12 A 7 7 0 0 0 12 5 z M 1 11 C 0.4 11 0 11.4 0 12 C 0 12.6 0.4 13 1 13 L 2 13 C 2.6 13 3 12.6 3 12 C 3 11.4 2.6 11 2 11 L 1 11 z M 22 11 C 21.4 11 21 11.4 21 12 C 21 12.6 21.4 13 22 13 L 23 13 C 23.6 13 24 12.6 24 12 C 24 11.4 23.6 11 23 11 L 22 11 z M 4.9003906 18.099609 C 4.6503906 18.099609 4.3992188 18.200391 4.1992188 18.400391 L 3.5 19.099609 C 3.1 19.499609 3.1 20.1 3.5 20.5 C 3.9 20.9 4.5003906 20.9 4.9003906 20.5 L 5.5996094 19.800781 C 5.9996094 19.400781 5.9996094 18.800391 5.5996094 18.400391 C 5.3996094 18.200391 5.1503906 18.099609 4.9003906 18.099609 z M 19.099609 18.099609 C 18.849609 18.099609 18.600391 18.200391 18.400391 18.400391 C 18.000391 18.800391 18.000391 19.400781 18.400391 19.800781 L 19.099609 20.5 C 19.499609 20.9 20.1 20.9 20.5 20.5 C 20.9 20.1 20.9 19.499609 20.5 19.099609 L 19.800781 18.400391 C 19.600781 18.200391 19.349609 18.099609 19.099609 18.099609 z M 12 21 C 11.4 21 11 21.4 11 22 L 11 23 C 11 23.6 11.4 24 12 24 C 12.6 24 13 23.6 13 23 L 13 22 C 13 21.4 12.6 21 12 21 z"
                                />
                            </svg>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Navbar);
