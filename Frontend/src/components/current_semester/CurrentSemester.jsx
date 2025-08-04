import './CurrentSemester.css';

const CurrentSemester = ({ dark,sem_num,sem_denom }) => {
    const remaining = 8 - sem_num;
    return (
        <div className={dark ? 'csem-container dark-mode' : 'csem-container'}>
            <h1 className='csem-title'>Current Semester</h1>
            <h1 className='csem-value'>{sem_num} / 8</h1>
            <p style={{ color: "#F59E0B ", fontSize: "15px" }}>{remaining==0?"Completed":remaining===8?"Bon Voyage!":`${remaining} more to go!`} </p>

        </div>
    );
};

export default CurrentSemester;
