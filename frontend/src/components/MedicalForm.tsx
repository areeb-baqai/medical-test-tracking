import React, { useState } from 'react';
import api from '../services/api';
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
            setShowSuccessDialog(true);
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
                <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full transform transition-all">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-gray-900">Test Record Added!</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Your medical test data has been successfully recorded. Redirecting to dashboard...
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Record Medical Test</h1>
                    <p className="mt-1 text-gray-600">Enter your medical test details below</p>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Test Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Type
                                </label>
                                <select
                                    value={testType}
                                    onChange={(e) => setTestType(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a test type</option>
                                    {testTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Test Value Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Value
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <input
                                        type="number"
                                        value={testValue}
                                        onChange={(e) => setTestValue(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Test Date Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Test Date
                                </label>
                                <input
                                    type="date"
                                    value={testDate}
                                    onChange={(e) => setTestDate(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        inline-flex items-center px-6 py-3 border border-transparent 
                                        text-base font-medium rounded-lg shadow-sm text-white 
                                        ${isSubmitting 
                                            ? 'bg-indigo-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Recording...
                                        </>
                                    ) : (
                                        'Record Test Data'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Information Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">Need Help?</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Contact your healthcare provider for guidance on test values and interpretation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900">Data Security</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Your medical data is encrypted and securely stored.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SuccessDialog />
        </div>
    );
};

export default MedicalForm; 