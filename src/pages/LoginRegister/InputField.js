import React from 'react';

const InputField = ({ type, placeholder, icon, onChange }) => (
    <div className="input">
        <img src={icon} alt="" className='input-image'/>
        <input 
            type={type} 
            placeholder={placeholder} 
            onChange={onChange} // Capture input changes
        />
    </div>
);

export default InputField;
