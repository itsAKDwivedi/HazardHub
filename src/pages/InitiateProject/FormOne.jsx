import React, { useContext } from 'react';
import AppContext from './Context';
import './InitiateProject.css';
import { useNavigate } from 'react-router-dom';

const FormOne = () => {
    const navigate = useNavigate();
    const myContext = useContext(AppContext);
    const updateContext = myContext.projectDetails;

    const next = () => {
        // if (updateContext.projectName == null) {
        //     console.log('Please enter Project Name')
        // } else if (updateContext.projectDescription == null) {
        //     console.log('Please enter a short description of project')
        // } else 
        (updateContext.setStep(updateContext.currentPage + 1))
    };

    return (
        <form className="projectForm">
            <input value={updateContext.projectName} className="projectFormInput" type="text" placeholder="Project Name" onChange={e => updateContext.setProjectName(e.target.value)} required/>
            <textArea className="projectFormInput" type="text" placeholder="Project Description" onChange={e => updateContext.setProjectDescription(e.target.value)} required>{updateContext.projectDescription}</textArea>
            <button type="submit" className="formSubmit" onClick={next} >Next</button>
            <button type='button' className='formSubmit gray' onClick={() => navigate('/active-projects')}>Cancel</button>
        </form>
    );
};

export default FormOne;