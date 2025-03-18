import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TestHistory from './TestHistory';
import { CBC_PARAMETERS } from '../constants/testParameters';
import { useTestStats } from '../context/TestStatsContext';
import Card from './common/Card';
import Button from './common/Button';
import Select from './common/Select';
import { useMedicalData, useStats } from '../hooks/useApiQueries';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [selectedTestType, setSelectedTestType] = useState<string>('all');
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const { 
        stats, 
        loading: testStatsLoading, 
        availableTestTypes,
        selectedFilter, 
        setSelectedFilter 
    } = useTestStats();

    // Use React Query hooks with built-in caching
    const { data: medicalData = [], isLoading: isLoadingData } = useMedicalData();
    const { data: statsData, isLoading: isLoadingStats } = useStats();

    // Fetch user data when component mounts or when availableTestTypes changes
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
                
                setFilteredData(data);
            } catch (error) {
                console.error('Failed to fetch medical data:', error);
            }
        };

        // fetchMedicalData();
    }, [user?.id]);

    console.log("medicalData", medicalData);
    console.log("filteredData", filteredData);

    // Get dropdown options using availableTestTypes from context
    const testTypes = ['all', ...availableTestTypes].sort();

    // Filter tests based on selected type
    const filteredTests = medicalData.filter((test: any) => 
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

    // Rename the second stats variable
    const localStats = selectedTestType === 'all' 
        ? calculateStats(medicalData)
        : calculateStats(filteredTests);

    // Prepare chart data based on filter selection
    const prepareChartData = () => {
        if (selectedTestType === 'all') {
            // For "All Test Types" - group data by test date, avoiding duplicates
            return medicalData.reduce((acc: any[], item: any) => {
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
            .sort((a: any, b: any) => new Date(a.name).getTime() - new Date(b.name).getTime());
        } else {
            // For specific test type - sort by date for historical view
            // Deduplicate entries with the same date by keeping the last one
            const uniqueDates = new Map();
            
            filteredTests
                .forEach((item: any) => {
                    uniqueDates.set(item.testDate, item);
                });
                
            const testSpecificData = Array.from(uniqueDates.values())
                .sort((a: any, b: any) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
                .map((item: any) => ({
                    name: item.testDate,
                    value: item.testValue
                }));
                
            return testSpecificData;
        }
    };

    const chartData = prepareChartData();
    
    // Get unique test types for the legend (only used when showing all test types)
    const uniqueTestTypes = Array.from(new Set(medicalData.map((item: any) => item.testType))) as string[];

    // Handle filter change
    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFilter(e.target.value);
        // The useEffect in TestStatsContext will automatically refresh data
    };

    if (isLoadingData || isLoadingStats) {
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
                    <Select
                        value={selectedTestType}
                        onChange={(e) => setSelectedTestType(e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        options={testTypes.map(type => ({
                            value: type,
                            label: type === 'all' ? 'All Tests' : type
                        }))}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center">
                    <div className="flex flex-col items-center">
                        <div className="inline-flex h-12 w-12 rounded-full bg-indigo-100 items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{localStats.totalTests || 0}</div>
                        <div className="text-sm text-gray-500">Total Tests Recorded</div>
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex flex-col items-center">
                        <div className="inline-flex h-12 w-12 rounded-full bg-green-100 items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{localStats.normalTests || 0}</div>
                        <div className="text-sm text-gray-500">Normal Results</div>
                    </div>
                </Card>

                <Card className="text-center">
                    <div className="flex flex-col items-center">
                        <div className="inline-flex h-12 w-12 rounded-full bg-yellow-100 items-center justify-center mb-3">
                            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{localStats.abnormalTests || 0}</div>
                        <div className="text-sm text-gray-500">Abnormal Results</div>
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results - Bar Chart</h3>
                    <div className="overflow-x-auto">
                        <BarChart width={600} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedTestType === 'all' ? (
                                uniqueTestTypes.map((type: string, index) => (
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
                </Card>

                {/* Line Chart */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results - Line Chart</h3>
                    <div className="overflow-x-auto">
                        <LineChart width={600} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedTestType === 'all' ? (
                                uniqueTestTypes.map((type: string, index) => (
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
                </Card>
            </div>

            <div className="mt-8">
                <TestHistory tests={Array.isArray(filteredTests) ? filteredTests : []} />
            </div>
        </div>
    );
};

export default Dashboard; 