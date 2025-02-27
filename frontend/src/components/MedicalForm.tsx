import React, { useState } from 'react';
import api from '../services/api';
import SideMenu from './SideMenu';

const MedicalForm: React.FC = () => {
    const [testType, setTestType] = useState('');
    const [testValue, setTestValue] = useState('');
    const [testDate, setTestDate] = useState('');
    const [error, setError] = useState('');

    const testTypes = [
        'Platelets Count',
        'Hemoglobin',
        'RBC',
        'WBC',
        'Vitamin D',
        'Cholesterol Levels',
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!testType || !testValue || !testDate) {
            setError('All fields are required.');
            return;
        }

        try {
            await api.post('/api/medical-form', {
                testType,
                testValue,
                testDate,
            });
            // Handle success
        } catch (err) {
            setError('Submission failed. Please try again.'); // Handle error
        }
    };

    return (
        <div className="flex">
            <SideMenu />
            <div className="flex-grow max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Record Blood Test Data</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Test Type:</label>
                        <select
                            value={testType}
                            onChange={(e) => setTestType(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="">Select a test type</option>
                            {testTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Test Value:</label>
                        <input
                            type="number"
                            value={testValue}
                            onChange={(e) => setTestValue(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Test Date:</label>
                        <input
                            type="date"
                            value={testDate}
                            onChange={(e) => setTestDate(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                        Submit
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default MedicalForm; 