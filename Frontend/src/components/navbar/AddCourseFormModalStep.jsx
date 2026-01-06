const AddCourseFormModalStep = ({ dark, addCourses, setAddCourses, onSave, onCancel }) => (
  <div className="add-course-wrapper">
    <h2 className="important-header">Add Missing Courses</h2>
    <div className="important-caption">
      <p>Fill the details to add these courses.</p>
    </div>
    <div className="add-course-table-wrapper">
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
                  onChange={e => {
                    const updated = [...addCourses];
                    updated[i].credits = e.target.value;
                    setAddCourses(updated);
                  }}
                />
              </td>
              <td>
                <input
                  type="number"
                  step="0.1"
                  value={course.gradePoint}
                  onChange={e => {
                    const updated = [...addCourses];
                    updated[i].gradePoint = e.target.value;
                    setAddCourses(updated);
                  }}
                />
              </td>
              <td>
                <input value={course.sem} disabled />
              </td>
              <td>
                <select
                  value={course.category}
                  onChange={e => {
                    const updated = [...addCourses];
                    updated[i].category = e.target.value;
                    setAddCourses(updated);
                  }}
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
