import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TestHistory from './TestHistory';
import { CBC_PARAMETERS } from '../constants/testParameters';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [medicalData, setMedicalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTestType, setSelectedTestType] = useState<string>('all');
    const [filteredData, setFilteredData] = useState<any[]>([]);

    // Get unique test types from CBC_PARAMETERS
    const testTypes = ['all', ...Object.keys(CBC_PARAMETERS)].sort();

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

    // Filter tests based on selected type
    const filteredTests = medicalData.filter(test => 
        selectedTestType === 'all' || test.testType === selectedTestType
    );

    // Update stats calculation
    const calculateStats = (tests: any[]) => {
        return {
            totalTests: tests.length,
            abnormalTests: tests.filter(test => test.isAbnormal).length,
            normalTests: tests.filter(test => !test.isAbnormal).length
        };
    };

    // Update filtered stats based on test type
    const stats = selectedTestType === 'all' 
        ? calculateStats(medicalData)
        : calculateStats(filteredTests);

    // Prepare chart data based on filter selection
    const prepareChartData = () => {
        if (selectedTestType === 'all') {
            // For "All Test Types" - group data by test date, avoiding duplicates
            return medicalData.reduce((acc: any[], item) => {
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
            
            filteredTests
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
    const uniqueTestTypes = Array.from(new Set(medicalData.map(item => item.testType)));

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

            {/* Test Type Filter */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Filter Results</h2>
                </div>
                <div className="max-w-xs">
                    <select
                        value={selectedTestType}
                        onChange={(e) => setSelectedTestType(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        {testTypes.map(type => (
                            <option key={type} value={type}>
                                {type === 'all' ? 'All Tests' : type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Tests</h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats.totalTests}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Normal Results</h3>
                            <p className="text-2xl font-semibold text-green-600">
                                {stats.normalTests}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Abnormal Results</h3>
                            <p className="text-2xl font-semibold text-red-600">
                                {stats.abnormalTests}
                            </p>
                        </div>
                    </div>
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
                            {selectedTestType === 'all' ? (
                                uniqueTestTypes.map((type, index) => (
                                    <Bar 
                                        key={type} 
                                        dataKey={type} 
                                        fill={`hsl(${index * 30}, 70%, 50%)`}
                                        name={type}
                                    />
                                ))
                            ) : (
                                <Bar dataKey="value" fill="#4F46E5" name={selectedTestType} />
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
                            {selectedTestType === 'all' ? (
                                uniqueTestTypes.map((type, index) => (
                                    <Line
                                        key={type}
                                        type="monotone"
                                        dataKey={type}
                                        stroke={`hsl(${index * 30}, 70%, 50%)`}
                                        name={type}
                                    />
                                ))
                            ) : (
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#4F46E5"
                                    name={selectedTestType}
                                />
                            )}
                        </LineChart>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <TestHistory tests={filteredTests} />
            </div>
        </div>
    );
};

export default Dashboard; 