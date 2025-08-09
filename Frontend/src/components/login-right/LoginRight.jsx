import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './LoginRight.css';

const LoginRight = () => {
  const [reg_no, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  const handleloginsubmit = () => {
    if (reg_no.trim() === "") {
      toast.error("Please enter your register number");
      return;
    }

    if (reg_no.length !== 12) {
      toast.error("Register number should be 12 characters");
      return;
    }

    if (password.trim() === "") {
      toast.error("Please enter your password");
      return;
    }

    if (password.length < 8) {
      toast.error("Password should be at least 8 characters");
      return;
    }

    const url = "http://localhost:5001/api/login";
    axios.post(url, { reg_no, password }, { withCredentials: true })
      .then((res) => {
        console.log(res.data.user);
        toast.success("Logged in successfully");
        nav("/");
      })
      .catch((error) => {
        console.log(`Error while logging in: ${error}`);
        if (error.response && error.response.status === 401) {
          toast.error("User does not exist");
        } else {
          toast.error("Error while logging in");
        }
      });
  };

  return (
    <div className='loginright-container'>
      <form className="login-card" onSubmit={(e) => { e.preventDefault(); handleloginsubmit(); }}>
        <div className="login-header">
          <h2>Login to Account</h2>
          <p>Please enter your Registration number <br /> and Password to continue</p>
        </div>
        <div className="login-inputs">
          <div className="reg-no">
            <label>Registration Number</label>
            <input
              value={reg_no}
              onChange={(e) => setRegNo(e.target.value)}
              type="text"
              placeholder='Enter your Registration number'
            />
          </div>
          <div className="password">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder='Enter your password'
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="login-button">
            <button type="submit">Sign In</button>
          </div>
          <p>Don't have an account? <Link to="/signup" className='link'>Create Account</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginRight;