import './CGPA.css';
import { useTheme } from '../../context/ThemeContext';


const CGPA = ({ cgpa, Loading }) => {
  const { isDark: dark } = useTheme();
  const getMessage = (value) => {
    const num = parseFloat(value);
    if (num === 0) return "Fresh start!";
    if (!value || isNaN(num)) return "Start strong!";
    if (num >= 9.0) return "Touch grass";
    if (num >= 8.5) return "Excellent!";
    if (num >= 8.0) return "Great job!";
    if (num >= 7.5) return "Doing well!";
    if (num >= 7.0) return "Good work!";
    if (num >= 6.0) return "Keep going!";
    return "You got this!";
  };

  return (
    !Loading ? (
      <div className={dark ? 'cgpa-container dark-mode' : 'cgpa-container'}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <h1 className='cgpa-title'>Current CGPA</h1>
          <div className="info-tooltip-container">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 32 32" fill="#4880ff" className="info-icon">
              <path d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 Z M 15 10 L 15 12 L 17 12 L 17 10 Z M 15 14 L 15 22 L 17 22 L 17 14 Z"></path>
            </svg>
            <div className="tooltip-text">CGPA of Semester results uploaded so far</div>
          </div>
        </div>
        <h1 className='cgpa-value'>{cgpa}</h1>
        <p style={{ color: "#3B82F6", fontSize: "15px" }}>{getMessage(cgpa)}</p>
      </div>
    ) : (
      <div className={dark ? 'cgpa-container dark-mode' : 'cgpa-container'}>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='cgpa-title'>Current CGPA</h1>
        </div>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='cgpa-value'>{cgpa}</h1>
        </div>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <p style={{ visibility: "hidden", color: "#3B82F6", fontSize: "15px" }}>You Rock!</p>
        </div>
      </div>
    )
  );
};

export default CGPA;
