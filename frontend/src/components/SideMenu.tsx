import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useTestStats } from '../context/TestStatsContext';

interface TestStats {
    lastTestDate: string;
    totalTests: number;
}

const SideMenu: React.FC = () => {
    const location = useLocation();
    const { stats } = useTestStats();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (stats.totalTests > 0) {
            setIsLoading(false);
        }  
        
        }, [stats.totalTests]); 
    

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
        },
        {
            name: 'Medical Tests',
            path: '/medical-form',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
        // {
        //     name: 'Analytics',
        //     path: '/analytics',
        //     icon: (
        //         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        //         </svg>
        //     ),
        // },
        // {
        //     name: 'Reports',
        //     path: '/reports',
        //     icon: (
        //         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        //         </svg>
        //     ),
        // },
    ];

    return (
        <aside className="bg-white w-64 min-h-screen border-r border-gray-200">
            <div className="p-6">
                <div className="space-y-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                                ${location.pathname === item.path
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Quick Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Last Test</p>
                                {isLoading ? (
                                    <span className="text-sm text-gray-400">Loading...</span>
                                ) : error ? (
                                    <span className="text-sm text-red-500">Error</span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-900">{stats.lastTestDate}</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Total Tests</p>
                                {isLoading ? (
                                    <span className="text-sm text-gray-400">Loading...</span>
                                ) : error ? (
                                    <span className="text-sm text-red-500">Error</span>
                                ) : (
                                    <span className="text-sm font-medium text-gray-900">{stats.totalTests}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SideMenu; 