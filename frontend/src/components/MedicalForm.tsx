import React, { useState } from 'react';
import api from '../services/api';
import SideMenu from './SideMenu';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MedicalForm: React.FC = () => {
    const [testType, setTestType] = useState('');
    const [testValue, setTestValue] = useState('');
    const [testDate, setTestDate] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
        setIsSubmitting(true);

        if (!testType || !testValue || !testDate) {
            setError('All fields are required.');
            setIsSubmitting(false);
            return;
        }

        try {
            await api.post('/medical-form', {
                testType,
                testValue,
                testDate,
                userId: user?.id
            });
            
            // Show success dialog
            setShowSuccessDialog(true);
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            console.error('Error submitting medical form:', err);
            setError('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success Dialog Component
    const SuccessDialog = () => {
        if (!showSuccessDialog) return null;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mt-3 text-lg font-medium text-gray-900">Submission Successful!</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Your medical form has been successfully submitted. Redirecting to dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
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
                    <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
            </div>
            <SuccessDialog />
        </div>
    );
};

export default MedicalForm; 