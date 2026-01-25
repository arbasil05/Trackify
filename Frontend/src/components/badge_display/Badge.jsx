import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTrophy, 
    faStarHalfStroke, 
    faGraduationCap, 
    faDumbbell, 
    faLayerGroup,
    faMedal,
    faAward,
    faStar
} from '@fortawesome/free-solid-svg-icons';
import './Badge.css'

const ICON_MAP = {
    "trophy": faTrophy,
    "star-half-stroke": faStarHalfStroke,
    "graduation-cap": faGraduationCap,
    "dumbbell": faDumbbell,
    "layer-group": faLayerGroup,
    "medal": faMedal, // Fallbacks
    "award": faAward,
    "star": faStar
};

const SVG_MAP = {
    "CREDIT_50": "/Badges/half century.svg",
    "CREDIT_100": "/Badges/century club.svg",
    "DEGREE_COMPLETE": "/Badges/mission accomplished.svg",
    "SEM_30_CREDITS": "/Badges/heavy lifter.svg",
    "CATEGORY_COMPLETE_HS": "/Badges/HS.svg",
    "CATEGORY_COMPLETE_BS": "/Badges/BS.svg",
    "CATEGORY_COMPLETE_ES": "/Badges/ES.svg",
    "CATEGORY_COMPLETE_PC": "/Badges/PC.svg",
    "CATEGORY_COMPLETE_PE": "/Badges/PE.svg",
    "CATEGORY_COMPLETE_OE": "/Badges/OE.svg",
    "CATEGORY_COMPLETE_EEC": "/Badges/EEC.svg",
    "CATEGORY_COMPLETE_MC": "/Badges/MC.svg",
};

const SCALE_MAP = {
    "CREDIT_50": 1.3,
    "CREDIT_100": 1.25,
    "DEGREE_COMPLETE": 2,
    "SEM_30_CREDITS": 2.2,
    "CATEGORY_COMPLETE_EEC":1.4,
    "CATEGORY_COMPLETE_MC":1.4,
};

const Badge = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [allDefinitions, setAllDefinitions] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchDefinitions = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_API}/api/user/achievements`,
                    { withCredentials: true }
                );
                setAllDefinitions(res.data.achievements || []);
            } catch (err) {
                console.error("Failed to fetch achievements", err);
            }
        };
        fetchDefinitions();
    }, []);

    const unlockedKeys = new Set((user?.achievements || []).map(a => a.key));
    // Showing all achievements for testing purposes
    // const userAchievements = allDefinitions; 
    const userAchievements = allDefinitions.filter(def => unlockedKeys.has(def.key));

    const INITIAL_VISIBLE_COUNT = 4;
    const displayedAchievements = isExpanded ? userAchievements : userAchievements.slice(0, INITIAL_VISIBLE_COUNT);

    if (userAchievements.length === 0) return null; // Or show empty state

    return (
        <div className={`userdetails-container ${isDark ? 'dark' : ''}`}>
             <div className='userdetails-header'>
                <h2>Achievements</h2>
            </div>
            <div className='badge-body'>
                {displayedAchievements.map((ach) => {
                    const svgPath = SVG_MAP[ach.key];
                    const scale = SCALE_MAP[ach.key] || 1.2;
                    
                    return (
                        <div 
                            key={ach.key} 
                            className="badge" 
                            title={ach.description || ach.title}
                            style={{ 
                                ...(svgPath ? { background: 'transparent', boxShadow: 'none' } : {})
                            }}
                        >
                            {svgPath ? (
                                <img 
                                    src={svgPath} 
                                    alt={ach.title} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'contain', 
                                        transform: `scale(${scale})` 
                                    }} 
                                />
                            ) : (
                                <FontAwesomeIcon icon={ICON_MAP[ach.icon] || faTrophy} />
                            )}
                            {/* <span className="badge-tooltip">{ach.title}</span> */}
                        </div>
                    );
                })}
            </div>
            
            {userAchievements.length > INITIAL_VISIBLE_COUNT && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            background: 'transparent',
                            border: `1px solid ${isDark ? '#fff' : '#000'}`,
                            color: isDark ? '#fff' : '#000',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}
                    >
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default Badge
