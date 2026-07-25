import './FeedbackHeader.css'
import { useTheme } from '../../context/ThemeContext'

const FeedbackHeader = () => {
    const { isDark: dark } = useTheme();

    return (
        <div className={`feedbackheader-container ${dark ? 'dark' : ''}`}>
            <div className="feedbackheader-left">
                <h1>App <span>Feedback</span></h1>
                <p>We'd love to hear your thoughts on Trackify. Let us know how we can improve your experience.</p>
            </div>
        </div>
    )
}

export default FeedbackHeader
