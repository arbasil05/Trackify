import './UploadButton.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Modal from 'react-modal';

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [semester, setSemester] = useState("");

    const handleChange = (e) => {
        setSemester(e.target.value);
    };
    return (

        <div className='uploadbutton-container'>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                contentLabel="Upload Modal"
                ariaHideApp={false}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        borderRadius: "10px",
                        border: "1px solid black"
                    },
                }}
            >
                <h2>Upload Semester Results</h2>
                <div className='modal-input'>
                    <label htmlFor="semester">Select Semester</label>
                    <select id="semester" value={semester} onChange={handleChange}>
                        <option value="">-- Select --</option>
                        {Array.from({ length: 8 }, (_, i) => (
                            <option key={i + 1} value={`sem${i + 1}`}>
                                Sem {i + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <label className='uploadbutton-pdf'>
                    Upload PDF
                    <input type="file" />
                </label>
                <div className="buttons">
                    <button className='modal-button'>Submit</button>
                    <button className='modal-button' onClick={() => setIsOpen(false)}>Close</button>
                </div>
            </Modal>
            <button onClick={() => setIsOpen(true)} className='uploadbutton'> <FontAwesomeIcon icon={faUpload} /> Upload Semester Result</button>
        </div>

    )
}

export default UploadButton
