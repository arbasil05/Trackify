import './CurrentSemester.css';
import { useTheme } from '../../context/ThemeContext';

const CurrentSemester = ({ sem_num, Loading }) => {
  const { isDark: dark } = useTheme();
  const remaining = 8 - sem_num;

  return (
    !Loading ? (
      <div className={dark ? 'current-semester-container dark-mode' : 'current-semester-container'}>
        <h1 className='current-semester-title'>Semesters Completed</h1>
        <h1 className='current-semester-value'>{sem_num} <span>/ 8</span></h1>
        <p style={{ color: "#F59E0B", fontSize: "15px" }}>
          {remaining === 0
            ? "Completed"
            : remaining === 8
            ? "Bon Voyage!"
            : `${remaining} more to go!`}
        </p>
      </div>
    ) : (
      <div className={dark ? 'current-semester-container dark-mode' : 'current-semester-container'}>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='current-semester-title'>Current Semester</h1>
        </div>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='current-semester-value'>{sem_num} / 8</h1>
        </div>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <p style={{ visibility: "hidden", color: "#F59E0B", fontSize: "15px" }}>
            {remaining === 0
              ? "Completed"
              : remaining === 8
              ? "Bon Voyage!"
              : `${remaining} more to go!`}
          </p>
        </div>
      </div>
    )
  );
};

export default CurrentSemester;
