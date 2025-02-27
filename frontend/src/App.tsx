import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MedicalForm from './components/MedicalForm';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-2xl font-bold">Techwards Medical Application</h1>
            <div className="relative">
                {isAuthenticated ? (
                    <>
                        <button
                            onClick={toggleDropdown}
                            className="bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                            {user?.firstName} {user?.lastName}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-x-4">
                        <Link to="/signin" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800">
                            Sign In
                        </Link>
                        <Link to="/signup" className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

const AppContent: React.FC = () => {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow">
                <main className="flex-grow p-4 overflow-y-auto">
                    <Routes>
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
                        <Route path="/medical-form" element={<PrivateRoute element={<MedicalForm />} />} />
                    </Routes>
                </main>
            </div>
            <footer className="bg-blue-600 text-white p-4 text-center sticky bottom-0">
                <p>Techwards © 2025</p>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App; 