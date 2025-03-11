import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MedicalForm from './components/MedicalForm';
import SideMenu from './components/SideMenu';
import ProfileSettings from './components/ProfileSettings';
import './index.css';
import { TestStatsProvider } from './context/TestStatsContext';
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
// Header component for private routes
const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-800">TibbTrack</h1>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                        <span>{user?.firstName} {user?.lastName}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                            <div className="py-1">
                                <Link 
                                    to="/profile" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// Root route component
const RootRedirect: React.FC = () => {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />;
};

// Private route wrapper
const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return (
        <div className="flex min-h-screen">
            <SideMenu />
            <div className="flex-1 flex flex-col">
                <Header />
                {element}
                <Footer />
            </div>
        </div>
    );
};

// AppContent component
const AppContent: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Root route redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Private routes */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/medical-form" element={<PrivateRoute element={<MedicalForm />} />} />
            <Route path="/profile" element={<PrivateRoute element={<ProfileSettings />} />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <TestStatsProvider>
                    <AppContent />
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
                </TestStatsProvider>
            </AuthProvider>
        </Router>
    );
};

export default App; 