import './CGPA.css';

const CGPA = ({ dark, cgpa, Loading }) => {
  return (
    !Loading ? (
      <div className={dark ? 'cgpa-container dark-mode' : 'cgpa-container'}>
        <h1 className='cgpa-title'>Current CGPA</h1>
        <h1 className='cgpa-value'>{cgpa}</h1>
        <p style={{ color: "#3B82F6", fontSize: "15px" }}>You Rock!</p>
      </div>
    ) : (
      <div className={dark ? 'cgpa-container dark-mode' : 'cgpa-container'}>
        <div className={dark?'skeleton-dark':'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='cgpa-title'>Current CGPA</h1>
        </div>
        <div className={dark?'skeleton-dark':'skeleton-light'}>
          <h1 style={{ visibility: "hidden" }} className='cgpa-value'>{cgpa}</h1>
        </div>
        <div className={dark?'skeleton-dark':'skeleton-light'}>
          <p style={{ visibility: "hidden", color: "#3B82F6", fontSize: "15px" }}>You Rock!</p>
        </div>
      </div>
    )
  );
};

export default CGPA;
