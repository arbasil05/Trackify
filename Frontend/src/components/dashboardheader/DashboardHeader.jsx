import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../context/ThemeContext'
import './DashboardHeader.css'

const DashboardHeader = ({ onUpload, onSearchAdd, onAddCourse }) => {
  const { isDark } = useTheme()
  return (
    <div className='dashboardheader-container'>
      <div className='dashboardheader-content'>
        <h1>Overview</h1>
        <p>Track your academic progress, credits, and course categories in one place.</p>
      </div>
      
      <div className="dashboardheader-actions">
        <button className="dashboard-action-btn search-btn" onClick={onSearchAdd} title="Search & Add Course">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <span>Search & Add</span>
        </button>
        <button className="dashboard-action-btn add-btn" onClick={onAddCourse} title="Add Course Manually">
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Course</span>
        </button>
        <button className='dashboard-upload-btn' onClick={onUpload}>
            <FontAwesomeIcon icon={faUpload} className="upload-icon" />
            <span>Upload PDF</span>
        </button>
      </div>
    </div>
  )
}

export default DashboardHeader
