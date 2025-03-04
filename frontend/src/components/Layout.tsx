import React from 'react';
import SideMenu from './SideMenu';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SideMenu />
            <div className="flex-1">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center">
                            <img src="/logo.svg" alt="Techwards Logo" className="h-8 w-8" />
                            <span className="ml-2 text-xl font-bold text-gray-900">Techwards</span>
                        </div>
                    </div>
                </header>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout; 