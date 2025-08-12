import { Link } from 'react-router-dom'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer-container'>
      <p>Have an issue ? <Link to="/feedback"><span className='contact-us'>Contact Us</span></Link></p>
    </div>
  )
}

export default Footer
