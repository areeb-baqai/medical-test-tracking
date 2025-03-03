import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MedicalForm from './components/MedicalForm';
import SideMenu from './components/SideMenu';
import './index.css';

// Header component for private routes
const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-800">Healthish</h1>
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

// Footer component for private routes
const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                <p>© 2024 Healthish. All rights reserved.</p>
            </div>
        </footer>
    );
};

// Layout component for authenticated pages
const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideMenu />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

// Protected Route component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <PrivateLayout>{children}</PrivateLayout>;
};

// Public Route component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppContent: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes - No header/footer */}
            <Route path="/signin" element={
                <PublicRoute>
                    <SignIn />
                </PublicRoute>
            } />
            <Route path="/signup" element={
                <PublicRoute>
                    <SignUp />
                </PublicRoute>
            } />

            {/* Private Routes - With header/footer */}
            <Route path="/" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path="/medical-form" element={
                <PrivateRoute>
                    <MedicalForm />
                </PrivateRoute>
            } />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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