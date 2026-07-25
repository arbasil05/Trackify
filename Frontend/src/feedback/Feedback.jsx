import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/sidebar/Sidebar';
import MobileNavbar from '../components/mobile-navbar/MobileNavbar';
import Navbar from '../components/navbar/Navbar';
import './Feedback.css';

const Feedback = () => {
    const { user, fetchUser, loading: authLoading } = useAuth();
    const { isDark: dark } = useTheme();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            fetchUser();
        } else {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user, fetchUser]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Submitting feedback...");

        const payload = { name, email, message };

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/feedback`, payload);
            toast.success("Feedback submitted successfully", { id: toastId });
            setMessage('');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 429) {
                toast.error("You've submitted too many feedbacks. Please try again in 15 minutes.", { id: toastId });
            } else {
                toast.error("Failed to submit feedback", { id: toastId });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`feedback-page ${dark ? 'dark' : ''}`}>
            <MobileNavbar />
            <Sidebar />
            <Navbar 
                title="Feedback" 
                subtitle="We value your input. Let us know how we can improve."
            />

            <div className="feedback-content">
                <form className="feedback-bento-card" onSubmit={handleFeedbackSubmit}>
                    <div className="feedback-inputs">
                        <div className="feedback-field">
                            <label htmlFor="feedbackName">Name</label>
                            <input
                                type="text"
                                id="feedbackName"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="feedback-field">
                            <label htmlFor="feedbackEmail">Email</label>
                            <input
                                type="email"
                                id="feedbackEmail"
                                placeholder="your.email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="feedback-field">
                            <label htmlFor="feedbackMessage">Message</label>
                            <textarea
                                id="feedbackMessage"
                                placeholder="Tell us how we can improve..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="5"
                                required
                            />
                        </div>
                    </div>

                    <div className="feedback-footer">
                        <button 
                            type="submit" 
                            className="btn proceed feedback-submit-btn" 
                            disabled={loading || !name || !email || !message}
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            {loading ? "Submitting..." : "Submit Feedback"}
                        </button>
                        <button 
                            type="button" 
                            className="btn cancel feedback-cancel-btn" 
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Feedback;
