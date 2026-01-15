import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../context/ThemeContext'
import './DashboardHeader.css'

const DashboardHeader = ({ onUpload }) => {
  const { isDark } = useTheme()
  return (
    <div className='dashboardheader-container'>
      <h2 className={`dashboardheader-title ${isDark ? 'dark' : ''}`}>Dashboard</h2>
      <button className={`dashboard-upload-btn ${isDark ? 'dark' : ''}`} onClick={onUpload}>
          <FontAwesomeIcon icon={faUpload} />
          <span>Upload PDF</span>
      </button>
    </div>
  )
}

export default DashboardHeader
