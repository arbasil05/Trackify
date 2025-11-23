import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { useState } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './LoginRight.css';

const LoginRight = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const nav = useNavigate();

  const handleloginsubmit = () => {
    if (email.trim() === "") {
      toast.error("Please enter your email");
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

    const url = `${import.meta.env.VITE_BACKEND_API}/api/auth/login`;
    const toastId = toast.loading("Logging you in...");

    axios.post(url, { email, password }, { withCredentials: true })
      .then((res) => {
        // console.log(res.data.user);
        toast.success("Logged in successfully", { id: toastId });
        nav("/");
      })
      .catch((error) => {
        // console.log(`Error while logging in: ${error}`);
        if (error.response && error.response.status === 401) {
          toast.error("User does not exist", { id: toastId });
        } else {
          toast.error("Error while logging in", { id: toastId });
        }
      });
  };

  return (
    <div className='loginright-container'>
      <form className="login-card" onSubmit={(e) => { e.preventDefault(); handleloginsubmit(); }}>
        <div className="login-header">
          <h2>Login to Account</h2>
          <p>Please enter your email <br /> and Password to continue</p>
        </div>
        <div className="login-inputs">
          <div className="reg-no">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder='Enter your email'
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