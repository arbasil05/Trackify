import { useState } from 'react'
import './LoginCard.css'
import {Link,useNavigate} from 'react-router-dom'
import loginValidation from '../../utils/loginValidation';
import toast from "react-hot-toast"
const LoginCard = () => {
    const [regno,setRegno] = useState("");
    const [password,setPassword] = useState("");
    const nav = useNavigate();

    const handleLogin = () =>{
        loginValidation(nav,regno,password);
    }

    return (
        <div className='card'>
            <div className="login-card-container">
                <div className="login-header">
                    <h1>Trackify</h1>
                    <p>Credit Tracking System</p>
                </div>
                <div className="login-body">
                    <div className="login-body-message">
                        <h3>Welcome Back</h3>
                        <p>Log in to access your progress</p>
                    </div>
                    <div className="login-input">
                        <div className="reg-no">
                            <label>Registration Number</label>
                            <input type="text" value={regno} onChange={(e)=>setRegno(e.target.value)} placeholder='Enter your registration number' />
                        </div>
                        <div className="password">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' />
                        </div>
                        <div className="login-button">
                            <button onClick={handleLogin}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
                <div className="redirect-register">
                    <p>New User? <Link to={"/register"}>Register</Link> now</p>
                </div>
            </div>

        </div>
    )
}

export default LoginCard
