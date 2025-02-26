import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Medical Form</h1>
                {isAuthenticated && (
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Welcome, {user?.firstName} {user?.lastName}</span>
                        <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-2 rounded-md">Logout</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;