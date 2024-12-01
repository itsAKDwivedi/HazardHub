import React, { useState } from "react";
import homeBanner from "../../assets/homeBanner.png"; // Assuming the image is saved here
import './HomePage.css'; // External CSS for styling
import BrandLogoTitleLight from "../../components/BrandLogoTitle/BrandLogoTitleLight";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="homepage-container">
      <header className="homeNavbar">
        <BrandLogoTitleLight />

        {/* Menu Toggle Button */}
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>

        <nav className={`nav-items ${sidebarOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="https://hazardhub.netlify.app/login">Login</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </nav>

        <button className="getStart-button" onClick={()=>navigate('/hospital')}>Register Your Hospital</button>
      </header>

      <div className="content">
        <div className="left-section">
          <h1 className="landingTitle">Disaster Management</h1>
          <h2>What we do?</h2>
          <p>
          This platform aims to enhance coordination among departments, NGOs, hospitals, and volunteers during critical emergencies, ensuring a rapid and effective response to urgent situations.
          </p>
          <button className="get-started-btn" onClick={() => navigate('/login')}>Get Started</button>
          <div className="social-media-icons">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-facebook-f"></i>
          </div>
        </div>

        <div className="right-section">
          <img src={homeBanner} alt="Banner" className="home-banner" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
