import './Spinner.css';
import { useState, useEffect } from 'react';

const loadingMessages = [
    "Waking up the server... ☕",
    "Brewing some data magic... ✨",
    "Almost there, hang tight... 🚀",
    "Crunching your numbers... 🔢",
    "Loading your academic journey... 📚",
    "Getting things ready for you... 🎯",
    "Just a moment, we're on it... ⚡",
    "Fetching your progress... 📊",
    "Preparing something awesome... 🌟",
    "Hold tight, good things coming... 🎓"
];

const Spinner = ({ isDark = false, message = '' }) => {
    const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0]);

    useEffect(() => {
        if (!message) {
            const interval = setInterval(() => {
                setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [message]);

    return (
        <div className={`spinner-wrapper ${isDark ? 'dark' : ''}`}>
            <div className="spinner-brand">
                <h1>Track<span>ify</span></h1>
            </div>
            <div className="spinner-animation">
                <div className="spinner-circle"></div>
                <div className="spinner-circle spinner-circle-2"></div>
                <div className="spinner-circle spinner-circle-3"></div>
            </div>
            <p className="spinner-message">{message || currentMessage}</p>
        </div>
    );
};

export default Spinner;
