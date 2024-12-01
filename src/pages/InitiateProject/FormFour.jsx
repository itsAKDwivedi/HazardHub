// client/src/pages/InitiateProject/FormFour.jsx
import React, { useContext, useState } from 'react';
import AppContext from './Context';
import './InitiateProject.css';
import { useAuth } from '../../context/AuthContext';
import { uploadProjectDetails, uploadProjectImage, addNotification } from '../../firebase/firebase';

const FormFour = () => {
    const myContext = useContext(AppContext);
    const { projectDetails } = myContext;
    const { 
        projectName, 
        projectDescription, 
        affectedPeople, 
        projectAdd1, 
        projectAdd2, 
        pincode, 
        projectState, 
        imageFile, 
        setStep, 
        currentPage 
    } = projectDetails;

    const { user } = useAuth();
    const initiator = user.email;
    const [loading, setLoading] = useState(false); // Loading state for "Please wait"

    // Handle form submission and project insertion to Firestore with image
    const handleSubmit = async () => {
        setLoading(true);
        const projectId = Date.now().toString(); // Unique project ID based on timestamp
        try {
            // Step 1: Upload Image (if provided)
            let imageUrl = "";
            if (imageFile) {
                console.log("Uploading image...");
                imageUrl = await uploadProjectImage(imageFile, projectId); // Upload image and get URL
                console.log("Image uploaded:", imageUrl);
            }

            // Step 2: Upload Project Details (including image URL)
            const projectData = {
                projectName,
                projectDescription,
                projectAdd1,
                projectAdd2,
                pincode,
                projectState,
                affectedPeople,
                initiator,
                imageUrl,
                status: "Active",
                emergency: false
            };

            console.log("Uploading project details...");
            await uploadProjectDetails(projectData, projectId);
            console.log("Project successfully submitted.");

            await addNotification({
                message: "A new calamity added.",
                projectId: projectId,
                type: "calamity added"
            });

            setStep(currentPage + 1); // Move to the next step
        } catch (err) {
            console.error("Error submitting project:", err);
        } finally {
            setLoading(false);
        }
    };

    const prev = () => {
        setStep(currentPage - 1);
    };

    return (
        <div className="reviewContainer">
            <h2>Review Your Project Details</h2>
            <div className="form-container">
                {/* Display all form details */}
                <div className="form-item">
                    <label className='projectLabel'>Project Name:</label>
                    <span className="project-detail">{projectName}</span>
                </div>
                <div className="form-item">
                    <label className='projectLabel'>Project Description:</label>
                    <span className="project-detail">{projectDescription}</span>
                </div>
                <div className="form-item">
                    <label className='projectLabel'>Address Line 1:</label>
                    <span className="project-detail">{projectAdd1}</span>
                </div>
                <div className="form-item">
                    <label className='projectLabel'>Address Line 2:</label>
                    <span className="project-detail">{projectAdd2}</span>
                </div>
                <div className="form-item">
                    <label className='projectLabel'>State:</label>
                    <span className="project-detail">{projectState}</span>
                </div>
                <div className="form-item">
                    <label className='projectLabel'>Pincode:</label>
                    <span className="project-detail">{pincode}</span>
                </div>
                <div className="form-item">
                    <label className='projectLabel'>Estimated no. of affected people:</label>
                    <span className="project-detail">{affectedPeople}</span>
                </div>

                {/* Image Preview */}
                {imageFile && (
                    <div className="image-preview">
                        <h4>Uploaded Image:</h4>
                        <img 
                            src={URL.createObjectURL(imageFile)} 
                            alt="Preview" 
                            className="image-preview-box" 
                            style={{ width: '300px', height: 'auto' }} 
                        />
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && <p>Please wait...</p>}

                {/* Submit and Previous Buttons */}
                {!loading && (
                    <>
                        <button className="formSubmit" onClick={handleSubmit}>Submit</button>
                        <button type="button" className="formSubmit gray" onClick={prev}>Previous</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FormFour;
