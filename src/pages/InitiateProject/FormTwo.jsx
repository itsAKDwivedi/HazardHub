import React, {useContext} from 'react';
import AppContext from './Context';
import './InitiateProject.css'
import statesAndUTs from './states';

const FormTwo = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.projectDetails;

    const next = () => {
        // if (updateContext.projectAdd1 == null) {
        //     console.log('Please enter address correctly')
        // } else if (updateContext.projectState == null) {
        //     console.log('Please select state')
        // } else 
        (updateContext.setStep(updateContext.currentPage + 1))
    };
    
    const prev = () => {
        (updateContext.setStep(updateContext.currentPage - 1))
    }

    return (
        <form className="projectForm">
            <input value={updateContext.projectAdd1} className="projectFormInput" type="text" placeholder="Address Line 1" onChange={e => updateContext.setProjectAdd1(e.target.value)} required/>
            <input value={updateContext.projectAdd2} className="projectFormInput" type="text" placeholder="Address Line 2" onChange={e => updateContext.setProjectAdd2(e.target.value)}/>
            <select value={updateContext.projectState} className="projectFormSelect" id="stateSelect" onChange={e => updateContext.setProjectState(e.target.value)}>
                <option value="">-- Select a State or Union Territory --</option>
                {statesAndUTs.map((state, index) => (
                    <option key={index} value={state}>
                        {state}
                    </option>
                ))}
            </select>
            <input value={updateContext.pincode} className="projectFormInput" type="number" minLength={6} maxLength={6} placeholder="Pincode" onChange={e => updateContext.setPincode(e.target.value)}/>
            <button className="formSubmit" value="Next" type="submit" onClick={next}>Next </button>
            <button type="submit" className='formSubmit gray' onClick={prev}>Previous</button>
        </form>
    );
};

export default FormTwo;