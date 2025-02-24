import React from 'react';
import SideMenu from './SideMenu';

const Dashboard: React.FC = () => {
    return (
        <div className="flex">
            <SideMenu />
            <div className="flex-grow p-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
};

export default Dashboard; 