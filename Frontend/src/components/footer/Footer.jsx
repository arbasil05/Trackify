import { Link } from 'react-router-dom'
import './Footer.css'
import Lottie from 'lottie-react';
import bee from '../../assets/lottie/Bee2.json';
import bee2 from '../../assets/lottie/Bee.json';

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>Have an issue ? <Link to="/feedback"><span className='contact-us'>Contact Us</span></Link></p>
      <div className='footer-bee'>
        <div className="bee-tooltip">
          Also try <a href="https://quick-qb.vercel.app/" target="_blank" rel="noopener noreferrer">QuickQB</a>
        </div>
        <a href="https://quick-qb.vercel.app/" target="_blank" rel="noopener noreferrer">
          <Lottie animationData={bee2} loop autoplay />
        </a>
      </div>
    </div>
  )
}

export default Footer
