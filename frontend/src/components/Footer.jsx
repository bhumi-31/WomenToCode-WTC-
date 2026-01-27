import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' }
  ]

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'in', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: '◎', url: 'https://instagram.com' },
    { name: 'YouTube', icon: '▶', url: 'https://youtube.com' }
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">W</span>
              <span className="logo-text">WomenToCode</span>
            </Link>
            <p className="footer-description">
              Empowering women in tech through community, education, and opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-heading">Quick Links</h4>
            <ul>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="footer-connect">
            <h4 className="footer-heading">Connect</h4>
            <div className="contact-info">
              <p>hello@womentocode.com</p>
              <p>+91 98765 43210</p>
            </div>
            
            <h4 className="footer-heading social-heading">Social</h4>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="copyright">
            © {currentYear} WomenToCode. All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <span className="divider">|</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
