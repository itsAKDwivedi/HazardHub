import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Concerns/Concerns.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getConcernsForProject, updateConcernStatus } from '../../firebase/firebase';
import notFoundImage from '../../assets/notFound.png';

function Concerns() {
  const { projectId } = useParams();
  const [concerns, setConcerns] = useState([]);

  // Fetch concerns for the given projectId
  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const fetchedConcerns = await getConcernsForProject(projectId);
        setConcerns(fetchedConcerns);
      } catch (error) {
        console.error('Error fetching concerns:', error);
      }
    };

    fetchConcerns();
  }, [projectId]);

  // Handle "Mark as Completed" button click
  const handleMarkAsCompleted = async (concernId) => {
    try {
        console.log(concerns);
      await updateConcernStatus(concernId, 'Completed');
      // Update the UI to reflect the change
      setConcerns((prevConcerns) =>
        prevConcerns.map((concern) =>
          concern.id === concernId ? { ...concern, status: 'Completed' } : concern
        )
      );
    } catch (error) {
      console.error('Error marking concern as completed:', error);
    }
  };

  return (
    <div className="concerns-page">
      <Header />
      <div className="concerns-container">
        <h1>Concerns for Project</h1>
        {concerns.length > 0 ? (
          concerns.map((concern, index) => (
            <div key={index} className="concern-card">
              <div className="concern-image">
                <img
                  src={concern.imageUrl || notFoundImage}
                  alt="Concern"
                  onError={(e) => (e.target.src = notFoundImage)}
                />
              </div>
              <div className="concern-details">
                <p className="concern-description">{concern.description}</p>
                <small className="concern-timestamp">{new Date(concern.timestamp * 1000).toLocaleString()}</small>
                <p className="concern-status">
                  <strong>Status:</strong> {concern.status}
                </p>
                {concern.status !== 'Completed' && (
                  <button
                    className="mark-completed-button"
                    onClick={() => handleMarkAsCompleted(concern.id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="not-found-container">
            <p className="not-found-text">No concerns found for this project.</p>
            <img src={notFoundImage} alt="Not Found" className="not-found-image" />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Concerns;
