import React, { useEffect, useState } from 'react';
import './ProjectDashboard.css';
import Header from '../../components/Header/Header';
import { useParams, useNavigate } from 'react-router-dom';
import notFound_image from '../../assets/notFound.png';
import { useAuth } from '../../context/AuthContext';
import {
    fetchProjectById,
    fetchVolunteersForProject,
    fetchHospitalsForProject,
    fetchLostPeopleForProject,
    addVolunteerToProject,
    updateProjectStatus,
    addLostPerson,
    uploadLostImage,
    addLostToProject,
    updateLostPersonPhoto,
    addNotification,
    addNoticeToProject,
    getNoticesForProject,
    addConcernToProject
} from '../../firebase/firebase';
import Footer from '../../components/Footer/Footer';

const ProjectDashboard = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [notices, setNotices] = useState([]);
    const [showNoticeForm, setShowNoticeForm] = useState(false);
    const [showHelpForm, setShowHelpForm] = useState(false);
    const [newNotice, setNewNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [newConcern, setNewConcern] = useState("");
    const [concernFile, setConcernFile] = useState(null);
    const [missingPeople, setMissingPeople] = useState([]);
    const [showMissingPersonForm, setShowMissingPersonForm] = useState(false); // Control form visibility
    const [newMissingPerson, setNewMissingPerson] = useState({
        photo: '',
        name: '',
        description: '',
        contact: '',
        reward: ''
    });
    const { user, userType } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const projectData = await fetchProjectById(projectId);
            setProject(projectData);

            const volunteersData = await fetchVolunteersForProject(projectId);
            setVolunteers(volunteersData);

            if (projectData?.pincode){
                const hospitalsData = await fetchHospitalsForProject(projectData.pincode);
                setHospitals(hospitalsData);
            }

            // Fetch lost people specific to the project
            const lostPeopleData = await fetchLostPeopleForProject(projectId);
            setMissingPeople(lostPeopleData);

            const noticesData = await getNoticesForProject(projectId);
            setNotices(noticesData);
        };

        fetchData();
    }, [projectId]);

    const handleAddNotice = () => {
        setShowNoticeForm(!showNoticeForm); // Toggle form visibility
    };

    const handleNoticeChange = (e) => {
        setNewNotice(e.target.value);
    };

    const handleNoticeSubmit = async () => {
        if (newNotice.trim() === '') {
            alert('Notice message cannot be empty');
            return;
        }
    
        try {
            // Call the Firebase function to add or create a notice document for the project
            console.log("Notice adding");
            await addNoticeToProject(projectId, newNotice);
            console.log("Notice added");
            // Update the local state to reflect the added notice
            setNotices((prevNotices) => [newNotice, ...prevNotices]);
            setNewNotice(''); // Clear the textarea
            setShowNoticeForm(false); // Hide the form
        } catch (error) {
            console.error('Error adding notice:', error);
        }
    };
    

    const handleActAsVolunteer = async () => {
        await addVolunteerToProject(projectId, user.email);
        const updatedVolunteers = await fetchVolunteersForProject(projectId);
        setVolunteers(updatedVolunteers);

        // Add notification to the 'notifications' collection
        await addNotification({
            message: "A new user volunteered.",
            projectId: projectId,
            type: "Volunteer Added"
        });
    };

    const handleCompleteProject = async () => {
        await updateProjectStatus(projectId, 'Completed');
        setProject(prevProject => ({ ...prevProject, status: 'Completed' }));

        // Add notification to the 'notifications' collection
        await addNotification({
            message: "Project completed successfully.",
            projectId: projectId,
            type: "status update"
        });
    };

    const handleEmergency = () => {
        const recipient = "emergency@response.org"; // Replace with the desired email address
        const subject = `Extreme Emergency: Project ${project?.projectName}`;
        const body = `Dear Emergency Team,
    
        We have detected an extreme emergency situation in the project "${project?.projectName}" located at:
        ${project?.projectAdd1}, ${project?.projectAdd2}, ${project?.projectState}, ${project?.pincode}.
        
        Immediate assistance is required. Please prioritize this situation.
        
        Thank you,
        ${user?.email}`;
    
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink; // Opens the email app
    };
    

    const handleReportMissingPerson = () => {
        setShowMissingPersonForm(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMissingPerson(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    // Handle image file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewMissingPerson(prevState => ({
            ...prevState,
            photoFile: file,
        }));
    };
    
    const handleHelp = ()=>{
        setShowHelpForm(!showHelpForm);
    }

    const handleHelpChange = (e) => {
        setNewConcern(e.target.value);
    };
    
    const handleHelpFileChange = (e) => {
        setConcernFile(e.target.files[0]);
    };
    
    const handleConcernSubmit = async () => {
        setLoading(true);
        if (!newConcern.trim()) {
            alert("Concern cannot be empty");
            return;
        }
    
        try {
            const concernData = {
                concern: newConcern,
                imageFile: concernFile,
                timestamp: new Date(),
            };
            
            await addConcernToProject(projectId, concernData);
    
            // Reset form
            setNewConcern("");
            setConcernFile(null);
            setShowHelpForm(false);
            alert("Concern submitted successfully");
            setLoading(false);
        } catch (error) {
            console.error("Error submitting concern:", error);
            alert("Failed to submit concern");
        }
    };
    

    const handleAddMissingPerson = async () => {
        try {
            // Step 1: Add lost person data (without photo URL initially) to Firestore `losts` collection
            const lostId = await addLostPerson({
                name: newMissingPerson.name,
                description: newMissingPerson.description,
                contact: newMissingPerson.contact,
                reward: newMissingPerson.reward,
            });
    
            // Step 2: Upload photo to Firebase Storage and get URL
            const photoUrl = await uploadLostImage(newMissingPerson.photoFile, lostId);
    
            // Step 3: Update lost person data with photo URL
            await updateLostPersonPhoto(lostId, photoUrl); // Updated function call
    
            // Step 4: Add lost person ID to `project-losts` collection
            await addLostToProject(projectId, lostId);
    
            // Reset form and update UI
            setMissingPeople([{ ...newMissingPerson, photo: photoUrl }, ...missingPeople]);
            setNewMissingPerson({ photo: '', name: '', description: '', contact: '', reward: '' });
            setShowMissingPersonForm(false);

            // Add notification to the 'notifications' collection
            await addNotification({
                message: "A missing person reported.",
                projectId: projectId,
                type: "missing report"
            });
        } catch (error) {
            console.error("Error adding missing person:", error);
        }
    };
    
    if (!project) return <div>Loading...</div>;

    return (
        <div className="project-dashboard-container">
            <Header />
            <div className="notices-container">
                <div className="notices-marquee">
                    <div className="notices-content">
                        {notices.map((notice, index) => (
                            <span key={index} className="notice-item">Notice-{index+1}: {notice}</span>
                        ))}
                    </div>
                </div>
                <button className="see-all-button" onClick={()=>navigate(`/notices/${projectId}`)}>See All</button>
            </div>
            <div className="project-dashboard">
                
                <div className="dashboard-top-portion">
                    {userType==='Department' && project.status === 'Active' && (
                        <div className="important-buttons">
                            <button className="notice-button add-button" onClick={handleAddNotice}>Add a Notice</button>
                            {project.initiator === user.email  && !project.emergency && <button className="emergency-button" onClick={handleEmergency}>Extreme Emergency</button>}
                            {project.initiator === user.email && project.emergency && <button className="emergency-button disabled-button">ERT informed</button>}
                            {project.initiator === user.email && <button className="completed-button" onClick={handleCompleteProject}>Mark as Completed</button>}
                        </div>
                    )}
                    <img
                        src={project.imageUrl || notFound_image}
                        alt="Disaster"
                        className="dashboard-image"
                    />
                    <div className="dashboard-content">
                        <h2 className="project-name">{project.projectName}</h2>
                        <p className="project-description">{project.projectDescription}</p>
                        <div className="project-location">
                            <p>{project.projectAdd1}</p>
                            <p>{project.projectAdd2}</p>
                            <p>{project.projectState}, {project.pincode}</p>
                        </div>
                        <p className="affected-people">{project.affectedPeople} people affected</p>
                    </div>
                </div>

                {showNoticeForm && (
                        <div className="notice-form">
                            <textarea
                                placeholder="Enter your notice here..."
                                value={newNotice}
                                onChange={handleNoticeChange}
                                className="notice-textarea"
                            ></textarea>
                            <button className="add-button" onClick={handleNoticeSubmit}>Submit</button>
                        </div>
                )}

                {project.status !== 'Active' && <h2 className="notify-msg">*** THIS PROJECT IS COMPLETED ***</h2>}

                {loading && <p>Please wait...</p>}
                {project.status === "Active" && userType==="Volunteer" &&(
                <button className="add-button" onClick={handleHelp}>
                    Need Help?
                </button>
                )}

                {project.status === "Active" && userType==="Department" &&(
                <button className="add-button" onClick={()=>navigate(`/concerns/${projectId}`)}>
                    View concerns
                </button>
                )}

                {showHelpForm && (
                    <div className="notice-form">
                        <textarea
                            placeholder="Enter your concern here..."
                            value={newConcern}
                            onChange={handleHelpChange}
                            className="notice-textarea"
                        ></textarea>
                        <input type="file" onChange={handleHelpFileChange} />
                        {!loading && <button className="add-button" onClick={handleConcernSubmit}>Submit</button>}
                    </div>
                )}


                {/* Missing People Table */}
                <div className="table-card">
                    <h3>Missing People</h3>
                    {project.status === 'Active' && <button className="add-button" onClick={handleReportMissingPerson}>
                        Report a Missing Person
                    </button>}
                    <table className="table-structure">
                        <thead>
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Contact if Found</th>
                                <th>Rewards for help</th>
                            </tr>
                        </thead>
                        <tbody>
                        {showMissingPersonForm && (
                        <tr>
                            <td>
                                <input type="file" onChange={handleFileChange} />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={newMissingPerson.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="description"
                                    value={newMissingPerson.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="contact"
                                    value={newMissingPerson.contact}
                                    onChange={handleInputChange}
                                    placeholder="Contact"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="reward"
                                    value={newMissingPerson.reward}
                                    onChange={handleInputChange}
                                    placeholder="Reward"
                                />
                            </td>
                            <td>
                                <button onClick={handleAddMissingPerson}>Add</button>
                            </td>
                        </tr>
                        )}
                            {missingPeople.length > 0 ? (
                                missingPeople.map((person, index) => (
                                    <tr key={index}>
                                        <td><img src={person.photo} alt={person.name} className="missing-photo" /></td>
                                        <td>{person.name}</td>
                                        <td>{person.description}</td>
                                        <td>{person.contact}</td>
                                        <td>{person.reward}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No missing people information available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Volunteers Table */}
                <div className="table-card">
                    <h3>Nearby Volunteers</h3>
                    {
                        userType==='Volunteer' &&
                        project.status === 'Active' &&
                        <button className="add-button" onClick={handleActAsVolunteer}>
                            Act as Volunteer
                        </button>
                    }
                    <table className="table-structure">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Blood Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.length > 0 ? (
                                volunteers.map((volunteer, index) => (
                                    <tr key={index}>
                                        <td>{volunteer.name}</td>
                                        <td>{volunteer.mobile}</td>
                                        <td>{volunteer.bloodGroup}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No volunteers available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Hospitals Table */}
                <div className="table-card">
                    <h3>Available Hospitals</h3>
                    <table className="table-structure">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>No of Beds</th>
                                <th>Timings(HH:MM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.length > 0 ? (
                                hospitals.map((hospital, index) => (
                                    <tr key={index}>
                                        <td>{hospital.name}</td>
                                        <td>{hospital.addressLine1}<br />{hospital.addressLine2}<br />{hospital.state}, {hospital.pincode}</td>
                                        <td>{hospital.contactNumber}</td>
                                        <td>{hospital.numberOfBeds}</td>
                                        <td>{hospital.startTime}-{hospital.endTime}</td>
                                    </tr>
                                ))
                            ) : (
                                    <tr>
                                       <td colSpan="5">No hospitals available</td>
                                    </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProjectDashboard;