import './LoginForm.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faHashtag, faIdBadge, faIdCard, faLock } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Link } from 'react-router-dom'


const LoginForm = () => {
    const [eyeOpen,setEyeOpen] = useState(false);
    return (
        <div className='loginform-container'>
            <div className="regno">
                <FontAwesomeIcon icon={faIdBadge} />
                <input type="text" placeholder='Register Number' />
            </div>
            <div className="password">
                <div>
                    <FontAwesomeIcon icon={faLock} />
                    <input type={eyeOpen?"text":"password"} placeholder='Password' />
                </div>
                <FontAwesomeIcon className='eye' onClick={()=>setEyeOpen(!eyeOpen)} icon={eyeOpen?faEye:faEyeSlash}/>
            </div>
            <button>Login</button>
            <p>New User ? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}

export default LoginForm
