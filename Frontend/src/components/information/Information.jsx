import { useEffect, useState } from 'react';
import CGPA from '../cgpa/CGPA';
import CurrentSemester from '../current_semester/CurrentSemester';
import Total from '../total/Total';
import TowardsGrad from '../towardsGrad/TowardsGrad';
import './Information.css';

const Information = ({ dark, user, totalCredits, userSemCredits }) => {
  const [denom, setDenom] = useState(0);
  const [gradPercent, setGradPercent] = useState(0);

  useEffect(() => {
    if (!user || !user.grad_year || !user.dept) return;

    const gradYear = Number(user.grad_year);
    const dept = user.dept;

    let denominator = 0;
    if (gradYear === 2027 && dept === "AIDS") denominator = 164;
    else if (gradYear > 2027 && dept === "AIDS") denominator = 169;
    else if (gradYear === 2027 && dept === "AIML") denominator = 168;
    else if (gradYear > 2027 && dept === "AIML") denominator = 168;
    else if (gradYear === 2027 && dept === "CSE") denominator = 164;
    else if (gradYear > 2027 && dept === "CSE") denominator = 167;
    else if (gradYear === 2027 && dept === "CYBER") denominator = 169;
    else if (gradYear > 2027 && dept === "CYBER") denominator = 171;
    else if (gradYear === 2027 && dept === "IOT") denominator = 170;
    else if (gradYear > 2027 && dept === "IOT") denominator = 171;
    else if (gradYear === 2027 && dept === "IT") denominator = 164;
    else if (gradYear > 2027 && dept === "IT") denominator = 167;

    setDenom(denominator);
    setGradPercent(Math.round((totalCredits / denominator) * 100));
  }, [user, totalCredits]);

  return (
    <div className='information-container'>
      <Total dark={dark} total_num={totalCredits} total_denom={denom} />
      <CGPA dark={dark} cgpa={user.cgpa || 0} />
      <CurrentSemester dark={dark} sem_num={Object.keys(userSemCredits).length || 0} />
      <TowardsGrad dark={dark} percent={gradPercent} />
    </div>
  );
};

export default Information;
