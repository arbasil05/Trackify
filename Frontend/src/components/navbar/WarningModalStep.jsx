import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WarningModalStep = ({ dark, onClose, onProceed, onCheckbox }) => (
  <div className="important-info">
    <div>
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
          onChange={onCheckbox}
        />
        <label htmlFor="skip-warning">Do not show this warning again</label>
      </div>
      <div className="proceed-buttons">
        <button className="btn cancel" onClick={onClose}>
          Close
        </button>
        <button
          className="btn proceed"
          onClick={onProceed}
        >
          Proceed
        </button>
      </div>
    </div>
    <div className="video">
      <video autoPlay loop muted playsInline>
        <source src="/warning2.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
);

export default WarningModalStep;
