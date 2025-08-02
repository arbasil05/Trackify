import './CGPA.css'

const CGPA = ({ dark }) => {
    return (
        <div className={dark ? 'cgpa-container dark-mode' : 'cgpa-container'}>
            <h1 className='cgpa-title'>Current CGPA</h1>
            <h1 className='cgpa-value'>9.2 / 10</h1>
            <p style={{ color: "#3B82F6", fontSize: "15px" }}>keep going!</p>
        </div>
    )
}

export default CGPA
