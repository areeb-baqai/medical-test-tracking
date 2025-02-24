import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu: React.FC = () => {
    return (
        <nav className="w-1/4 bg-gray-200 p-4">
            <h2 className="text-lg font-bold mb-4">Navigation</h2>
            <ul>
                <li>
                    <Link to="/dashboard" className="block py-2 text-gray-700 hover:bg-gray-300">Dashboard</Link>
                </li>
                <li>
                    <Link to="/medical-form" className="block py-2 text-gray-700 hover:bg-gray-300">Medical Form</Link>
                </li>
                <li>
                    <Link to="/" className="block py-2 text-gray-700 hover:bg-gray-300">Home</Link>
                </li>
            </ul>
        </nav>
    );
};

export default SideMenu; 