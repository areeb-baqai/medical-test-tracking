import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTestStats } from '../context/TestStatsContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CBC_PARAMETERS } from '../constants/testParameters';

interface CBCTestData {
    testDate: string;
    [key: string]: string | number;
}

const MedicalForm: React.FC = () => {
    const [testData, setTestData] = useState<CBCTestData>({
        testDate: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { refreshStats } = useTestStats();

    const handleInputChange = (parameter: string, value: string) => {
        setTestData(prev => ({
            ...prev,
            [parameter]: value
        }));
    };

    const validateTestValue = (value: number): boolean => {
        return !isNaN(value) && value >= 0; // Only check if it's a non-negative number
    };

    const isOutsideRange = (value: number, min: number, max: number): boolean => {
        return value < min || value > max;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const filledEntries = Object.entries(testData)
                .filter(([key, value]) => key !== 'testDate' && value !== '');

            // Validate non-negative numbers for filled fields
            const invalidParameters = filledEntries
                .filter(([key]) => CBC_PARAMETERS[key])
                .filter(([_, value]) => {
                    const numValue = parseFloat(value as string);
                    return !validateTestValue(numValue);
                });

            if (invalidParameters.length > 0) {
                setError(`Invalid values (must be non-negative numbers) for: ${invalidParameters.map(([key]) => key).join(', ')}`);
                setIsSubmitting(false);
                return;
            }

            await Promise.all(
                filledEntries.map(([testType, testValue]) => {
                    const numValue = parseFloat(testValue as string);
                    const { min, max } = CBC_PARAMETERS[testType];
                    const isAbnormal = isOutsideRange(numValue, min, max);
                    
                    return api.post('/medical-form', {
                        testType,
                        testValue: numValue,
                        testDate: testData.testDate,
                        userId: user?.id,
                        isAbnormal
                    });
                })
            );

            await refreshStats();
            toast.success('Test results recorded successfully!');
            navigate('/');
        } catch (err) {
            console.error('Error submitting test results:', err);
            setError('Failed to submit test results. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Record CBC Test Results</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Enter Complete Blood Count (CBC) test parameters below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">
                            {/* Test Date */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Test Date</label>
                                    <input
                                        type="date"
                                        value={testData.testDate}
                                        onChange={(e) => handleInputChange('testDate', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* CBC Parameters */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(CBC_PARAMETERS).map(([parameter, { unit, min, max }]) => (
                                    <div key={parameter}>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {parameter} ({unit})
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={testData[parameter] || ''}
                                                onChange={(e) => handleInputChange(parameter, e.target.value)}
                                                className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder={`${min}-${max}`}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">{unit}</span>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Normal range: {min}-{max} {unit}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
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

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        inline-flex items-center px-6 py-3 border border-transparent text-base 
                                        font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                        disabled:bg-blue-400 disabled:cursor-not-allowed
                                        transition-colors duration-200
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
                                    ) : 'Record CBC Results'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MedicalForm; 