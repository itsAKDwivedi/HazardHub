import React, { useContext } from 'react';
import AppContext from './Context';
import './ProgressBar.css';  // Import the CSS file

const ProgressBar = () => {
    const myContext = useContext(AppContext);
    const updateContext = myContext.projectDetails;

    const percent = updateContext.currentPage * 100/4;
    const percentage = updateContext.currentPage;

    return (
        <div>
            <p className="progress-text">{percentage} of 4 completed</p>
            <div className="progress-background">
                <div className="progress-bar" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

export default ProgressBar;