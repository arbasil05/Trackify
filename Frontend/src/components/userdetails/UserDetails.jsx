import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './UserDetails.css';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserDetails = ({ isDark, userDetails }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...userDetails });
  const nav = useNavigate();

  const handleChange = (field, value) => {
    setEditedDetails((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCancel = () => {
    setEditedDetails({ ...userDetails });
    setIsEditable(false);
  };

  const handleSave = () => {
    const url = "http://localhost:5001/api/updateProfile";
    axios.put(url, editedDetails, { withCredentials: true })
      .then((res) => {
        toast.success("Personal Details updated successfully");
        console.log(res);
        nav('/')
        setTimeout(() => nav('/user'), 1)


      })
      .catch((error) => {
        toast.error("Error updating details")
        console.log(error);

      })
    // console.log("Saving details:", editedDetails);
    setIsEditable(false);
  };

  return (
    <div className={`userdetails-container ${isDark ? 'dark' : ''}`}>
      <div className="userdetails-header">
        <h2>Personal Details</h2>
        <FontAwesomeIcon onClick={() => setIsEditable(!isEditable)} className="pencil-icon" icon={faPencil} />
      </div>

      <div className="userdetails-body">
        <div className="first-row">
          <div className="name-input">
            <label>Name</label>
            {
              isEditable ? (
                <input
                  className="userdetails-input"
                  type="text"
                  value={editedDetails.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              ) : (
                <input
                  className="userdetails-input"
                  type="text"
                  disabled
                  value={userDetails.name}
                />
              )
            }
          </div>

          <div className="dept-input">
            <label>Department</label>
            {
              isEditable ? (
                <select
                  value={editedDetails.dept}
                  className="userdetails-input"
                  onChange={(e) => handleChange("dept", e.target.value)}
                >
                  <option hidden>Change your department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="AIDS">AIDS</option>
                  <option value="AIML">AIML</option>
                  <option value="CYBER">CSE (CYBERSECURITY)</option>
                  <option value="IOT">CSE (IOT)</option>
                </select>
              ) : (
                <input
                  className="userdetails-input"
                  type="text"
                  disabled
                  value={userDetails.dept}
                />
              )
            }
          </div>
        </div>

        <div className="second-row">
          <div className="reg-no">
            {
              isEditable ? (
                <label>Register Number (Not Editable)</label>
              ) : (
                <label>Register Number</label>
              )
            }

            {
              isEditable ? (
                <input
                  className="userdetails-input"
                  type="text"
                  disabled
                  style={{ backgroundColor: "crimson" }}
                  value={userDetails.reg_no}
                />

              ) : (
                <input
                  className="userdetails-input"
                  type="text"
                  disabled
                  value={userDetails.reg_no}
                />

              )
            }

          </div>

          <div className="grad-year">
            <label>Graduation Year</label>
            {
              isEditable ? (
                <select
                  value={editedDetails.grad_year}
                  className="userdetails-input"
                  onChange={(e) => handleChange("grad_year", e.target.value)}
                >
                  <option hidden>Change your graduation year</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
              ) : (
                <input
                  className="userdetails-input"
                  type="text"
                  disabled
                  value={userDetails.grad_year}
                />
              )
            }
          </div>
        </div>
      </div>

      {
        isEditable && (
          <div className="userdetails-buttons">
            <button className="user-cancel" onClick={handleCancel}>Cancel</button>
            <button className="user-save" onClick={handleSave}>Save Changes</button>
          </div>
        )
      }
    </div>
  );
};

export default UserDetails;
