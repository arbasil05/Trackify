import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import LoginLeft from "../components/login-left/LoginLeft";
import "./Feedback.css"
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const Feedback = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [issue, setIssue] = useState("");
    const nav = useNavigate();

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

        // const formdata = new FormData();
        // formdata.append('name', name)
        // formdata.append('issue', issue)
        // console.log(formdata)

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
        <>
            <div style={{ display: "flex" }}>
                <LoginLeft />
                <div style={{ minWidth: "50%", flex: 1 }}>
                    <div style={{ width: "100%" }} className='loginright-container'>
                        <form className="login-card" onSubmit={handleFeedbackSubmit}>
                            <div className="login-header">
                                <h2>Submit your Issue</h2>
                            </div>
                            <div className="login-inputs">
                                <div className="reg-no">
                                    <label>Name</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        placeholder='Enter your Name'
                                    />
                                </div>
                                <div className="email">
                                    <label>Email</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder='Enter your Email'
                                    />
                                </div>

                                <div className="password">
                                    <label>Issue</label>
                                    <div className="password-wrapper">
                                        <textarea
                                            value={issue}
                                            onChange={(e) => setIssue(e.target.value)}
                                            type="text"
                                            placeholder='Enter your issue'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="footer">
                                <div className="login-button" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", cursor: "pointer" }}>
                                    <button type="submit">Submit</button>
                                    <p className="link-back" onClick={() => nav(-1)}><FontAwesomeIcon icon={faChevronLeft} /> Back</p>
                                </div>

                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Feedback
