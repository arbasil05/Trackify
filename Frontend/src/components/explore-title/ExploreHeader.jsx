import './ExploreHeader.css'
import { useTheme } from '../../context/ThemeContext'

const ExploreHeader = () => {
    const { isDark: dark } = useTheme();

    return (
        <div className={`exploreheader-container ${dark ? 'dark' : ''}`}>
            <div className="exploreheader-left">
                <h1>Explore <span>Courses</span></h1>
                <p>Browse through courses that you haven't taken yet. Pick the ones that align with your degree requirements.</p>
            </div>
            <div className="exploreheader-right">
                {/* Reserved for future action buttons */}
            </div>
        </div>
    )
}

export default ExploreHeader
