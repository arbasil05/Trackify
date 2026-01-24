import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LoginLeft from "../components/login-left/LoginLeft";
import "./Feedback.css"
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const Feedback = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [issue, setIssue] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
    }, [user]);

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const displayName = name.trim() || "Anon";
        const payload = {
            name: displayName,
            email: email.trim(),
            issue: issue.trim(),
        };
        if (!issue) {
            toast.error("Issue cannot be empty");
            return;
        }

        const toastId = toast.loading("Submitting...");
        axios.post(`${import.meta.env.VITE_BACKEND_API}/api/feedback`, payload)
            .then(() => {
                toast.success("Feedback submitted successfully", { id: toastId });
            })
            .catch((error) => {
                if (error.response?.status === 429) {
                    toast.error("You've submitted too many feedbacks. Please try again in 15 minutes.", { id: toastId });
                } else {
                    toast.error("There was a problem, try again later.", { id: toastId });
                }
                console.log(error);
            })
    }

    return (
        <div className="feedback-page">
            <LoginLeft />
            <div className='feedback-container'>
                {/* Mobile branding header - shows only on mobile/tablet */}
                <div className="feedback-mobile-header">
                    <h1>Trac<span>kify</span></h1>
                    <p>Your Smart Student Dashboard</p>
                </div>
                <form className="feedback-card" onSubmit={handleFeedbackSubmit}>
                    <div className="feedback-header">
                        <h2>Submit your Issue</h2>
                    </div>
                    <div className="feedback-inputs">
                        <div className="feedback-field">
                            <label htmlFor="feedbackName">Name</label>
                            <input
                                id="feedbackName"
                                name="name"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder='Enter your Name'
                            />
                        </div>
                        <div className="feedback-field">
                            <label htmlFor="feedbackEmail">Email</label>
                            <input
                                id="feedbackEmail"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder='Enter your Email'
                            />
                        </div>
                        <div className="feedback-field">
                            <label htmlFor="feedbackIssue">Issue</label>
                            <textarea
                                id="feedbackIssue"
                                name="issue"
                                value={issue}
                                onChange={(e) => setIssue(e.target.value)}
                                placeholder='Describe your issue'
                                rows={4}
                            />
                        </div>
                    </div>
                    <div className="feedback-footer">
                        <button type="submit" className="feedback-submit-btn">Submit</button>
                        <p className="feedback-back" onClick={() => nav(-1)}>
                            <FontAwesomeIcon icon={faChevronLeft} /> Back
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Feedback
