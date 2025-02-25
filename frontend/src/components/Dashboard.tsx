import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Label, Legend } from 'recharts';
import axios from 'axios';
import SideMenu from './SideMenu';

const Dashboard: React.FC = () => {
    const [testData, setTestData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [testType, setTestType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const testTypes = [
        'Platelets Count',
        'Hemoglobin',
        'RBC',
        'WBC',
        'Vitamin D',
        'Cholesterol Levels',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/medical-form');
                const formattedData = response.data.map((item: any) => ({
                    ...item,
                    name: item.testDate, // For X-axis
                    [item.testType]: item.testValue, // Dynamic key based on test type
                }));
                setTestData(formattedData);
                setFilteredData(formattedData);
            } catch (error) {
                console.error('Error fetching test data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFilter = () => {
        const filtered = testData.filter((item) => {
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

    return (
        <div className="flex">
            <SideMenu />
            <div className="flex-grow p-4">
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                    <div className="mb-4">
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
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                        Filter
                    </button>

                    <h2 className="text-2xl font-bold mt-6">Test Data Visualization</h2>
                    
                    {/* Bar Chart */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Bar Chart View</h3>
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

                    {/* Line Chart */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Line Chart View</h3>
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

                    {/* Test Data List */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Test Records</h3>
                        <ul className="space-y-2">
                            {filteredData.map((item, index) => (
                                <li key={index} className="bg-gray-50 p-2 rounded">
                                    <span className="font-medium">{item.testType}</span>: {item.testValue} 
                                    <span className="text-gray-500 ml-2">({item.testDate})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 