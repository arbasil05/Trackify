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
            <th>Non-CGPA</th>
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
              <td>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={course.isNonCgpa || false}
                    onChange={e => onCourseChange(i, "isNonCgpa", e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <div className="info-tooltip-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 32 32" fill="#4880ff" className="info-icon">
                      <path d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 Z M 15 10 L 15 12 L 17 12 L 17 10 Z M 15 14 L 15 22 L 17 22 L 17 14 Z"></path>
                    </svg>
                    <div className="tooltip-text">Excluded from CGPA calculation</div>
                  </div>
                </div>
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
            <div className="form-field full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <input
                type="checkbox"
                id={`mobile-non-cgpa-${i}`}
                checked={course.isNonCgpa || false}
                onChange={e => onCourseChange(i, "isNonCgpa", e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor={`mobile-non-cgpa-${i}`} style={{ marginBottom: 0 }}>Non CGPA Course</label>
              <div className="info-tooltip-container" style={{ display: 'inline-flex', alignItems: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 32 32" fill="#4880ff" className="info-icon">
                  <path d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 Z M 15 10 L 15 12 L 17 12 L 17 10 Z M 15 14 L 15 22 L 17 22 L 17 14 Z"></path>
                </svg>
                <div className="tooltip-text">Excluded from CGPA calculation</div>
              </div>
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
