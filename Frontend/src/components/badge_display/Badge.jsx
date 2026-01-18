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

const Badge = () => {
    const { isDark } = useTheme();
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [allDefinitions, setAllDefinitions] = useState([]);

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
    const userAchievements = allDefinitions.filter(def => unlockedKeys.has(def.key));

    if (userAchievements.length === 0) return null; // Or show empty state

    return (
        <div className={`userdetails-container ${isDark ? 'dark' : ''}`}>
             <div className='userdetails-header'>
                <h2>Achievements</h2>
            </div>
            <div className='badge-body'>
                {userAchievements.map((ach) => (
                    <div 
                        key={ach.key} 
                        className="badge" 
                        title={ach.description || ach.title}
                        style={{ '--shine-delay': `${Math.random() * 5}s` }}
                    >
                        <FontAwesomeIcon icon={ICON_MAP[ach.icon] || faTrophy} />
                        {/* <span className="badge-tooltip">{ach.title}</span> */}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Badge
