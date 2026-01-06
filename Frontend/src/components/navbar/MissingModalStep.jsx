import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MissingModalStep = ({ dark, missingCourses, onContinue, onLater }) => (
  <div className="missing-courses-wrapper">
    <FontAwesomeIcon className="font-warning" size="2x" icon={faWarning} />
    <h2 className="important-header">Missing Courses</h2>
    <div className="important-caption">
      <p>These aren’t in our database yet.</p>
    </div>
    <div className="missing-courses-table-wrapper">
      <table className="missing-courses-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Course Code</th>
          </tr>
        </thead>
        <tbody>
          {missingCourses.map((c, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{c.name || '—'}</td>
              <td>{c.code || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="form-actions">
      <button className="btn proceed" onClick={onContinue}>
        Continue
      </button>
      <button className="btn" onClick={onLater}>
        Later
      </button>
    </div>
  </div>
);

export default MissingModalStep;
