import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaClock, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="footer-heading">College Canteen</h3>
            <p className="footer-text">
              Fresh, delicious meals prepared daily for our college community. 
              Pre-order your lunch and skip the queue!
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Today's Menu</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section hours">
            <h3 className="footer-heading">Operating Hours</h3>
            <ul className="footer-links">
              <li><FaClock /> Monday - Friday: 8:00 AM - 4:00 PM</li>
              <li><FaClock /> Saturday: 9:00 AM - 2:00 PM</li>
              <li><FaClock /> Sunday: Closed</li>
              <li style={{marginTop: '10px', color: '#ff6b35'}}>
                <strong>Order Deadline: 11:30 AM daily</strong>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3 className="footer-heading">Contact Info</h3>
            <ul className="footer-links">
              <li><FaMapMarkerAlt /> College Campus, Building A</li>
              <li><FaPhone /> (555) 123-4567</li>
              <li>canteen@college.edu</li>
            </ul>
            <p className="footer-text" style={{marginTop: '15px'}}>
              Questions about your order? Contact us during operating hours.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} College Canteen. All Rights Reserved.
          </p>
          <div className="payment-methods">
            <span>Cash</span>
            <span>Card</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;