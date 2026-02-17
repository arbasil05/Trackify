import { Link } from 'react-router-dom'
import './Footer.css'
import Lottie from 'lottie-react';
import bee2 from '../../assets/lottie/Bee.json';
import gitrid from '../../assets/lottie/gitrid.json';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`site-footer ${isDark ? 'site-footer-dark' : ''}`}>
      <div className="site-footer-top">
        <div className="site-footer-brand">
          <span className="site-footer-logo">Trac<span className="site-footer-logo-accent">kify</span></span>
          <p className="site-footer-quip">probably held together by duct tape and good intentions</p>
        </div>

        <div className="site-footer-col">
          <h4>Built by</h4>
          <a href="https://aaronh.dev" target="_blank" rel="noopener noreferrer">aaronh.dev</a>
          <a href="https://arbasil.me" target="_blank" rel="noopener noreferrer">arbasil.me</a>
          <a href="https://visalan.me" target="_blank" rel="noopener noreferrer">visalan.me</a>
        </div>

        <div className="site-footer-col">
          <h4>Designed by</h4>
          <a href="https://mohammedsurjun.framer.website/" target="_blank" rel="noopener noreferrer">Md Surjun</a>
          <a href="https://www.linkedin.com/in/renusrinaraharashetty/" target="_blank" rel="noopener noreferrer">Renusri Naraharashetty</a>
        </div>

        <div className="site-footer-col">
          <h4>Also try</h4>
          <div className="site-footer-project">
            <a href="https://quick-qb.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Lottie animationData={bee2} loop autoplay className="site-footer-lottie" />
            </a>
            <a href="https://quick-qb.vercel.app/" target="_blank" rel="noopener noreferrer">QuickQB</a>
          </div>
          <div className="site-footer-project">
            <a href="https://gitrid.vercel.app/" target="_blank" rel="noopener noreferrer" className={isDark ? 'gitrid-icon' : ''}>
              <Lottie animationData={gitrid} loop autoplay className="site-footer-lottie" />
            </a>
            <a href="https://gitrid.vercel.app/" target="_blank" rel="noopener noreferrer">GitRid</a>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>Something broken? <Link to="/feedback">Blame us here</Link></p>
      </div>
    </footer>
  )
}

export default Footer
