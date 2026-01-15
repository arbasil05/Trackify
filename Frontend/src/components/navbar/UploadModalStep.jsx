import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UploadModalStep = ({ semValue, setSemValue, existingSemesters, pdf, setPdf, onSubmit, onClose }) => (
  <div className="upload-form-wrapper">
    <h2>Upload Semester Results</h2>
    <p>Drop your semester results and we’ll do the math</p>
    <p style={{ textAlign: 'center', color: '#4880FF' }}>
      <FontAwesomeIcon icon={faInfoCircle} /> Online courses and Open Electives will not be extracted
    </p>
    <form className="upload-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Semester</label>
        <select
          value={semValue}
          onChange={e => setSemValue(e.target.value)}
          required
        >
          <option value="">Select your semester here</option>
          {[...Array(8)].map((_, i) => {
            const sem = `sem${i + 1}`;
            if (!existingSemesters.includes(sem)) {
              return (
                <option key={sem} value={sem}>
                  Semester {i + 1}
                </option>
              );
            }
            return null;
          })}
        </select>
      </div>
      <div className="form-group">
        <input
          type="file"
          accept=".pdf"
          id="upload-pdf"
          className="upload-input"
          onChange={e => setPdf(e.target.files[0])}
          required
        />
        <label
          htmlFor="upload-pdf"
          className={`upload-label ${pdf ? 'has-pdf' : ''}`}
        >
          {pdf ? `PDF Selected: ${pdf.name}` : 'Upload PDF'}
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn submit">
          Submit
        </button>
        <button
          type="button"
          className="btn cancel"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </form>
  </div>
);

export default UploadModalStep;
