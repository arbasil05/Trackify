import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './UserDetails.css'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const UserDetails = ({ isDark }) => {
  const [isEditable, setIsEditable] = useState(false);
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
              isEditable
                ?
                <input className="userdetails-input" type="text" value={"Basil"} />
                :
                <input className="userdetails-input" type="text" disabled value={"Basil"} />

            }

          </div>
          <div className="dept-input">
            <label>Department</label>
            {
              isEditable
                ?
                <select className="userdetails-input">
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="AIDS">AIDS</option>
                  <option value="AIML">AIML</option>
                  <option value="CYBER">CSE (CYBERSECURITY)</option>
                  <option value="IOT">CSE (IOT)</option>
                </select>
                :
                <select className="userdetails-input" disabled>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="AIDS">AIDS</option>
                  <option value="AIML">AIML</option>
                  <option value="CYBER">CSE (CYBERSECURITY)</option>
                  <option value="IOT">CSE (IOT)</option>
                </select>

            }

          </div>
        </div>
        <div className="second-row">
          <div className="reg-no">
            <label>Register Number</label>
            <input className="userdetails-input" type="text" disabled value="212223040002" />
          </div>
          <div className="grad-year">
            <label>Graduation Year</label>
            {
              isEditable
                ?
                <select value="2027" className="userdetails-input">
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>
                :
                <select value="2027" className="userdetails-input" disabled>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                </select>

            }

          </div>
        </div>
      </div>
      {
        isEditable &&
        <div className="userdetails-buttons">
          <button className="user-cancel" onClick={() => setIsEditable(false)}>Cancel</button>
          <button className="user-save">Save Changes</button>
        </div>

      }

    </div>
  )
}

export default UserDetails
