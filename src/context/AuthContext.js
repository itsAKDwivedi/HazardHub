import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [userEmail, setUserEmail] = useState(null); // New state for user email
    const [userType, setUserType] = useState(null); // New state for user collection

    const login = (user, email, type) => {
        setUser(user);
        setUserEmail(email);
        setUserType(type);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userType', type);
    };

    const logout = () => {
        setUser(null);
        setUserEmail(null);
        setUserType(null);
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setUserEmail(localStorage.getItem('userEmail'));
            setUserType(localStorage.getItem('userType'));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, userEmail, userType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
