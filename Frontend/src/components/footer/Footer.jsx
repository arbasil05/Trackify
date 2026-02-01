import { Link } from 'react-router-dom'
import './Footer.css'
import Lottie from 'lottie-react';
import bee2 from '../../assets/lottie/Bee.json';
import gitrid from '../../assets/lottie/gitrid.json';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();
  return (
    <div className='footer-container'>
      <p>Have an issue ? <Link to="/feedback"><span className='contact-us'>Contact Us</span></Link></p>
      <div className='footer-bee'>
        
        <div className="icon-wrapper">
          <div className="bee-tooltip">
            Also try <a href="https://quick-qb.vercel.app/" target="_blank" rel="noopener noreferrer">QuickQB</a>
          </div>
          <a href="https://quick-qb.vercel.app/" target="_blank" rel="noopener noreferrer">
            <Lottie animationData={bee2} loop autoplay />
          </a>
        </div>

        <div className="icon-wrapper">
          <div className="bee-tooltip">
            Also try <a href="https://gitrid.vercel.app/" target="_blank" rel="noopener noreferrer">GitRid</a> 
          </div>
          <a href="https://gitrid.vercel.app/" target="_blank" rel="noopener noreferrer" className={isDark ? 'gitrid-icon' : ''}>
            <Lottie animationData={gitrid} loop autoplay />
          </a>
        </div>

      </div>
    </div>
  )
}

export default Footer
