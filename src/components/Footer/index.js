import {VscGithubAlt} from 'react-icons/vsc'
import {FiInstagram} from 'react-icons/fi'
import {FaTwitter} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <h1 className="footer-logo">
      COVID19<span className="footer-logo-highlight">INDIA</span>
    </h1>
    <p className="footer-tagline">
      we stand with everyone fighting on the front lines
    </p>
    <div className="social-icons-container">
      <VscGithubAlt className="social-icon" />
      <FiInstagram className="social-icon" />
      <FaTwitter className="social-icon" />
    </div>
  </footer>
)

export default Footer
