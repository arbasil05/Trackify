import { useEffect, useState, useMemo } from 'react';
import './BarChart.css';
import Lottie from 'lottie-react';
import emptyGhostAnimation from '../../assets/lottie/empty-ghost.json';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const Barchart = ({ userSemCredits, Loading }) => {
  const { isDark: dark } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const data = useMemo(() => {
    if (!userSemCredits) return [];

    return Object.entries(userSemCredits)
      .filter(([_, value]) => value > 0)
      .sort(([a], [b]) => {
        const numA = parseInt(a.replace('sem', ''), 10);
        const numB = parseInt(b.replace('sem', ''), 10);
        return numA - numB;
      })
      .map(([key, value]) => ({
        name: isMobile ? key.replace('sem', 'S') : key.replace('sem', 'Sem '),
        credits: value,
      }));
  }, [userSemCredits, isMobile]);

  // Premium colors
  const accentColor = '#4880FF';
  const gridColor = dark ? '#334155' : '#e2e8f0';
  const textColor = dark ? '#94a3b8' : '#64748b';
  const tooltipBg = dark ? '#1e293b' : '#ffffff';
  const tooltipText = dark ? '#f8fafc' : '#0f172a';

  return (
    !Loading ? (
      data.length === 0 ? (
        <div className={`barchart-container ${dark ? 'dark-mode' : ''}`}>
          <div className="no-data-message">
            <Lottie
              animationData={emptyGhostAnimation}
              loop
              autoplay
              style={{ width: '220px', height: '220px', margin: '0 auto' }}
            />
            <p>Upload a result to view your semester progress</p>
          </div>
        </div>
      ) : (
        <div className={`barchart-container ${dark ? 'dark-mode' : ''}`}>
          <div className="chart-header">
            <h3>Semester Progress</h3>
            <span className="chart-subtitle">Credits earned over time</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={data} 
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 4"
                  stroke={gridColor}
                />
                <XAxis 
                  dataKey="name" 
                  stroke={textColor}
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dy={15}
                />
                <YAxis 
                  domain={['dataMin - 2', 'auto']}
                  stroke={textColor} 
                  tick={{ fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: gridColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${gridColor}`,
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: tooltipText,
                    padding: '12px 16px',
                  }}
                  itemStyle={{ color: accentColor, fontWeight: 700, fontSize: '15px' }}
                  labelStyle={{ color: textColor, marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="credits" 
                  stroke={accentColor} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCredits)" 
                  activeDot={{ r: 6, strokeWidth: 2, stroke: tooltipBg, fill: accentColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    ) : (
      <div className={`barchart-container skeleton-light ${dark ? 'dark-mode skeleton-dark' : ''}`}>
        <div className="chart-header" style={{ visibility: "hidden" }}>
          <h3>Semester Progress</h3>
          <span className="chart-subtitle">Credits earned over time</span>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer style={{ visibility: "hidden" }} width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="name" />
              <YAxis />
              <Area type="monotone" dataKey="credits" fill="#4880FF" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  );
};

export default Barchart;
