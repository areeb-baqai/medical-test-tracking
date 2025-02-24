import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MedicalForm from './components/MedicalForm';
import SideMenu from './components/SideMenu';
import './index.css';

const App: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center sticky top-0 z-10">
                    <h1 className="text-2xl font-bold">Techwards Medical Application</h1>
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
                <div className="flex flex-grow">
                   
                    <main className="flex-grow p-4 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/medical-form" element={<MedicalForm />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </main>
                </div>
                <footer className="bg-blue-600 text-white p-4 text-center sticky bottom-0">
                    <p>Techwards © 2025</p>
                </footer>
            </div>
        </Router>
    );
};

export default App; 