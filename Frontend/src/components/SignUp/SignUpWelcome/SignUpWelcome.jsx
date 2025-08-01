import { useState } from 'react';
import './SignUpWelcome.css';
import "@lottiefiles/lottie-player";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowAltCircleLeft,
    faArrowAltCircleRight,
    faIdBadge,
    faUser,
    faGraduationCap,
    faBuildingColumns,
    faLock
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { validateStep } from '../../../controller/signupcontroller';
import toast from 'react-hot-toast';

const SignUpWelcome = () => {
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        name: '',
        regno: '',
        gradYear: '',
        department: '',
        password: '',
        confirmPassword: ''
    });

    const handleNext = () => {
        const errors = validateStep(formData, step);
        if (Object.keys(errors).length === 0) {
            setStep(prev => prev + 1);
        } else {
            toast.error(errors.value)
        }
    };

    const handlePrev = () => {
        if (step > 0) setStep(prev => prev - 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className='signupwelcome'>
            {step === 0 && (
                <>
                    <h1 className="signup-title">Trackify</h1>
                    <h3 className="signup-subtitle">
                        Your personal dashboard to track and manage academic credits
                    </h3>
                    <lottie-player
                        src="/tracking.json"
                        background="transparent"
                        speed="1"
                        loop
                        autoplay
                        style={{ width: "100%", height: "300px" }}
                    ></lottie-player>
                    <button onClick={handleNext}>
                        Get Started <FontAwesomeIcon icon={faArrowAltCircleRight} />
                    </button>
                    <p className='login-redirect'>
                        Have an account? <Link to="/login">Log In</Link>
                    </p>
                </>
            )}

            {step === 1 && (
                <div className='SignUpInputWrapper'>
                    <h3 className='step'>{step} out of 3</h3>
                    <h2>Tell us about you</h2>

                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faUser} />
                        <input
                            autoComplete='off'
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faIdBadge} />
                        <input
                            autoComplete='off'
                            type="text"
                            name="regno"
                            value={formData.regno}
                            onChange={handleChange}
                            placeholder="Register Number"
                        />
                    </div>

                    <button onClick={handleNext}>Next</button>
                    <button className='back' onClick={handlePrev}>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className='SignUpInputWrapper'>
                    <h3 className='step'>{step} out of 3</h3>
                    <h2>Education Details</h2>

                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faGraduationCap} />
                        <select name="gradYear" value={formData.gradYear} onChange={handleChange}>
                            <option value="">Select Graduation Year</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                        </select>
                    </div>

                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faBuildingColumns} />
                        <select name="department" value={formData.department} onChange={handleChange}>
                            <option value="">Select Department</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="AIDS">AIDS</option>
                            <option value="AIML">AIML</option>
                        </select>
                    </div>

                    <button onClick={handleNext}>Next</button>
                    <button className='back' onClick={handlePrev}>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className='SignUpInputWrapper'>
                    <h3 className='step'>{step} out of 3</h3>
                    <h2>Secure your account</h2>

                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            autoComplete='off'
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="input-with-icon">
                        <FontAwesomeIcon icon={faLock} />
                        <input
                            autoComplete='off'
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                        />
                    </div>

                    <button onClick={() => {
                        const errors = validateStep(formData, step);
                        if (Object.keys(errors).length === 0) {
                            console.log("✅ Submitting form:", formData);
                        } else {
                            toast.error(errors.value)
                        }
                    }}>
                        Finish
                    </button>
                    <button className='back' onClick={handlePrev}>
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignUpWelcome;
