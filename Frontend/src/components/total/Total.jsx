import './Total.css'

const Total = ({dark}) => {
  return (
    <div className={dark?'total-container dark-mode-total':'total-container'}>
      <h1 className='total-title'>Total Credits Earned</h1>
      <h1 className='total-value'>92 / 150</h1>
      <div className="progress-container">
        <progress max={100} value={75}></progress>
        <p>75% completed</p>
      </div>

    </div>
  )
}

export default Total
