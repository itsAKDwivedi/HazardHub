import React, {useContext} from 'react';
import AppContext from './Context';
import './InitiateProject.css';
import success_icon from '../../assets/success.png';
import { useNavigate } from 'react-router-dom';

const FormFinish = () => {

    const myContext = useContext(AppContext);
    const updateContext = myContext.projectDetails;
    const navigate = useNavigate();

    const name = updateContext.projectName;

    return (
        <div className="finishContainer">
            <p>Successfully Submitted</p>
            <p>Project {name} initiated successfully.</p>
            <img className="done" src={success_icon} alt="successful" />
            <button className="doneSubmit" onClick={()=>navigate('/active-projects')}>Done</button>
        </div>
    );
};

export default FormFinish;