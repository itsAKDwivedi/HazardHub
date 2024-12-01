import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import BrandLogoTitleDark from '../BrandLogoTitle/BrandLogoTitleDark';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const { logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const latestNotifications = notifications.slice(0, 3); 

  const handleBellClick = () => {
    setShowTooltip(!showTooltip);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Ensure you await the logout if it returns a promise
      navigate('/login'); // Navigate to login only after successful logout
    } catch (error) {
      console.error('Logout failed:', error); // Log any errors for debugging
    }
  };

  return (
    <div className="navbar">
      <BrandLogoTitleDark />
      <div className="right-nav">
        <div className="notifications-wrapper">
          <button className="bell-button" onClick={handleBellClick}>
            <FontAwesomeIcon icon={faBell} />
          </button>
          {showTooltip && (
            <div className="notifications-tooltip">
              <ul>
                {latestNotifications.map((notification) => (
                  <li key={notification.id}>
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/notifications')}>Show All</button>
            </div>
          )}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
}

export default Header;
