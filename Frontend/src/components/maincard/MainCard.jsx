import { useEffect, useState } from 'react'
import axios from "axios"
import './MainCard.css'
const MainCard = () => {
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [dept, setDept] = useState("");

    const [totalCredits,setTotalCredits] = useState("");
    useEffect(() => {
        const url1 = "http://localhost:5001/api/userDetails";
        axios.get(url1, { withCredentials: true })
            .then((res) => {
                console.log(res.data.user);
                setName(res.data.user.name);
                setYear(res.data.user.grad_year);
                setDept(res.data.user.dept);
            })
            .catch((error) => {
                console.log(error);

            })
        
            const url2 = "http://localhost:5001/api/coruseByUser";
            axios.get(url2,{withCredentials:true})
                 .then((res)=>{
                    setTotalCredits(res.data.totalCredits);
                 })
                 .catch((error)=>{
                    console.log(error);
                    
                 })


    }, []);
    return (
        <div className='mainCard'>
            <h1>{dept} | {Number(year) - 4} - {year} | {name}</h1>
            <div className="outline">
                <div className='header-text'>
                    <h2 className='card-title'>Overall Progress</h2>
                    <h1 className='card-progress'><span>{totalCredits}</span> / {dept==='CSE'?164:dept==='AIDS'?166:dept==='AIML'?170:dept==='IT'?164:0}</h1>
                    <progress className='card-bar' value={totalCredits} max={164}></progress>
                </div>
                <div className="card-stats">
                    <div className="individual-stats">
                        <h2>{164 - totalCredits}</h2>
                        <p>Credits Remaining</p>
                    </div>
                    <div className="individual-stats">
                        <h2>{((totalCredits/164)*100).toFixed(2)}%</h2>
                        <p>Completion Rate</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainCard
