import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TestHistory from './TestHistory';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [medicalData, setMedicalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [testType, setTestType] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const testTypes = [
        'Platelets Count',
        'Hemoglobin',
        'RBC',
        'WBC',
        'Vitamin D',
        'Cholesterol Levels',
    ];

    // Fetch user data on component mount
    useEffect(() => {
        const fetchMedicalData = async () => {
            try {
                if (!user?.id) return;
                
                const response = await api.get(`/medical-form/${user.id}`);
                const data = response.data.map((item: any) => ({
                    ...item,
                    name: item.testDate, // For X-axis
                    [item.testType]: item.testValue, // Dynamic key based on test type
                }));
                
                setMedicalData(data);
                setFilteredData(data);
            } catch (error) {
                console.error('Failed to fetch medical data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalData();
    }, [user?.id]);

    // Apply filtering when test type changes
    useEffect(() => {
        const filtered = medicalData.filter((item) => {
            return (!testType || item.testType === testType);
        });
        setFilteredData(filtered);
    }, [testType, medicalData]);

    // Prepare chart data based on filter selection
    const prepareChartData = () => {
        if (!testType) {
            // For "All Test Types" - group data by test date, avoiding duplicates
            return filteredData.reduce((acc: any[], item) => {
                const existingDate = acc.find(d => d.name === item.testDate);
                if (existingDate) {
                    existingDate[item.testType] = item.testValue;
                } else {
                    acc.push({
                        name: item.testDate,
                        [item.testType]: item.testValue,
                    });
                }
                return acc;
            }, [])
            .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
        } else {
            // For specific test type - sort by date for historical view
            // Deduplicate entries with the same date by keeping the last one
            const uniqueDates = new Map();
            
            filteredData
                .filter(item => item.testType === testType)
                .forEach(item => {
                    uniqueDates.set(item.testDate, item);
                });
                
            const testSpecificData = Array.from(uniqueDates.values())
                .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
                .map(item => ({
                    name: item.testDate,
                    value: item.testValue
                }));
                
            return testSpecificData;
        }
    };

    const chartData = prepareChartData();
    
    // Get unique test types for the legend (only used when showing all test types)
    const uniqueTestTypes = Array.from(new Set(filteredData.map(item => item.testType)));

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
                <p className="text-gray-600 mt-1">Here's an overview of your health metrics</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Tests</h3>
                            <p className="text-2xl font-semibold text-gray-900">{filteredData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Latest Reading</h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                {filteredData[0]?.testValue || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Last Test Date</h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                {filteredData[0]?.testDate || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Test Type Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Filter Results</h2>
                </div>
                <div className="max-w-xs">
                    <select
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">All Test Types</option>
                        {testTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results - Bar Chart</h3>
                    <div className="overflow-x-auto">
                        <BarChart width={600} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {testType ? (
                                <Bar dataKey="value" fill="#4F46E5" name={testType} />
                            ) : (
                                uniqueTestTypes.map((type, index) => (
                                    <Bar 
                                        key={type} 
                                        dataKey={type} 
                                        fill={`hsl(${index * 30}, 70%, 50%)`}
                                        name={type}
                                    />
                                ))
                            )}
                        </BarChart>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results - Line Chart</h3>
                    <div className="overflow-x-auto">
                        <LineChart width={600} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {testType ? (
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4F46E5"
                                    name={testType}
                                />
                            ) : (
                                uniqueTestTypes.map((type, index) => (
                                    <Line
                                        key={type}
                                        type="monotone"
                                        dataKey={type}
                                        stroke={`hsl(${index * 30}, 70%, 50%)`}
                                        name={type}
                                    />
                                ))
                            )}
                        </LineChart>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <TestHistory tests={filteredData} />
            </div>
        </div>
    );
};

export default Dashboard; 