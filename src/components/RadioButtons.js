import React from 'react';

const RadioButtons = ({ options, selectedValue, onChange }) => {
  return (
    <div className="radio-buttons">
      {options.map((option) => (
        <label key={option.id} htmlFor={option.id}>
          <input
            type="radio"
            value={option.value}
            name="userType"
            id={option.id}
            className="radio-button"
            checked={selectedValue === option.value}
            onChange={onChange}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButtons;
