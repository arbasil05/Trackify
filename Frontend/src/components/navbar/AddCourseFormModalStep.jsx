const AddCourseFormModalStep = ({ addCourses, onCourseChange, onSave, onCancel }) => (
  <div className="add-course-wrapper">
    <h2 className="important-header">Add Missing Courses</h2>
    <div className="important-caption">
      <p>Fill the details to add these courses.</p>
      <p>You can always edit these details.</p>
    </div>

    {/* Desktop Table View */}
    <div className="add-course-table-wrapper desktop-only">
      <table className="add-course-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Code</th>
            <th>Credits</th>
            <th>Grade Point</th>
            <th>Semester</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {addCourses.map((course, i) => (
            <tr key={i}>
              <td>
                <input value={course.course_name} disabled />
              </td>
              <td>
                <input value={course.code} disabled />
              </td>
              <td>
                <input
                  type="number"
                  value={course.credits}
                  onChange={e => onCourseChange(i, "credits", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.1"
                  value={course.gradePoint}
                  onChange={e => onCourseChange(i, "gradePoint", e.target.value)}
                />
              </td>
              <td>
                <input value={course.sem} disabled />
              </td>
              <td>
                <select
                  value={course.category}
                  onChange={e => onCourseChange(i, "category", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="HS">HS</option>
                  <option value="BS">BS</option>
                  <option value="ES">ES</option>
                  <option value="PC">PC</option>
                  <option value="PE">PE</option>
                  <option value="OE">OE</option>
                  <option value="EEC">EEC</option>
                  <option value="MC">MC</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile/Tablet Card View */}
    <div className="add-course-cards mobile-only">
      {addCourses.map((course, i) => (
        <div className="course-card" key={i}>
          <div className="course-card-header">
            <span className="course-card-number">Course {i + 1}</span>
          </div>
          
          <div className="course-card-info">
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{course.course_name || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Code:</span>
              <span className="info-value">{course.code || '—'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Semester:</span>
              <span className="info-value">{course.sem}</span>
            </div>
          </div>

          <div className="course-card-form">
            <div className="form-row">
              <div className="form-field">
                <label>Credits</label>
                <input
                  type="number"
                  placeholder="0-5"
                  value={course.credits}
                  onChange={e => onCourseChange(i, "credits", e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Grade Point</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="1-10"
                  value={course.gradePoint}
                  onChange={e => onCourseChange(i, "gradePoint", e.target.value)}
                />
              </div>
            </div>
            <div className="form-field full-width">
              <label>Category</label>
              <select
                value={course.category}
                onChange={e => onCourseChange(i, "category", e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="HS">HS</option>
                <option value="BS">BS</option>
                <option value="ES">ES</option>
                <option value="PC">PC</option>
                <option value="PE">PE</option>
                <option value="OE">OE</option>
                <option value="EEC">EEC</option>
                <option value="MC">MC</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="form-actions">
      <button className="btn proceed" onClick={onSave}>
        Save Courses
      </button>
      <button className="btn cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  </div>
);

export default AddCourseFormModalStep;
