import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, sendPasswordReset } from '../../firebase/firebase'; // Import custom auth functions
import DarkBrandTitle from '../../components/BrandTitles/DarkBrandTitle';
import './LoginRegister.css';
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';
import person_icon from '../../assets/person.png';
import state_icon from '../../assets/state.png';
import pincode_icon from '../../assets/pincode.png';
import other_icon from '../../assets/other.png';
import phone_icon from '../../assets/phone.png';
import blood_icon from '../../assets/blood.png';
import RadioButtons from '../../components/RadioButtons';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import { useAuth } from '../../context/AuthContext';

const LoginRegister = () => {
    const [action, setAction] = useState('Login');
    const [selectedUserType, setSelectedUserType] = useState('Department');
    const [name, setName] = useState('');
    const [mobile, setmobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [add1, setAdd1] = useState('');
    const [add2, setAdd2] = useState('');
    const [pincode, setPincode] = useState('');
    const [state, setState] = useState('');
    const [statesOfOperation, setStatesOfOperation] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const { login } = useAuth();

    // Handle login using the custom loginUser function
    const handleLogin = async () => {
        setLoading(true); // Start loading
        try {
            const user = await loginUser(email, password, selectedUserType); // Use the custom login function
            console.log('User logged in:', user); // Add this line
            login(user, email, selectedUserType);
            navigate('/active-projects'); // Redirect to the active projects page
        } catch (error) {
            console.error('Login failed:', error.message);
            alert(`Login failed: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Handle registration using the custom registerUser function
    const handleRegister = async () => {
        setLoading(true); // Start loading
        try {
            // Construct registration data based on user type
            const userDetails = {
                selectedUserType,
                name,
                mobile,
                bloodGroup, 
                add1,
                add2,
                state,
                statesOfOperation,
                pincode
            };
    
            const user = await registerUser(email, password, userDetails); // Register user with type-based logic
    
            console.log('Registration successful', user);
            navigate('/active-projects');
        } catch (error) {
            console.error('Registration failed:', error.message);
            alert(`Registration failed: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please provide your email to reset password.");
            return;
        }
    
        try {
            await sendPasswordReset(email); // Trigger password reset email
            alert('Password reset email sent!');
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            alert(`Failed to send reset email: ${error.message}`);
        }
    };

    return (
        <div className="screen">
            <div className="login-container">
                <DarkBrandTitle />
                <div className="login-header">
                    <div className="login-heading">{action}</div>
                    <div className="login-head-underline"></div>
                </div>

                <div className="inputs">
                    <RadioButtons
                        options={[
                            { value: 'Department', label: 'Department', id: 'department' },
                            { value: 'Volunteer', label: 'Volunteer', id: 'volunteer' }
                        ]}
                        selectedValue={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value)}
                    />

                    {/* Show Name field for Department or Volunteer during Registration */}
                    {action === 'Register' && (
                        <InputField
                            type="text"
                            placeholder="Name"
                            icon={person_icon}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}

                    {action === 'Register' && selectedUserType === 'Department' && (
                        <InputField
                            type="text"
                            placeholder="States of Operation"
                            icon={state_icon}
                            onChange={(e) => setStatesOfOperation(e.target.value)}
                        />
                    )}

                    {action === 'Register' && selectedUserType === 'Volunteer' && (
                        <>
                            <InputField
                                type="text"
                                placeholder="Address Line 1"
                                icon={other_icon}
                                onChange={(e) => setAdd1(e.target.value)}
                            />
                            <InputField
                                type="text"
                                placeholder="Address Line 2"
                                icon={other_icon}
                                onChange={(e) => setAdd2(e.target.value)}
                            />
                            <InputField
                                type="text"
                                placeholder="State"
                                icon={state_icon}
                                onChange={(e) => setState(e.target.value)}
                            />
                            <InputField
                                type="text"
                                placeholder="Pincode"
                                icon={pincode_icon}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <InputField
                                type="text"
                                placeholder="Mobile Number"
                                icon={phone_icon}
                                onChange={(e) => setmobile(e.target.value)}
                            />
                            <InputField
                                type="text"
                                placeholder="Blood Group"
                                icon={blood_icon}
                                onChange={(e) => setBloodGroup(e.target.value)}
                            />
                        </>
                    )}

                    <InputField
                        type="email"
                        placeholder="Email"
                        icon={email_icon}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputField
                        type="password"
                        placeholder="Password"
                        icon={password_icon}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {action === 'Login' && (
                    <div className="forgot-password" onClick={handleForgotPassword}>
                        Forgot Password? <span>Click here!</span>
                    </div>
                )}

                <SubmitButton
                    action={action}
                    setAction={setAction}
                    handleEvent={action === 'Login' ? handleLogin : handleRegister} // Handle login or register based on action
                    loading={loading} // Pass the loading state to SubmitButton
                />

                <p>USE FOLLOWING CREDENTIALS FOR TESTING:<br/>
                Department:<br/>akdvar2003@gmail.com <br/>akd-pass</p>
                <p>Volunteer:<br/>aviral@exp.com<br/>abcdef</p>
            </div>

            <div className="banner"></div>
        </div>
    );
};

export default LoginRegister;
