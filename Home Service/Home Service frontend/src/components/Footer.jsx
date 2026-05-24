// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Column 1: Brand Info */}
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            HomeService<span className="dot">.</span>
          </Link>
          <p>
            Your trusted partner for all home service needs. We connect you with
            verified, expert professionals to make your life easier and your
            home better.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/services">All Services</Link>
            </li>
            <li>
              <Link to="/book">Book an Appointment</Link>
            </li>
            <li>
              <Link to="/provider-signup">Join as a Professional</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <span>📍</span> Muzaffarnagar, Uttar Pradesh, India
            </li>
            <li>
              <span>📞</span> +91 9520588535
            </li>
            <li>
              <span>✉️</span> support@homeserve.com
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} HomeService. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
