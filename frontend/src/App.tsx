import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import './index.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <header className="bg-blue-600 text-white p-4 text-center">
                    <h1 className="text-2xl font-bold">My Application</h1>
                </header>
                <main className="flex-grow container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App; 