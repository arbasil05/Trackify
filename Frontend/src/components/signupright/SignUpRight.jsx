import { useState, useEffect, useRef } from 'react';
import './SignUpRight.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUpRight = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [grad_year, setGradYear] = useState("");
    const [dept, setdept] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Email verification states
    const [otpCode, setOtpCode] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const otpInputRef = useRef(null);

    const nav = useNavigate();

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [resendTimer]);

    const handleSendOtp = async () => {
        const trimmedEmail = email.trim();

        if (trimmedEmail === "") {
            toast.error("Please enter your email first");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSendingOtp(true);
        const toastId = toast.loading("Sending verification code...");

        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/send-otp`;
            await axios.post(url, { email: trimmedEmail, purpose: 'registration' }, { withCredentials: true });
            toast.success("Verification code sent to your email", { id: toastId });
            setIsOtpSent(true);
            setResendTimer(60); // Start 60 second countdown
            // Auto-focus OTP input after short delay for animation
            setTimeout(() => {
                if (otpInputRef.current) {
                    otpInputRef.current.focus();
                }
            }, 100);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                toast.error("User already exists with this email", { id: toastId });
            } else {
                toast.error("Failed to send verification code", { id: toastId });
            }
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleSignUp = () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedDept = dept.trim();
        const trimmedGrad = grad_year.trim();
        const trimmedPass = password.trim();
        const trimmedCPass = cpassword.trim();
        const trimmedCode = otpCode.trim();

        if (trimmedName === "") {
            toast.error("Name cannot be empty");
            return;
        }
        if (trimmedEmail === "") {
            toast.error("Email cannot be empty");
            return;
        }
        if (!isOtpSent || trimmedCode === "") {
            toast.error("Please verify your email first");
            return;
        }
        if (trimmedDept === "") {
            toast.error("Please select your department");
            return;
        }
        if (trimmedGrad === "") {
            toast.error("Please choose your graduation year");
            return;
        }
        if (trimmedPass.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        if (trimmedPass !== trimmedCPass) {
            toast.error("Passwords do not match");
            return;
        }

        const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/register`;
        const toastId = toast.loading("Creating your account...");

        axios.post(url, {
            name: trimmedName,
            email: trimmedEmail,
            code: trimmedCode,
            grad_year: trimmedGrad,
            dept: trimmedDept,
            password: trimmedPass
        }, { withCredentials: true })
            .then((res) => {
                toast.success("Account creation success", { id: toastId });
                nav("/");
            })
            .catch((error) => {
                if (error.response && error.response.status === 409) {
                    toast.error("User already exists", { id: toastId });
                    return;
                }
                if (error.response && error.response.status === 401) {
                    toast.error("Invalid or expired verification code", { id: toastId });
                    return;
                }
                toast.error("Error while creating account", { id: toastId });
            });
    };

    // Enable submit only when OTP is sent and code is entered
    const canSubmit = isOtpSent && otpCode.trim() !== "";

    return (
        <div className='signupright-container'>
            <form className="signup-card" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                <div className="signup-header">
                    <h2>Create an Account</h2>
                </div>
                <div className="signup-inputs">
                    <div className="reg-no">
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your name'
                        />
                    </div>
                    <div className="reg-no">
                        <label>Email</label>
                        <div className="email-verify-wrapper">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    // Reset verification if email changes
                                    if (isOtpSent) {
                                        setIsOtpSent(false);
                                        setOtpCode("");
                                    }
                                }}
                                placeholder='Enter your email'
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                className="verify-email-btn"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp || email.trim() === "" || resendTimer > 0}
                            >
                                {isSendingOtp
                                    ? "Sending..."
                                    : resendTimer > 0
                                        ? `Resend in ${resendTimer}s`
                                        : isOtpSent
                                            ? "Resend OTP"
                                            : "Verify Email"}
                            </button>
                        </div>
                    </div>
                    {isOtpSent && (
                        <div className="reg-no otp-field-enter">
                            <label>Verification Code</label>
                            <input
                                ref={otpInputRef}
                                type="text"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder='Enter the code sent to your email'
                                maxLength={6}
                            />
                        </div>
                    )}
                    <div className="reg-wrapper">
                        <div className="reg-no">
                            <label>Department</label>
                            <select value={dept} onChange={(e) => setdept(e.target.value)}>
                                <option hidden>Your department</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="AIDS">AIDS</option>
                                <option value="AIML">AIML</option>
                                <option value="CYBER">CSE (CYBERSECURITY)</option>
                                <option value="IOT">CSE (IOT)</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="EIE">EIE</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="CHEM">CHEMICAL</option>
                                <option value="BME">BME</option>
                                <option value="MED">MEDICAL</option>
                            </select>
                        </div>
                        <div className="reg-no">
                            <label>Graduation year</label>
                            <select value={grad_year} onChange={(e) => setGradYear(e.target.value)}>
                                <option hidden>Your graduation year</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px" }}>
                        <div className="password">
                            <label>Create password</label>
                            <div className="password-wrapper">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    placeholder='Create new password'
                                />
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className="eye-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                />
                            </div>
                        </div>
                        <div className="password">
                            <label>Confirm password</label>
                            <div className="password-wrapper">
                                <input
                                    value={cpassword}
                                    onChange={(e) => setCpassword(e.target.value)}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder='Confirm your password'
                                />
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                    className="eye-icon"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-signup">
                    <div className="signup-button">
                        <button type="submit" disabled={!canSubmit}>Sign Up</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center", width: "100%" }}  >
                        <Link to="/login" className='link'>Sign In</Link>
                        <Link className='link' to="/feedback">Need help?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignUpRight;