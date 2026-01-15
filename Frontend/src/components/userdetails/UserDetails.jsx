import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './UserDetails.css';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const UserDetails = ({ userDetails, onDataRefresh }) => {
  const { isDark } = useTheme();
  const [isEditable, setIsEditable] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...userDetails });

  useEffect(() => {
    if (!isEditable) {
      setEditedDetails({ ...userDetails });
    }
  }, [userDetails, isEditable]);

  const handleChange = (field, value) => {
    setEditedDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setEditedDetails({ ...userDetails });
    setIsEditable(false);
  };

  const handleSave = () => {
    // if (editedDetails.name.trim() === "") {
    //   toast.error("Name cannot be empty");
    //   return;
    // }

    if (editedDetails.name.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }


    const url = `${import.meta.env.VITE_BACKEND_API}/api/user/updateProfile`;
    axios
      .put(url, editedDetails, { withCredentials: true })
      .then((res) => {
        toast.success("Personal Details updated successfully");
        // console.log(res);
        onDataRefresh();
      })
      .catch((error) => {
        toast.error("Error updating details");
        // console.log(error);
      });
    setIsEditable(false);
  };

  return (
    <div className={`userdetails-container ${isDark ? 'dark' : ''}`}>
      <div className="userdetails-header">
        <h2>Personal Details</h2>
        <FontAwesomeIcon
          onClick={() => setIsEditable(!isEditable)}
          className="pencil-icon"
          icon={faPencil}
        />
      </div>

      <div className="userdetails-body">
        {/* First Row */}
        <div className="first-row">
          <div className="name-input">
            <label>Name</label>
            {isEditable ? (
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
            )}
          </div>

          <div className="dept-input">
            <label>Department</label>
            {isEditable ? (
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
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="EIE">EIE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="CHEM">CHEMICAL</option>
                <option value="BME">BIO MED</option>
                <option value="MED">MED ELECTRONICS</option>
              </select>
            ) : (
              <input
                className="userdetails-input"
                type="text"
                disabled
                value={userDetails.dept}
              />
            )}
          </div>
        </div>

        {/* Second Row - Graduation Year & Email */}
        <div className="second-row">
          <div className="grad-year">
            <label>Graduation Year</label>
            {isEditable ? (
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
            )}
          </div>

          <div className="email-input">
            {isEditable ? (
              <label>Email (Not Editable)</label>
            ) : (
              <label>Email</label>
            )}
            <input
              className="userdetails-input"
              type="email"
              disabled
              style={isEditable ? { backgroundColor: "gray", cursor: "not-allowed" } : {}}
              value={userDetails.email}
            />
          </div>
        </div>
      </div>

      {isEditable && (
        <div className="userdetails-buttons">
          <button className="user-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="user-save" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
