import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CardConnect</h3>
          <p>Access exclusive bank card discounts without owning the card. Connect, Save, Earn!</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="Instagram">📷</a>
            <a href="#" aria-label="LinkedIn">💼</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><a href="#about">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>For Users</h4>
          <ul>
            <li><Link to="/browse-products">Browse Products</Link></li>
            <li><Link to="/browse-cards">Browse Cards</Link></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Platforms</h4>
          <div className="platform-badges">
            <span className="badge">Amazon</span>
            <span className="badge">Flipkart</span>
            <span className="badge">Myntra</span>
          </div>
          <div className="payment-methods">
            <h5>Secure Payments</h5>
            <span className="payment-badge">💳 Razorpay</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} CardConnect. All rights reserved.</p>
          <p>Made with ❤️ for smart shoppers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
