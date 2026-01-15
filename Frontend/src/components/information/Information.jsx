
import CGPA from '../cgpa/CGPA';
import CurrentSemester from '../current_semester/CurrentSemester';
import Total from '../total/Total';
import TowardsGrad from '../towardsGrad/TowardsGrad';
import './Information.css';

const CREDIT_MAP = {
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

const Information = ({ user, totalCredits, userSemCredits, cgpa, Loading }) => {
  const gradYear = Number(user?.grad_year);
  const dept = user?.dept;
  let denominator = 0;
  
  if (CREDIT_MAP[dept]) {
    denominator = gradYear === 2027 ? CREDIT_MAP[dept][2027] : CREDIT_MAP[dept].default;
  }

  const gradPercent = denominator ? Math.round((totalCredits / denominator) * 100) : 0;

  return (
    <div className='information-container'>
      <Total total_num={totalCredits} total_denom={denominator} Loading={Loading} />
      <CGPA cgpa={cgpa || 0} Loading={Loading} />
      <CurrentSemester
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
      <TowardsGrad percent={gradPercent} Loading={Loading} />
    </div>
  );
};

export default Information;
