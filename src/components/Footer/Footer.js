import React from 'react';
import './Footer.css';
import logo_image from "../../assets/logo.png";

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-brand">
            <img src={logo_image} alt="logo" />
            <h2>HazardHub</h2>
        </div>
        <div>
        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a> | 
          <a href="/terms-of-service">Terms of Service</a>
        </div>
        <p>&copy; {currentYear} HazardHub. All rights reserved.</p> {/* Display dynamic year */}
        </div>      
      </footer>
    </div>
  );
}

export default Footer;
