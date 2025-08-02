import './CurrentSemester.css';

const CurrentSemester = ({ dark }) => {
    return (
        <div className={dark ? 'csem-container dark-mode' : 'csem-container'}>
            <h1 className='csem-title'>Current Semester</h1>
            <h1 className='csem-value'>6 / 8</h1>
            <p style={{ color: "#F59E0B ", fontSize: "15px" }}>2 more to go!</p>

        </div>
    );
};

export default CurrentSemester;
