import './TowardsGrad.css'

const TowardsGrad = ({ dark, percent }) => {
  let message = "";

  if (percent >= 85) message = "You're nearly done!";
  else if (percent >= 70) message = "Almost there!";
  else if (percent >= 50) message = "Keep up the pace!";
  else if (percent >= 30) message = "You're making progress!";
  else message = "Off to a good start!";

  return (
    <div className={dark ? 'tgrad-container dark-mode' : 'tgrad-container'}>
      <h1 className='tgrad-title'>Towards Graduation</h1>
      <h1 className='tgrad-value'>{percent}%</h1>
      <p style={{ color: "#4CAF50", fontSize: "15px" }}>{message}</p>
    </div>
  );
};

export default TowardsGrad;
