// client/src/pages/InitiateProject/InitiateProject.jsx
import React, { useState } from 'react';
import './InitiateProject.css';
import AppContext from './Context';
import FormOne from './FormOne';
import FormTwo from './FormTwo';
import FormThree from './FormThree';
import FormFour from './FormFour';
import FormFinish from './FormFinish';
import ProgressBar from './ProgressBar';
import Header from '../../components/Header/Header';

const InitiateProject = () => {
    const [step, setStep] = useState(0);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [affectedPeople, setAffectedPeople] = useState('');
    const [projectAdd1, setProjectAdd1] = useState('');
    const [projectAdd2, setProjectAdd2] = useState('');
    const [pincode, setPincode] = useState('');
    const [projectState, setProjectState] = useState('');
    const [imageFile, setImageFile] = useState(null); // Store the image file
    const [imagePreview, setImagePreview] = useState(null); // Store the image preview URL

    const projectDetails = {
        currentPage: step,
        projectName,
        projectDescription,
        projectAdd1,
        projectAdd2,
        pincode,
        projectState,
        affectedPeople,
        imageFile,
        imagePreview,
        setProjectName,
        setProjectDescription,
        setStep,
        setProjectAdd1,
        setProjectAdd2,
        setPincode,
        setProjectState,
        setAffectedPeople,
        setImageFile,
        setImagePreview
    };

    return (
        <AppContext.Provider value={{ projectDetails }}>
            <div className="project-screen">
                <Header />
                <div className="projectFormBody">
                    <div className="projectBanner"></div>
                    <div className="projectFormWrapper">
                        <h1 className='projectFormTitle'>Enter Project Details</h1>
                        <ProgressBar />
                        {step === 0 && <FormOne />}
                        {step === 1 && <FormTwo />}
                        {step === 2 && <FormThree />}
                        {step === 3 && <FormFour />}
                        {step === 4 && <FormFinish />}
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default InitiateProject;
