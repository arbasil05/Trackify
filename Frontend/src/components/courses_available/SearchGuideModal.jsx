import { faTimes, faMousePointer, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SearchGuideModal.css';

const SearchGuideModal = ({ onClose }) => {
  return (
    <div className="modal-overlay guide-modal-overlay">
      <div className="custom-modal guide-modal">
        <div className="guide-modal-header">
          <h2>How to Search & Add Courses</h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="guide-content">
          <p className="guide-description">
            Watch the quick animation below to see how easy it is to find and add courses to your profile!
          </p>
          
          <div className="guide-animation-container">
            {/* The animated mouse cursor */}
            <div className="guide-cursor">
              <FontAwesomeIcon icon={faMousePointer} />
            </div>

            {/* Fake UI: Search Bar */}
            <div className="guide-search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <div className="guide-typing-text"></div>
            </div>

            {/* Fake UI: Course Grid */}
            <div className="guide-grid">
              <div className="guide-card target-card explore-app-card">
                <div className="card-top">
                  <span className="course-code">CS302</span>
                  <span className="course-credits">3 Cr</span>
                </div>
                <h3 className="course-title">Machine Learning</h3>
              </div>
              <div className="guide-card explore-app-card">
                <div className="card-top">
                  <span className="course-code">CS303</span>
                  <span className="course-credits">4 Cr</span>
                </div>
                <h3 className="course-title">Deep Learning</h3>
              </div>
            </div>
            
            {/* Fake UI: Add Course Modal (appears later in animation) */}
            <div className="guide-add-modal custom-modal narrow-modal add-course-modal">
                <div className="add-course-modal-header">
                    <h2>Add Course</h2>
                    <button className="close-btn"><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                
                <div className="selected-course-card">
                    <div className="selected-course-info">
                        <h3>Machine Learning</h3>
                        <div className="course-card-tags">
                            <span className="course-tag category-tag">Professional Elective</span>
                            <span className="course-tag credit-tag">3 Cr</span>
                        </div>
                    </div>

                    <div className="selected-course-fields">
                        <div className="field-group">
                            <label>Semester</label>
                            <div className="fake-select guide-sem-select">Select</div>
                        </div>
                        <div className="field-group">
                            <label>Grade</label>
                            <div className="fake-select guide-grade-select">Select</div>
                        </div>
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: '16px' }}>
                    <button className="btn proceed guide-add-btn" style={{ width: '100%' }}>Add to Profile</button>
                </div>
            </div>
            
            {/* Fake UI: Success Toast */}
            <div className="guide-toast">🏆 Course Added!</div>
          </div>
          
          <div className="guide-steps">
            <ul>
              <li><b>1.</b> Search for a course by name or code</li>
              <li><b>2.</b> Click on the course card you want to add</li>
              <li><b>3.</b> Select the semester and grade, then click Add</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchGuideModal;
