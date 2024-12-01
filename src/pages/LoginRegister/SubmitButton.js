import React from 'react';

const SubmitButton = ({ action, setAction, handleEvent, loading }) => (
        <div className="submit-container">
        {/* Main Submit Button (Login or Register based on current action) */}
        <div className="submit" onClick={handleEvent}>  {/* Bind onClick to the main action button */}
            {loading ? 'Please wait...' : action}
        </div>

        {/* Toggle between Login and Register */}
        <div className='submit gray' onClick={() => { action === "Register" ? setAction("Login") : setAction("Register") }}>
            {action === 'Register' ? 'Login' : 'Register'}
        </div>
    </div>
);

export default SubmitButton;
