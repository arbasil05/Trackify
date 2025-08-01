import './BarChart.css';
import {
    BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BarChart = () => {
    const data = [
        { semester: 'Sem 1', credits: 22 },
        { semester: 'Sem 2', credits: 24 },
        { semester: 'Sem 3', credits: 21 },
        { semester: 'Sem 4', credits: 48 },
        { semester: 'Sem 5', credits: 26 },
        { semester: 'Sem 6', credits: 26 },
        { semester: 'Sem 7', credits: 26 },
    ];

    return (
        <div className='barchart-container'>
            <div className='barchart-wrapper'>
                <ResponsiveContainer width="100%" height={300}>
                    <ReBarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="semester" />
                        <YAxis />
                        <Tooltip />
                        {/* <Legend verticalAlign="bottom"  align="center" /> */}
                        <Bar dataKey="credits" fill="#3382cd" />
                    </ReBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChart;
