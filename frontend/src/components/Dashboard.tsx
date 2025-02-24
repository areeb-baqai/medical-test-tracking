import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
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
                const response = await axios.get('http://localhost:3000/api/medical-form'); // Adjust the endpoint as needed
                setTestData(response.data);
                setFilteredData(response.data); // Initialize filtered data
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
                    <BarChart width={600} height={300} data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="testDate" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="testValue" fill="#8884d8" />
                    </BarChart>

                    <LineChart width={600} height={300} data={filteredData}>
                        <XAxis dataKey="testDate" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="testValue" stroke="#82ca9d" />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 