import React from 'react';
import SideMenu from './components/SideMenu';

const MainPage: React.FC = () => {
    return (
        <div className="flex">
            <SideMenu />
            <div className="flex-grow p-4">
                <h1 className="text-3xl font-bold text-center mt-10">Welcome to Our Application</h1>
            </div>
        </div>
    );
};

export default MainPage; 