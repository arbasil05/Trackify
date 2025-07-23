import { useEffect, useState } from 'react';
import './Category.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

const Category = () => {
    const [credits, setCredits] = useState({});

    useEffect(() => {
        const url = "http://localhost:5001/api/coruseByUser";
        axios.get(url, { withCredentials: true })
            .then((res) => {
                setCredits(res.data.runningTotal); 
            })
            .catch((error) => {
                console.log("Error fetching category credits:", error);
            });
    }, []);


    const categoryConfig = [
        { key: 'HS', label: 'Humanities and Science', required: 11 },
        { key: 'BS', label: 'Basic Science', required: 23 },
        { key: 'ES', label: 'Engineering Science', required: 25 },
        { key: 'PC', label: 'Professional Core', required: 58 },
        { key: 'PE', label: 'Professional Elective', required: 16 },
        { key: 'OE', label: 'Open Elective', required: 12},
        { key: 'EEC', label: 'Employment Enhancement Courses', required: 16 },
        { key: 'MC', label: 'Mandatory Courses', required: 3 }
    ];


    const progressStyles = buildStyles({
        pathColor: '#c522fc',
        trailColor: '#8d8d8d73',
        textColor: '#333',
        textSize: '20px'
    });

    return (
        <div className='category-container'>
            <h1>Category Wise</h1>
            <div className="card-container">
                {categoryConfig.map((cat, index) => {
                    const earned = credits[cat.key] || 0;
                    const required = cat.required;
                    const percentage = ((earned / required) * 100).toFixed(1);

                    return (
                        <div key={index} className="individual-cards">
                            <h1 className="individual-card-title">{cat.label}</h1>
                            <div className='progressbar-container'>
                                <CircularProgressbar 
                                    value={percentage}
                                    text={`${percentage}%`}
                                    styles={progressStyles}
                                />
                            </div>
                            <h2><span>{earned}</span> / {required}</h2>
                            <button className='card-button'>Explore</button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Category;
