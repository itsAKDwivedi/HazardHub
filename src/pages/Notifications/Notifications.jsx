// src/pages/Notifications/Notifications.jsx
import React from 'react';
import { useNotifications } from '../../context/NotificationsContext';
import './Notifications.css';
import Header from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

function Notifications() {
  const navigate = useNavigate();
  const { notifications } = useNotifications();

  // Sort notifications by timestamp in descending order (latest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.timestamp.toDate() - a.timestamp.toDate()
  );

  return (
    <div className="notifications-page">
      <Header />
      <div className="notifications-container">
        <h1>All Notifications</h1>
        <ul>
          {sortedNotifications.map((notification) => (
            <li key={notification.id} className="notification-item" onClick={()=>navigate(`/project-dashboard/${notification.projectId}`)}>
              <p>{notification.message}</p>
              {notification.projectName && (
                <p><strong>Project:</strong> {notification.projectName}</p>
              )}
              {notification.timestamp && (
                <small>
                  {notification.timestamp.toDate().toLocaleString()}
                </small>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Footer/>
    </div>
  );
}

export default Notifications;
