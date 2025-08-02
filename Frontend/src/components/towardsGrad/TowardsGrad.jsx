import './TowardsGrad.css'

const TowardsGrad = ({ dark }) => {
    return (
        <div className={dark ? 'tgrad-container dark-mode' : 'tgrad-container'}>
            <h1 className='tgrad-title'>Towards Graduation</h1>
            <h1 className='tgrad-value'>69%</h1>
            <p style={{color:"#4CAF50",fontSize:"15px"}}>Almost there!</p>
        </div>
    )
}

export default TowardsGrad
