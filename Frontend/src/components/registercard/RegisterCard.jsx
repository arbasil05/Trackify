import { useState } from 'react'
import './RegisterCard.css'
import {Link,useNavigate} from 'react-router-dom'
import registrationValidation from '../../utils/registrationValidation'


const RegisterCard = () => {
    const [name,SetName] = useState("");
    const [regno,setRegno] = useState("");
    const [gradYear,setGradYear] = useState("");
    const [dept,setDept] = useState("");
    const [password,setPassword] = useState("");
    const [cpassword,setCpassword] = useState("");
    const nav = useNavigate();
    const handleRegister = ()=>{
        registrationValidation(nav,name,regno,gradYear,dept,password,cpassword);
    }
    return (
        <div className='register-card'>
            <div className="register-card-container">
                <div className="register-header">
                    <h1>Trackify</h1>
                    <p>Credit Tracking System</p>
                </div>
                <div className="register-body">
                    <div className="register-body-message">
                        <h3>Create Account</h3>
                        <p>Register to start tracking your progress</p>
                    </div>
                    <div className="register-input">
                        <div className="register-name">
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e)=>SetName(e.target.value)} placeholder='Enter your name' />
                        </div>
                        <div className="register-reg-no">
                            <label>Registration Number</label>
                            <input type="text" value={regno} onChange={(e)=>setRegno(e.target.value)} placeholder='Enter your registration number' />
                        </div>
                        <div className="Graduation-year">
                            <label>Graduation Year</label>
                            <select value={gradYear} onChange={(e)=>setGradYear(e.target.value)}>
                                <option value="" disabled>Select your graduation year</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                            </select>
                        </div>
                        <div className="register-department">
                            <label>Department</label>
                            <select  value={dept} onChange={(e)=>setDept(e.target.value)}>
                                <option value="" disabled>Select your Department</option>
                                <option value="CSE">Computer Science Engineering</option>
                                <option value="AIDS">Artificial Intelligence and Data Science</option>
                                <option value="AIML">Artificial Intelligence and Machine Learning</option>
                                <option value="ECE">Electronics and Communication Engineering</option>
                                <option value="EEE">Electrical and Electronics Engineering</option>
                                <option value="Mech">Mechanical Engineering</option>
                                <option value="Civil">Civil Engineering</option>
                            </select>
                        </div>
                        <div className="register-password">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' />
                        </div>
                        <div className="register-confirm-password">
                            <label>Confirm Password</label>
                            <input type="password" value={cpassword} onChange={(e)=>setCpassword(e.target.value)} placeholder='Confirm your password' />
                        </div>
                        <div className="register-button">
                            <button onClick={handleRegister}>
                                Register
                            </button>
                        </div>
                    </div>
                    <div className="redirect-login">
                        <p>Already a User? <Link to={"/login"}>Login</Link> now</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterCard
