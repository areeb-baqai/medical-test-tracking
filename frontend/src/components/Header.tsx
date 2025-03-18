import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './common/Button';
import Dropdown from './common/Dropdown';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-semibold text-gray-800">TibbTrack</h1>
                        
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <svg
                                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                            aria-label="Notifications"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </Button>

                        {/* User Menu */}
                        <Dropdown 
                            trigger={
                                <button className="flex items-center space-x-2 focus:outline-none">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </div>
                                    <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                                        {user?.firstName} {user?.lastName}
                                    </span>
                                </button>
                            }
                        >
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Profile Settings
                            </Link>
                            <Link
                                to="/preferences"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Preferences
                            </Link>
                            <div className="border-t border-gray-200"></div>
                            <Button
                                onClick={logout}
                                variant="danger"
                                size="sm"
                                className="w-full text-left px-4 py-2 text-sm"
                            >
                                Sign out
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;