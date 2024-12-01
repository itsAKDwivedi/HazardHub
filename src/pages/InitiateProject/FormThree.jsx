import React, { useContext, useState, useEffect } from 'react';
import AppContext from './Context';
import './InitiateProject.css';

const FormThree = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.projectDetails;

    const [imagePreview, setImagePreview] = useState(updateContext.imagePreview); // Initialize with context value

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            updateContext.setImageFile(file); // Update context with the file
            updateContext.setImagePreview(previewUrl); // Update context with the preview URL
        }
    };

    // Retain image preview across renders using useEffect
    useEffect(() => {
        // No logic needed here if imagePreview is already managed correctly,
        // but if needed, you could sync it with context or handle side-effects
    }, [updateContext]); // Include `updateContext` as a dependency

    // Handle estimated number of affected people input
    const handleAffectedPeopleChange = (e) => {
        updateContext.setAffectedPeople(e.target.value);
    };

    const next = () => {
        if (updateContext.affectedPeople && updateContext.imageFile) {
            updateContext.setStep(updateContext.currentPage + 1);
        } else {
            alert('Please provide the required details before proceeding.');
        }
    };

    const prev = () => {
        updateContext.setStep(updateContext.currentPage - 1);
    };

    return (
        <div className="form-container">
            <h2>Project Details</h2>

            {/* Estimated Number of Affected People Input */}
            <label className="projectLabel">Estimated Number of Affected People:
                <input
                    type="number"
                    placeholder="Enter number"
                    className='projectFormInput'
                    value={updateContext.affectedPeople}
                    onChange={handleAffectedPeopleChange}
                    required
                />
            </label>

            {/* Image Upload Input */}
            <div className="form-item">
                <label className="projectLabel">Upload Image of Affected Area:</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
            </div>

            {/* Image preview section */}
            {imagePreview && (
                <div className="image-preview">
                    <h4>Image Preview:</h4>
                    <img src={imagePreview} alt="Preview" className="image-preview-box" />
                </div>
            )}

            <button className="formSubmit" onClick={next}>Next</button>
            <button type="button" className="formSubmit gray" onClick={prev}>Previous</button>
        </div>
    );
};

export default FormThree;
