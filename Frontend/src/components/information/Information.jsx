import { useEffect, useState } from 'react';
import CGPA from '../cgpa/CGPA';
import CurrentSemester from '../current_semester/CurrentSemester';
import Total from '../total/Total';
import TowardsGrad from '../towardsGrad/TowardsGrad';
import './Information.css';

const Information = ({ dark, user, totalCredits, userSemCredits, cgpa, Loading }) => {
  const [denom, setDenom] = useState(0);
  const [gradPercent, setGradPercent] = useState(0);
  // console.log(user);


  useEffect(() => {
    if (!user || !user.grad_year || !user.dept) return;

    const gradYear = Number(user.grad_year);
    const dept = user.dept;

    const creditMap = {
      "AIDS": { 2027: 164, default: 169 },
      "AIML": { 2027: 168, default: 168 },
      "CSE": { 2027: 164, default: 167 },
      "CYBER": { 2027: 169, default: 171 },
      "IOT": { 2027: 170, default: 171 },
      "IT": { 2027: 164, default: 167 },
      "ECE": { 2027: 169, default: 164 },
      "EEE": { 2027: 167, default: 165 },
      "MECH": { 2027: 169, default: 168 },
      "CIVIL": { 2027: 167, default: 165 },
      "BME": { 2027: 169, default: 168 },
      "MED": { 2027: 169, default: 169 },
      "EIE": { 2027: 165, default: 165 },
      "CHEM": { 2027: 166, default: 163 },
    };

    let denominator = 0;
    if (creditMap[dept]) {
      denominator = gradYear === 2027 ? creditMap[dept][2027] : creditMap[dept].default;
    }

    setDenom(denominator);
    setGradPercent(Math.round((totalCredits / denominator) * 100));
  }, [user, totalCredits]);

  return (
    <div className='information-container'>
      <Total dark={dark} total_num={totalCredits} total_denom={denom} Loading={Loading} />
      <CGPA dark={dark} cgpa={cgpa || 0} Loading={Loading} />
      <CurrentSemester
        dark={dark}
        sem_num={
          userSemCredits
            ? Math.max(
              0,
              ...Object.entries(userSemCredits)
                .filter(([_, credits]) => credits > 0)
                .map(([sem]) => Number(sem.replace("sem", "")))
            )
            : 0
        }
        Loading={Loading}
      />
      <TowardsGrad dark={dark} percent={gradPercent} Loading={Loading} />
    </div>
  );
};

export default Information;
