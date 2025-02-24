import React from 'react';
import { Link } from 'react-router-dom';

const SideMenu: React.FC = () => {
    return (
        <nav className="w-1/4 bg-gray-200 p-4 sticky top-0 h-screen">
            <h2 className="text-lg font-bold mb-4">Options</h2>
            <ul>
                <li>
                    <Link to="/" className="block py-2 text-gray-700 hover:bg-gray-300">Dashboard</Link>
                </li>
                <li>
                    <Link to="/medical-form" className="block py-2 text-gray-700 hover:bg-gray-300">Medical Form</Link>
                </li>
            </ul>
        </nav>
    );
};

export default SideMenu; 