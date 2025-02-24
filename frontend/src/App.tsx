import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MainPage from './MainPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import MedicalForm from './components/MedicalForm';
import './index.css';

const App: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My Application</h1>
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none"
                        >
                            Auth Options
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Sign Up
                                </Link>
                                <Link to="/signin" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                    Sign In
                                </Link>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-grow container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/medical-form" element={<MedicalForm />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App; 