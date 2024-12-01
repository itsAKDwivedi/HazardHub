import React, { useState } from 'react';
import './Hospital.css';
import DarkBrandTitle from '../../components/BrandTitles/DarkBrandTitle';
import { useNavigate } from "react-router-dom";
import { addHospital } from '../../firebase/firebase';

const Hospital = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        addressLine1: '',
        addressLine2: '',
        state: '',
        pincode: '',
        startTime: '',
        endTime: '',
        contactNumber: '',
        numberOfBeds: '',
        emergencyServices: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            await addHospital(form);
            alert('Hospital registered');
            navigate('/');
        } catch (error) {
            console.error('Error registering hospital:', error);
        }
    };

    return (
        <div className="hospital-registration-container">
            <div className='hospital-left-container'>
                <DarkBrandTitle />
                <div className='hospital-banner'></div>
            </div>
            <div className='hospital-form-group'>
            <h2>Register Hospital</h2>
            <form onSubmit={handleSubmit} className="hospital-form">
                <div className="form-group">
                    <label>Hospital Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address Line 1</label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={form.addressLine1}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Address Line 2</label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={form.addressLine2}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>State</label>
                    <input
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contact Number</label>
                    <input
                        type="tel"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Number of Beds</label>
                    <input
                        type="number"
                        name="numberOfBeds"
                        value={form.numberOfBeds}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="emergencyServices"
                            checked={form.emergencyServices}
                            onChange={handleChange}
                        />
                        Emergency Services Available
                    </label>
                </div>
                <button type="submit" className="formSubmit">Register Hospital</button>
                <button type='button' className="formSubmit gray" onClick={()=>navigate('/')}>Cancel</button>
            </form>
        </div>
        </div>
    );
};

export default Hospital;
