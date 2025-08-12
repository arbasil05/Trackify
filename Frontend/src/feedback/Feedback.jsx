import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import LoginLeft from "../components/login-left/LoginLeft";
import "./Feedback.css"
import { Link } from 'react-router-dom';
const Feedback = () => {
    const [name, setName] = useState("");
    const [issue, setIssue] = useState("");

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        const displayName = name.trim() || "Anon";
        const payload = {
            content: `**Name:** ${displayName}\n**Issue:** ${issue}`
        }
        if (!issue) toast.error("Issue cannot be empty");


        // const formdata = new FormData();
        // formdata.append('name', name)
        // formdata.append('issue', issue)
        // console.log(formdata)

        const webhookUrl = "https://discord.com/api/webhooks/1404704111739408446/7bFJ0sJ9hHLRPIF6Bde3FAm4kJlX_CXgjKT9YDayc60hjSOKhDw3qSG-co95HAHANe3S";
        axios.post(webhookUrl, payload)
            .then(() => {
                toast.success("Feedback submitted successfully");
            })
            .catch((error) => {
                toast.error("There was a problem, try again later.")
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
                                <div className="login-button">
                                    <button type="submit">Submit</button>
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
