import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsSendingOtp(true);
        const toastId = toast.loading("Sending verification code...");

        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/send-otp`;
            await axios.post(url, { email: trimmedEmail, purpose: 'password_reset' }, { withCredentials: true });
            toast.success("Verification code sent to your email", { id: toastId });
            setIsOtpSent(true);
            setResendTimer(60);
            // Auto-focus OTP input after short delay for animation
            setTimeout(() => {
                if (otpInputRef.current) {
                    otpInputRef.current.focus();
                }
            }, 100);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                toast.error("User not found with this email", { id: toastId });
            } else {
                toast.error("Failed to send verification code", { id: toastId });
            }
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleResetPassword = () => {
        const trimmedEmail = email.trim();
        const trimmedCode = otpCode.trim();
        const trimmedPass = password.trim();
        const trimmedConfirmPass = confirmPassword.trim();

        if (trimmedEmail === "") {
            toast.error("Email cannot be empty");
            return;
        }
        if (!isOtpSent || trimmedCode === "") {
            toast.error("Please verify your email first");
            return;
        }
        if (trimmedCode.length !== 6 || !/^\d{6}$/.test(trimmedCode)) {
            toast.error("Verification code must be exactly 6 digits");
            return;
        }
        if (trimmedPass.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        if (trimmedPass !== trimmedConfirmPass) {
            toast.error("Passwords do not match");
            return;
        }

        const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/forgot-password`;
        const toastId = toast.loading("Resetting your password...");
        setIsSubmitting(true);

        axios.post(url, {
            email: trimmedEmail,
            code: trimmedCode,
            password: trimmedPass,
            confirmPassword: trimmedConfirmPass
        }, { withCredentials: true })
            .then((res) => {
                toast.success("Password reset successful!", { id: toastId });
                nav("/login");
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    toast.error("Invalid or expired verification code", { id: toastId });
                    return;
                }
                if (error.response && error.response.status === 404) {
                    toast.error("User not found", { id: toastId });
                    return;
                }
                if (error.response && error.response.status === 400) {
                    toast.error(error.response.data.error || "Invalid request", { id: toastId });
                    return;
                }
                toast.error("Error while resetting password", { id: toastId });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const canSubmit = isOtpSent && otpCode.trim() !== "";

    return (
        <div className='forgotpassword-container'>
            {/* Mobile branding header - shows only on mobile/tablet */}
            <div className="forgotpassword-mobile-header">
                <h1>Trac<span>kify</span></h1>
                <p>Your Smart Student Dashboard</p>
            </div>
            <form className="forgotpassword-card" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                <div className="forgotpassword-header">
                    <h2>Reset Password</h2>
                    <p>Enter your email to receive <br /> a verification code</p>
                </div>
                <div className="forgotpassword-inputs">
                    <div className="email-field">
                        <label htmlFor="resetEmail">Email</label>
                        <div className="email-otp-wrapper">
                            <input
                                id="resetEmail"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
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
                            />
                            <button
                                type="button"
                                className="send-otp-btn"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp || email.trim() === "" || resendTimer > 0}
                            >
                                {isSendingOtp
                                    ? "Sending..."
                                    : resendTimer > 0
                                        ? `Resend in ${resendTimer}s`
                                        : isOtpSent
                                            ? "Resend OTP"
                                            : "Send OTP"}
                            </button>
                        </div>
                    </div>
                    {isOtpSent && (
                        <div className="otp-field otp-field-enter">
                            <label htmlFor="resetOtp">Verification Code</label>
                            <input
                                ref={otpInputRef}
                                id="resetOtp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                autoComplete="one-time-code"
                                value={otpCode}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow digits
                                    if (value === '' || /^\d+$/.test(value)) {
                                        setOtpCode(value);
                                    }
                                }}
                                placeholder='Enter the code sent to your email'
                                maxLength={6}
                            />
                        </div>
                    )}
                    {isOtpSent && (
                        <>
                            <div className="password-field otp-field-enter">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        autoComplete="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Enter new password'
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="eye-icon"
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </div>
                            </div>
                            <div className="confirm-password-field otp-field-enter">
                                <label htmlFor="confirmNewPassword">Confirm Password</label>
                                <div className="password-wrapper">
                                    <input
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        autoComplete="new-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Confirm new password'
                                    />
                                    <FontAwesomeIcon
                                        icon={showConfirmPassword ? faEyeSlash : faEye}
                                        className="eye-icon"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="forgotpassword-footer">
                    <div className="reset-button">
                        <button type="submit" disabled={!canSubmit || isSubmitting}>
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                    <p>Remember your password? <Link to="/login" className='link'>Sign In</Link></p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
