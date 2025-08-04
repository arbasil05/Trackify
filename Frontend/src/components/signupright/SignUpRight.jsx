import { useState } from 'react'
import './SignUpRight.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast"
import axios from "axios"

const SignUpRight = () => {
    // name, reg_no, grad_year, dept, password
    const [name, setName] = useState("");
    const [reg_no, setRegNo] = useState("");
    const [grad_year, setGradYear] = useState("");
    const [dept, setdept] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");

    const nav = useNavigate();

    const handleSignUp = () => {
        const trimmedName = name.trim();
        const trimmedRegNo = reg_no.trim();
        const trimmedDept = dept.trim();
        const trimmedGrad = grad_year.trim();
        const trimmedPass = password.trim();
        const trimmedCPass = cpassword.trim();

        if (trimmedName === "") {
            toast.error("Name cannot be empty");
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

        const url = "http://localhost:5001/api/register"
        axios.post(url, { name, reg_no, grad_year, dept, password }, { withCredentials: true })
            .then((res) => {
                console.log(res.data.user);
                toast.success("Account creation success");
            })
            .then(() => {
                nav("/");
            })
            .catch((error) => {
                console.log(`${error}`);
                if (error.response && error.response.status === 409) {
                    toast.error("User already Exist");
                    return;
                }
                console.log(`Error while posting ${error}`);
                toast.error("Error while posting")


            })



        console.log("Ready to send user => ", newUser);
        toast.success("Account created successfully!");
    };


    return (
        <div className='signupright-container'>
            <div className="signup-card">
                <div className="signup-header">
                    <h2>Create an Account</h2>
                </div>
                <div className="signup-inputs">
                    <div className="reg-no">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' />
                    </div>
                    <div className="reg-no">
                        <label>Registration number</label>
                        <input type="text" value={reg_no} onChange={(e) => setRegNo(e.target.value)} placeholder='Enter your registration number' />
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
                                <option value="CSE(CYBERSECURITY)">CSE (CYBERSECURITY)</option>
                                <option value="CSE(IOT)">CSE (IOT)</option>
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

                    <div className="password">
                        <label>Create password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Create new password' />
                    </div>
                    <div className="password">
                        <label>Confirm password</label>
                        <input value={cpassword} onChange={(e) => setCpassword(e.target.value)} type="password" placeholder='Confirm your password' />
                    </div>
                </div>
                <div className="footer-signup">
                    <div className="signup-button">
                        <button onClick={handleSignUp}>Sign Up</button>
                    </div>
                    <p>have an account? <Link to="/login" className='link'>Sign In</Link></p>
                </div>
            </div>
        </div>
    )
}

export default SignUpRight
