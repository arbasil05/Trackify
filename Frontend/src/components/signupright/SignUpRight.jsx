import { useState, useEffect, useRef } from 'react';
import './SignUpRight.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const SignUpRight = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [grad_year, setGradYear] = useState("");
    const [dept, setdept] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Terms and Conditions modal states
    const [showTCModal, setShowTCModal] = useState(false);
    const [tcAgreed, setTcAgreed] = useState(false);

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
        if (trimmedName.length > 20) {
            toast.error("Name cannot exceed 20 characters");
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



        setShowTCModal(true);
    };

    // Enable submit only when OTP is sent and code is entered
    const canSubmit = isOtpSent && otpCode.trim() !== "";

    const handleTCProceed = () => {
        if (tcAgreed) {
            const trimmedName = name.trim();
            const trimmedEmail = email.trim();
            const trimmedDept = dept.trim();
            const trimmedGrad = grad_year.trim();
            const trimmedPass = password.trim();
            const trimmedCode = otpCode.trim();

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
                    toast.success("Account created successfully!", { id: toastId });
                    setShowTCModal(false);
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
        } else {
            toast.error("Please acknowledge the terms to continue");

        }
    };

    const handleTCClose = () => {
        toast.error("You must accept the terms to use Trackify");
        setShowTCModal(false);
    };

    return (
        <div className='signupright-container'>
            {/* Mobile branding header - shows only on mobile/tablet */}
            <div className="signup-mobile-header">
                <h1>Trac<span>kify</span></h1>
                <p>Your Smart Student Dashboard</p>
            </div>
            <form className="signup-card" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
                <div className="signup-header">
                    <h2>Create an Account</h2>
                </div>
                <div className="signup-inputs">
                    <div className="reg-no">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val.length > 20) {
                                    toast.error("Name cannot exceed 20 characters", { id: "name-limit" });
                                    return;
                                }
                                setName(val);
                            }}
                            placeholder='Enter your name'
                        />
                    </div>
                    <div className="reg-no">
                        <label htmlFor="email">Email</label>
                        <div className="email-verify-wrapper">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    // Reset verification if email changes
                                    if (isOtpSent) {
                                        setIsOtpSent(false);
                                        setOtpCode("");
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !isOtpSent) {
                                        e.preventDefault();
                                        handleSendOtp();
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
                            <label htmlFor="otp">Verification Code</label>
                            <input
                                ref={otpInputRef}
                                id="otp"
                                name="otp"
                                type="text"
                                autoComplete="one-time-code"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                placeholder='Enter the code sent to your email'
                                maxLength={6}
                            />
                        </div>
                    )}
                    <div className="reg-wrapper">
                        <div className="reg-no">
                            <label htmlFor="department">Department</label>
                            <select id="department" name="department" value={dept} onChange={(e) => setdept(e.target.value)}>
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
                                <option value="BME">BIO MED</option>
                                <option value="MED">MED ELECTRONICS</option>
                            </select>
                        </div>
                        <div className="reg-no">
                            <label htmlFor="gradYear">Graduation year</label>
                            <select id="gradYear" name="gradYear" value={grad_year} onChange={(e) => setGradYear(e.target.value)}>
                                <option hidden>Your graduation year</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px" }}>
                        <div className="password">
                            <label htmlFor="password">Create password</label>
                            <div className="password-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    autoComplete="new-password"
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
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <div className="password-wrapper">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    autoComplete="new-password"
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

            {/* Terms and Conditions Modal */}
            {showTCModal && (
                <div className="tc-modal-overlay">
                    <div className="tc-modal">
                        <div className="tc-modal-icon">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                        </div>
                        <h2 className="tc-modal-title">Terms & Conditions</h2>
                        <p className="tc-modal-subtitle">Please read carefully before proceeding</p>

                        <div className="tc-modal-content">
                            <h4>DISCLAIMER & LIABILITY</h4>
                            <ul>
                                <li>App provided "AS IS" without warranties</li>
                                <li>No liability for CGPA calculation errors</li>
                                <li>No liability for missing course opportunities</li>
                                <li>No liability for graduation delays</li>
                                <li>No liability for technical failures</li>
                                <li>User assumes all risks of using the app</li>
                            </ul>

                            <h4>ACCURACY DISCLAIMERS</h4>
                            <ul>
                                <li>CGPA calculations are "for reference only"</li>
                                <li>App data should NOT be relied upon for official academic decisions</li>
                                <li>Graduation timeline estimates are NOT guarantees</li>
                                <li>User responsible for verifying all academic records with college</li>
                                <li>No warranty regarding prediction accuracy</li>
                                <li>Limitation of liability for errors in calculations</li>
                            </ul>
                        </div>

                        <div className="tc-modal-checkbox">
                            <input
                                type="checkbox"
                                id="tcAgree"
                                checked={tcAgreed}
                                onChange={(e) => setTcAgreed(e.target.checked)}
                            />
                            <label htmlFor="tcAgree">I have read and agree to the Terms & Conditions</label>
                        </div>

                        <div className="tc-modal-buttons">
                            <button type="button" className="tc-btn-close" onClick={handleTCClose}>Close</button>
                            <button
                                type="button"
                                className="tc-btn-proceed"
                                onClick={handleTCProceed}
                                disabled={!tcAgreed}
                            >Proceed</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUpRight;