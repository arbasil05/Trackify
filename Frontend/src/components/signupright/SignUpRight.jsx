import { useState } from 'react';
import './SignUpRight.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const SignUpRight = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [reg_no, setRegNo] = useState("");
    const [grad_year, setGradYear] = useState("");
    const [dept, setdept] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const nav = useNavigate();

    const handleSignUp = () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedRegNo = reg_no.trim();
        const trimmedDept = dept.trim();
        const trimmedGrad = grad_year.trim();
        const trimmedPass = password.trim();
        const trimmedCPass = cpassword.trim();

        if (trimmedName === "") {
            toast.error("Name cannot be empty");
            return;
        }
        if (trimmedEmail === "") {
            toast.error("Email cannot be empty");
            return;
        }
        if (trimmedRegNo === "") {
            toast.error("Registration number cannot be empty");
            return;
        }
        if (trimmedRegNo.length !== 12) {
            toast.error("Registration number must be exactly 12 characters");
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

        axios.post(url, { name, email, reg_no, grad_year, dept, password }, { withCredentials: true })
            .then((res) => {
                // console.log(res.data.user);
                toast.success("Account creation success", { id: toastId });
                nav("/");
            })
            .catch((error) => {
                // console.log(`${error}`);
                if (error.response && error.response.status === 409) {
                    toast.error("User already exists", { id: toastId });
                    return;
                }
                // console.log(`Error while posting ${error}`);
                toast.error("Error while posting", { id: toastId });
            });
    };

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
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                        />
                    </div>
                    <div className="reg-no">
                        <label>Registration number</label>
                        <input
                            type="text"
                            value={reg_no}
                            onChange={(e) => setRegNo(e.target.value)}
                            placeholder='Enter your registration number'
                        />
                    </div>
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
                                <option value="BME">BIO MED</option>
                                <option value="MED">MED ELECTRONICS</option>
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
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between", gap:"15px"}}>
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
                        <button type="submit">Sign Up</button>
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