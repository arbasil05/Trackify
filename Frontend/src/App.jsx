import React, { useEffect, useState } from 'react';
import './App.css';
import { useTheme } from './context/ThemeContext';
import { ThemeProvider } from './context/ThemeContext';

const NEW_DOMAIN_URL = 'https://trackify.arbasil.me/'; 

function CountdownRing({ totalTime, timeLeft }) {
  const radius = 40;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="countdown-ring-wrapper">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="countdown-svg"
      >
        <circle
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset: circumference,
            '--circumference': circumference
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="countdown-circle-animated"
        />
      </svg>
      <div className="countdown-text">
        {Math.ceil(timeLeft)}
      </div>
    </div>
  );
}

function RedirectContent() {
  const { isDark } = useTheme();
  const [timeLeft, setTimeLeft] = useState(5);
  const totalTime = 5;

  useEffect(() => {
    // Timer only for the text number, updates once per second
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { // Redirect when hitting 0 equivalent
          clearInterval(timer);
          window.location.href = NEW_DOMAIN_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirectNow = () => {
    window.location.href = NEW_DOMAIN_URL;
  };

  return (
    <div className={`redirect-container ${isDark ? 'dark' : ''}`}>
      <div className={`redirect-card ${isDark ? 'dark' : ''}`}>
        <h1 className="redirect-title">We've Moved! 🏡</h1>
        <p className="redirect-message">
          Trackify has a new home. You will be redirected automatically in...
        </p>
        
        <div className="countdown-container">
           <CountdownRing timeLeft={timeLeft} totalTime={totalTime} />
        </div>

        <p className="redirect-subtext">
          If you are not redirected, click the button below.
        </p>

        <button className="btn proceed redirect-btn" onClick={handleRedirectNow}>
          Go to New Domain
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <RedirectContent />
    </ThemeProvider>
  );
}

export default App;
