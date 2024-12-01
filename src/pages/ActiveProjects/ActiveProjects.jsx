import React, { useEffect, useState } from 'react';
import './ActiveProjects.css';
import Header from '../../components/Header/Header';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { getProjects } from '../../firebase/firebase'; 
import notFound_image from '../../assets/notFound.png';
import Footer from '../../components/Footer/Footer';

const ActiveProjects = () => {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pincodeSearch, setPincodeSearch] = useState('');
    const [selectedSearchType, setSelectedSearchType] = useState('pincode');
    const [isSearchDisabled, setIsSearchDisabled] = useState(false);    
    const { userType } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await getProjects();
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePincodeSearch = (e) => {
        setPincodeSearch(e.target.value);
    };

    const handleSearchTypeChange = (e) => {
        const value = e.target.value;
        setSelectedSearchType(value);

        if (value === 'allActive' || value === 'allCompleted') {
            setIsSearchDisabled(true);
            setSearchTerm('');
            setPincodeSearch('');
        } else {
            setIsSearchDisabled(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        if (!project) return false;
        if (selectedSearchType === 'pincode') {
            return project.pincode?.includes(pincodeSearch) || false;
        } else if (selectedSearchType === 'projectName') {
            return project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        } else if (selectedSearchType === 'state') {
            return project.projectState?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        } else if (selectedSearchType === 'allActive') {
            return project.status === 'Active';
        } else if (selectedSearchType === 'allCompleted') {
            return project.status === 'Completed';
        }
        return true;
    });

    const handleProjectClick = (projectId) => {
        navigate(`/project-dashboard/${projectId}`); // Navigate to the project dashboard with the project ID
    };

    return (
        <div className="active-project-container">
            <Header />
            <div className="active-projects">
                <div className="search-section">
                    <select className="dropdown" value={selectedSearchType} onChange={handleSearchTypeChange}>
                        <option value="pincode">Search by Pincode</option>
                        <option value="projectName">Search by Project Name</option>
                        <option value="state">Search by State</option>
                        <option value="allActive">View All Active Projects</option>
                        <option value="allCompleted">View All Completed Projects</option>
                    </select>
                    <input 
                        type="text" 
                        placeholder={
                            selectedSearchType === 'pincode' 
                            ? 'Enter Pincode' 
                            : selectedSearchType === 'projectName' 
                            ? 'Enter Project Name'
                            : selectedSearchType === 'state' 
                            ? 'Enter State' 
                            : ''
                        } 
                        value={selectedSearchType === 'pincode' ? pincodeSearch : searchTerm} 
                        onChange={selectedSearchType === 'pincode' ? handlePincodeSearch : handleSearch} 
                        className="search-box"
                        disabled={isSearchDisabled}
                    />
                    {   userType === 'Department' && (
                        <button className="initiate-project-btn" onClick={() => navigate('/initiate-project')}>
                            Initiate Project
                        </button>
                    )}
                </div>

                <div className="projects-grid">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map(project => (
                            <div 
                                key={project.id} 
                                className="project-card" 
                                onClick={() => handleProjectClick(project.id)} // Call handleProjectClick on card click
                            >
                                <img src={project.imageUrl} alt="Disaster" className="project-image" />
                                <h3 className="project-title">{project.projectName}</h3>
                                <p className="project-detail">State/UT: {project.projectState}</p>
                                <p className="project-detail">Pincode: {project.pincode}</p>
                                <p className="project-detail">{project.affectedPeople} people affected</p>
                                <p className="project-detail">Status: {project.status}</p>
                            </div>
                        ))
                    ) : (
                        <div className="not-found-container">
                            <p className="not-found-text">No projects found matching your search criteria.</p>
                            <img src={notFound_image} alt="Not Found" className="not-found-image" />
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default ActiveProjects;
