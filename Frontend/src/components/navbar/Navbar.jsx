import { faL, faMoon, faSun, faSunPlantWilt, faUpload, faWarning } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
import { useState, useEffect } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Navbar = ({ dark, setIsDark, name }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pdf, setPdf] = useState(null);
    const [semValue, setSemValue] = useState("");
    const [showWarning, setShowWarning] = useState(true);
    const nav = useNavigate();

    // Check localStorage for warning preference on component mount
    useEffect(() => {
        const skipWarning = localStorage.getItem('skipWarning');
        if (skipWarning === 'true') {
            setShowWarning(false);
        }
    }, []);

    const handleDarkModeToggle = () => {
        setIsDark(!dark);
        localStorage.setItem('isDark', !dark);
    }
    let flag = false;

    const getGreeting = () => {
        // Get current time in IST (UTC+5:30)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const istTime = new Date(utc + (5.5 * 60 * 60 * 1000));
        const hour = istTime.getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Hope your day went well";
    };

    const handlePdfSubmit = (e) => {
        e.preventDefault();
        if (flag) return;
        flag = true;
        if (!pdf || !semValue) {
            console.log("No values provided", pdf, semValue);
            return;
        }
        const formData = new FormData(e.target);
        formData.append('pdf', pdf);
        formData.append('sem', semValue);

        for (const [key, value] of formData.entries()) {
            console.log(`${key} : ${value}`);
        }

        const url = "http://localhost:5001/api/upload";
        axios.post(url, formData, { withCredentials: true })
            .then((res) => {
                toast.success("Upload Success");
                setModalIsOpen(false)
                nav('/user')
                setTimeout(() => nav('/'), 1)
            })
            .catch((error) => {
                if(error.response && error.response.status === 400)
                {
                    toast.error("Please check if your pdf has selectable text");
                }
                console.log(`${error}`);
            })
    }

    const handleModalClose = () => {
        setModalIsOpen(false);
        setShowWarning(localStorage.getItem('skipWarning') !== 'true');
    }

    // Handle checkbox change and store preference in localStorage
    const handleWarningCheckbox = () => {
        const newShowWarning = !showWarning;
        setShowWarning(newShowWarning);
        localStorage.setItem('skipWarning', !newShowWarning);
    }

    // Handle Proceed button to show the upload form
    const handleProceed = () => {
        setShowWarning(false);
    }

    return (
        <div className='navbar-container'>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleModalClose}
                contentLabel="Upload Semester Results"
                className={`custom-modal ${dark ? 'dark' : ''}`}
            >
                {
                    showWarning ? (
                        <div className="important-info">
                            <FontAwesomeIcon className="font-warning" size="2x" icon={faWarning} />
                            <h2 className="important-header">Important Information</h2>

                            <div className="important-caption">
                                <p>Read the following carefully before proceeding.</p>
                            </div>

                            <div className="important-message">
                                <p>
                                    Please ensure your PDF contains selectable text (not just images) for proper reading and processing.
                                    If you cannot select or copy text from the PDF, please re-download it using your browser’s
                                    “Save as PDF” option before uploading.
                                </p>
                            </div>

                            <div className="checkbox-input">
                                <input 
                                    type="checkbox" 
                                    id="skip-warning" 
                                    checked={!showWarning} 
                                    onChange={handleWarningCheckbox} 
                                />
                                <label htmlFor="skip-warning">Do not show this warning again</label>
                            </div>

                            <div className="proceed-buttons">
                                <button type="button" className="btn cancel" onClick={handleModalClose}>Close</button>
                                <button className="btn proceed" onClick={handleProceed}>Proceed</button>
                            </div>
                        </div>
                    ) : (
                        <div className="upload-form-wrapper">
                            <h2>Upload Semester Results</h2>
                            <p>Drop your semester results and we’ll do the math</p>

                            <form className="upload-form" onSubmit={(e) => handlePdfSubmit(e)}>
                                <div className="form-group">
                                    <label>Semester</label>
                                    <select value={semValue} onChange={(e) => setSemValue(e.target.value)} required>
                                        <option value="">Select your semester here</option>
                                        {[...Array(8)].map((_, i) => (
                                            <option key={i} value={`sem${i + 1}`}>Semester {i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        id="upload-pdf"
                                        required
                                        hidden
                                        onChange={(e) => setPdf(e.target.files[0])}
                                    />
                                    <label htmlFor="upload-pdf" className={`upload-label ${pdf ? 'has-pdf' : ''}`}>
                                        {pdf ? `PDF Selected: ${pdf.name}` : "Upload PDF"}
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn cancel" onClick={handleModalClose}>Close</button>
                                    <button type="submit" className="btn submit">Submit</button>
                                </div>
                            </form>
                        </div>
                    )
                }
            </Modal>

            <div className="navbar-wrapper">
                <div className="navbar-message">
                    <h1 className='title' style={{
                        color: dark ? 'white' : 'black',
                    }}> <span>{getGreeting()},</span> {name}</h1>
                    <p className='description'>Track your academic progress and achievements</p>
                </div>
                <div className="navbar-button-group">
                    <div className="navbar-upload-button">
                        <button onClick={() => setModalIsOpen(true)}>
                            <FontAwesomeIcon className='upload-button-icon' icon={faUpload} />
                            Upload Sem Result</button>
                    </div>
                    <div className="navbar-toggle-button" onClick={handleDarkModeToggle}>
                        {
                            dark ?
                                <FontAwesomeIcon icon={faMoon} className='toggle-icon' />
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" className='toggle-icon' x="0px" y="0px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M 12 0 C 11.4 0 11 0.4 11 1 L 11 2 C 11 2.6 11.4 3 12 3 C 12.6 3 13 2.6 13 2 L 13 1 C 13 0.4 12.6 0 12 0 z M 4.1992188 3.1992188 C 3.9492188 3.1992187 3.7 3.3 3.5 3.5 C 3.1 3.9 3.1 4.5003906 3.5 4.9003906 L 4.1992188 5.5996094 C 4.5992187 5.9996094 5.1996094 5.9996094 5.5996094 5.5996094 C 5.9996094 5.1996094 5.9996094 4.5992188 5.5996094 4.1992188 L 4.9003906 3.5 C 4.7003906 3.3 4.4492188 3.1992188 4.1992188 3.1992188 z M 19.800781 3.1992188 C 19.550781 3.1992188 19.299609 3.3 19.099609 3.5 L 18.400391 4.1992188 C 18.000391 4.5992187 18.000391 5.1996094 18.400391 5.5996094 C 18.800391 5.9996094 19.400781 5.9996094 19.800781 5.5996094 L 20.5 4.9003906 C 20.9 4.5003906 20.9 3.9 20.5 3.5 C 20.3 3.3 20.050781 3.1992188 19.800781 3.1992188 z M 12 5 A 7 7 0 0 0 5 12 A 7 7 0 0 0 12 19 A 7 7 0 0 0 19 12 A 7 7 0 0 0 12 5 z M 1 11 C 0.4 11 0 11.4 0 12 C 0 12.6 0.4 13 1 13 L 2 13 C 2.6 13 3 12.6 3 12 C 3 11.4 2.6 11 2 11 L 1 11 z M 22 11 C 21.4 11 21 11.4 21 12 C 21 12.6 21.4 13 22 13 L 23 13 C 23.6 13 24 12.6 24 12 C 24 11.4 23.6 11 23 11 L 22 11 z M 4.9003906 18.099609 C 4.6503906 18.099609 4.3992188 18.200391 4.1992188 18.400391 L 3.5 19.099609 C 3.1 19.499609 3.1 20.1 3.5 20.5 C 3.9 20.9 4.5003906 20.9 4.9003906 20.5 L 5.5996094 19.800781 C 5.9996094 19.400781 5.9996094 18.800391 5.5996094 18.400391 C 5.3996094 18.200391 5.1503906 18.099609 4.9003906 18.099609 z M 19.099609 18.099609 C 18.849609 18.099609 18.600391 18.200391 18.400391 18.400391 C 18.000391 18.800391 18.000391 19.400781 18.400391 19.800781 L 19.099609 20.5 C 19.499609 20.9 20.1 20.9 20.5 20.5 C 20.9 20.1 20.9 19.499609 20.5 19.099609 L 19.800781 18.400391 C 19.600781 18.200391 19.349609 18.099609 19.099609 18.099609 z M 12 21 C 11.4 21 11 21.4 11 22 L 11 23 C 11 23.6 11.4 24 12 24 C 12.6 24 13 23.6 13 23 L 13 22 C 13 21.4 12.6 21 12 21 z"></path>
                                </svg>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar