import { useEffect, useState } from 'react';
import './BarChart.css';
import '@lottiefiles/lottie-player';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const Barchart = ({ dark, userSemCredits, Loading }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [data, setData] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!userSemCredits) return;

    // Sort the semesters based on the number in "semX"
    const sortedBarData = Object.entries(userSemCredits)
      .filter(([_, value]) => value > 0)
      .sort(([a], [b]) => {
        const numA = parseInt(a.replace('sem', ''), 10);
        const numB = parseInt(b.replace('sem', ''), 10);
        return numA - numB;
      })
      .map(([key, value]) => ({
        name: key.replace('sem', 'Sem '),
        credits: value,
      }));

    setData(sortedBarData);
  }, [userSemCredits]);

  return (
    !Loading ? (
      data.length === 0 ? (
        <div className={dark ? 'barchart-container dark-mode' : 'barchart-container'}>
          <p className="no-data-message">
            <lottie-player
              src="/empty ghost.json"
              background="transparent"
              speed="1"
              style={{ width: '300px', height: '300px', marginLeft: 'auto', marginRight: 'auto' }}
              loop
              autoplay
            >
            </lottie-player>
            Please upload result to view semester wise credits
          </p>
        </div>
      ) : (
        <div className={dark ? 'barchart-container dark-mode' : 'barchart-container'}>
          <h3>Semester wise credits</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 400 : 300}>
            <BarChart 
              data={data} 
              layout={isMobile ? "vertical" : "horizontal"}
              margin={{ top: 10, right: 20, left: isMobile ? 0 : -4, bottom: isMobile ? 20 : 0 }}
            >
              <CartesianGrid
                vertical={!isMobile}
                horizontal={isMobile}
                strokeDasharray="3 3"
                stroke={dark ? '#44566e' : '#ccc'}
              />
              {/* XAxis: Category on Desktop, Number on Mobile */}
              <XAxis 
                type={isMobile ? "number" : "category"} 
                dataKey={isMobile ? undefined : "name"} 
                stroke={dark ? '#fff' : '#000'}
              />
              {/* YAxis: Number on Desktop, Category on Mobile */}
              <YAxis 
                type={isMobile ? "category" : "number"} 
                dataKey={isMobile ? "name" : undefined} 
                stroke={dark ? '#fff' : '#000'} 
                width={isMobile ? 60 : 30}
              />
              <Tooltip
                cursor={{fill: 'transparent'}}
                contentStyle={{
                  backgroundColor: dark ? '#38485f' : '#fff',
                  border: 'none',
                  color: dark ? '#fff' : '#000',
                }}
              />
              <Bar 
                dataKey="credits" 
                fill="#4880FF" 
                barSize={isMobile ? 20 : 25} 
                radius={isMobile ? [0, 10, 10, 0] : [10, 10, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    ) : (
      <div className={dark ? 'barchart-container dark-mode skeleton-dark' : 'barchart-container skeleton-light'}>
        <h3 style={{ visibility: "hidden" }}>Semester wise credits</h3>
        <ResponsiveContainer style={{ visibility: "hidden" }} width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke={dark ? '#44566e' : '#ccc'}
            />
            <XAxis dataKey="name" stroke={dark ? '#fff' : '#000'} />
            <YAxis stroke={dark ? '#fff' : '#000'} />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? '#38485f' : '#fff',
                border: 'none',
                color: dark ? '#fff' : '#000',
              }}
            />
            <Bar dataKey="credits" fill="#4880FF" barSize={25} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  );
};

export default Barchart;
