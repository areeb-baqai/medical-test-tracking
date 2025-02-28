import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from 'recharts';
import api from '../services/api';
import SideMenu from './SideMenu';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [medicalData, setMedicalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [testType, setTestType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
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

    const handleFilter = () => {
        const filtered = medicalData.filter((item) => {
            const date = new Date(item.testDate);
            return (
                (!testType || item.testType === testType) &&
                (!startDate || date >= new Date(startDate)) &&
                (!endDate || date <= new Date(endDate))
            );
        });
        setFilteredData(filtered);
    };

    // Group data by test type for better visualization
    const groupedData = filteredData.reduce((acc: any[], item) => {
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
    }, []);

    // Get unique test types for the legend
    const uniqueTestTypes = Array.from(new Set(filteredData.map(item => item.testType)));

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="flex">
            <SideMenu />
            <div className="flex-grow p-4">
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                    
                    {/* Filter Controls */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-semibold mb-4">Filter Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Test Type:</label>
                                <select
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="">All Test Types</option>
                                    {testTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleFilter}
                            className="mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                    </div>

                    {/* Main Visualizations */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-6">Medical Test Results</h2>
                        
                        {filteredData.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No test data available. Please try different filters or add test data.
                            </div>
                        ) : (
                            <>
                                {/* Visualization Tabs */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Bar Chart View</h3>
                                    <div className="overflow-x-auto">
                                        <BarChart width={800} height={400} data={groupedData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="name"
                                                label={{ value: 'Test Date', position: 'insideBottom', offset: -10 }}
                                            />
                                            <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend />
                                            {uniqueTestTypes.map((type, index) => (
                                                <Bar 
                                                    key={type} 
                                                    dataKey={type} 
                                                    fill={`hsl(${index * 30}, 70%, 50%)`}
                                                    name={type}
                                                />
                                            ))}
                                        </BarChart>
                                    </div>
                                </div>

                                {/* Line Chart */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Line Chart View</h3>
                                    <div className="overflow-x-auto">
                                        <LineChart width={800} height={400} data={groupedData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="name"
                                                label={{ value: 'Test Date', position: 'insideBottom', offset: -10 }}
                                            />
                                            <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                                            <Tooltip />
                                            <Legend />
                                            {uniqueTestTypes.map((type, index) => (
                                                <Line
                                                    key={type}
                                                    type="monotone"
                                                    dataKey={type}
                                                    stroke={`hsl(${index * 30}, 70%, 50%)`}
                                                    name={type}
                                                />
                                            ))}
                                        </LineChart>
                                    </div>
                                </div>

                                {/* Test Data List */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Test Records</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredData.map((item, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.testType}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.testValue}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{item.testDate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 