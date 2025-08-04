import { useEffect, useState } from 'react';
import CGPA from '../cgpa/CGPA';
import CurrentSemester from '../current_semester/CurrentSemester';
import Total from '../total/Total';
import TowardsGrad from '../towardsGrad/TowardsGrad';
import './Information.css';
import axios from 'axios';

const Information = ({ dark }) => {
  const [total_num, setTotalNum] = useState(0);
  const [total_denom, setTotalDenom] = useState(0);
  const [cgpa, setCGPA] = useState(0);
  const [sem_num, setSemNum] = useState(0);
  const [grad_percent, setGradPercent] = useState(0);

  useEffect(() => {
    const url = "http://localhost:5001/api/courseByUser";

    axios.get(url, { withCredentials: true })
      .then((res) => {
        const { grad_year, dept } = res.data.user;
        const totalCredits = Number(res.data.totalCredits);
        // const cgpa = res.data.user.cgpa || 0; 
        const currentSem = Object.keys(res.data.user_sem_credits).length || 0;


        setTotalNum(totalCredits);
        // setCGPA(cgpa);
        setSemNum(currentSem);

        const gradYear = Number(grad_year);
        let denom = 0;

        if (gradYear === 2027 && dept === "AIDS") denom = 164;
        else if (gradYear > 2027 && dept === "AIDS") denom = 169;
        else if (gradYear === 2027 && dept === "AIML") denom = 168;
        else if (gradYear > 2027 && dept === "AIML") denom = 168;
        else if (gradYear === 2027 && dept === "CSE") denom = 164;
        else if (gradYear > 2027 && dept === "CSE") denom = 167;
        else if (gradYear === 2027 && dept === "CYBER") denom = 169;
        else if (gradYear > 2027 && dept === "CYBER") denom = 171;
        else if (gradYear === 2027 && dept === "IOT") denom = 170;
        else if (gradYear > 2027 && dept === "IOT") denom = 171;
        else if (gradYear === 2027 && dept === "IT") denom = 164;
        else if (gradYear > 2027 && dept === "IT") denom = 167;

        setTotalDenom(denom);
        setGradPercent(Math.round((totalCredits / denom) * 100));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='information-container'>
      <Total dark={dark} total_num={total_num} total_denom={total_denom} />
      <CGPA dark={dark} cgpa={cgpa} />
      <CurrentSemester dark={dark} sem_num={sem_num} />
      <TowardsGrad dark={dark} percent={grad_percent} />
    </div>
  );
};

export default Information;
