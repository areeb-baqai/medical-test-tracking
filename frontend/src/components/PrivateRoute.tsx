import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
    element: React.ReactElement;
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Return loader when authenticating
    if (loading) {
        return <LoadingSpinner />;
    }

    // Return element or redirect based on auth state
    return isAuthenticated ? element : (
        <Navigate 
            to="/signin" 
            state={{ from: location }} 
            replace 
        />
    );
};

export default PrivateRoute; 