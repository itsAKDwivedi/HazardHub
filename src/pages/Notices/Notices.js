import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Notifications/Notifications.css';
import Header from '../../components/Header/Header';
import { getNoticesWithTime } from '../../firebase/firebase';
import notFound_image from '../../assets/notFound.png';
import Footer from '../../components/Footer/Footer';

function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const { projectId } = useParams();

  // Fetch notices from Firebase and set the state
  useEffect(() => {
    const fetchNotices = async () => {
      const fetchedNotices = await getNoticesWithTime(projectId);
      setNotices(fetchedNotices);  // Set the state with the fetched data
    };

    fetchNotices();  // Call the fetch function
  }, [projectId]);

  return (
    <div className="notifications-page">
      <Header />
      <div className="notifications-container">
        <h1>All Notices</h1>
        <ul>
            {notices.length>0 ? (
                notices.map((notice, index) => (
                <li key={index} className="notification-item" onClick={() => navigate(`/project-dashboard/${projectId}`)}>
                    <p>{notice.message}</p>
                    {notice.timestamp && (
                    <small>
                        {new Date(notice.timestamp.seconds * 1000).toLocaleString()} {/* Display formatted timestamp */}
                    </small>
                    )}
                </li>
                ))) : (
                <div className="not-found-container">
                    <p className="not-found-text">No notices on notice board.</p>
                    <img src={notFound_image} alt="Not Found" className="not-found-image" />
                </div>
            )}
        </ul>
      </div>
      <Footer/>
    </div>
  );
}

export default Notices;
