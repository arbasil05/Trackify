import './CurrentSemester.css';

const CurrentSemester = ({ dark, sem_num, Loading }) => {
  const remaining = 8 - sem_num;

  return (
    !Loading ? (
      <div className={dark ? 'csem-container dark-mode' : 'csem-container'}>
        <h1 className='csem-title'>Current Semester</h1>
        <h1 className='csem-value'>{sem_num} / 8</h1>
        <p style={{ color: "#F59E0B", fontSize: "15px" }}>
          {remaining === 0
            ? "Completed"
            : remaining === 8
            ? "Bon Voyage!"
            : `${remaining} more to go!`}
        </p>
      </div>
    ) : (
      <div className={dark ? 'csem-container dark-mode' : 'csem-container'}>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='csem-title'>Current Semester</h1>
        </div>
        <div className={dark ? 'skeleton-dark' : 'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='csem-value'>{sem_num} / 8</h1>
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
