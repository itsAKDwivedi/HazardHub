import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = () => {
            if (user) {
                logout();
                navigate("/login");
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [user, logout, navigate]);

    // Remove beforeunload to avoid the "unsaved changes" message
    // If this functionality is absolutely necessary, you can suppress the dialog
    // but retain logout logic elsewhere.

    return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
