import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTestStats } from '../context/TestStatsContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CBC_PARAMETERS } from '../constants/testParameters';
import CSVUpload from './CSVUpload';

interface CBCTestData {
    testDate: string;
    [key: string]: string | number;
}

interface TestField {
    testType: string;
    value: string;
}

// Add a default parameter structure
const DEFAULT_TEST_PARAMS = {
    unit: 'units',
    min: 0,
    max: 100
};

const MedicalForm: React.FC = () => {
    const [testData, setTestData] = useState<CBCTestData>({
        testDate: new Date().toISOString().split('T')[0]
    });
    const [selectedFields, setSelectedFields] = useState<TestField[]>([]);
    const [selectedTest, setSelectedTest] = useState<string>('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { refreshStats } = useTestStats();
    const [availableTestTypes, setAvailableTestTypes] = useState<string[]>(
        Object.keys(CBC_PARAMETERS)
    );

    const handleInputChange = (field: string, value: string) => {
        setTestData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Get available tests (excluding already selected ones)
    const availableTests = availableTestTypes
        .filter(testType => !selectedFields.some(field => field.testType === testType));

    const addTestField = () => {
        if (selectedTest && !selectedFields.some(field => field.testType === selectedTest)) {
            setSelectedFields([...selectedFields, { testType: selectedTest, value: '' }]);
            setSelectedTest('');
        }
    };

    const removeTestField = (testType: string) => {
        setSelectedFields(selectedFields.filter(field => field.testType !== testType));
    };

    const handleValueChange = (testType: string, value: string) => {
        setSelectedFields(selectedFields.map(field => 
            field.testType === testType ? { ...field, value } : field
        ));
    };

    const isOutsideRange = (value: number, min: number, max: number): boolean => {
        return value < min || value > max;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // Convert selected fields to the format expected by the API
            const testSubmissions = selectedFields
                .filter(field => field.value !== '')
                .map(field => {
                    const numValue = parseFloat(field.value);
                    const { min, max } = CBC_PARAMETERS[field.testType] || DEFAULT_TEST_PARAMS;
                    const isAbnormal = isOutsideRange(numValue, min, max);

                    return api.post('/medical-form', {
                        testType: field.testType,
                        testValue: numValue,
                        testDate: testData.testDate,
                        userId: user?.id,
                        isAbnormal
                    });
                });

            await Promise.all(testSubmissions);
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

    const handleCSVUploadSuccess = (response: { tests: string[], parameters: Record<string, { unit: string, min: number, max: number }> }) => {
        // Update available test types
        setAvailableTestTypes(prevTests => {
            const combined = prevTests.concat(
                response.tests.filter(test => !CBC_PARAMETERS[test])
            );
            const unique = combined.filter((test, index) => combined.indexOf(test) === index);
            return unique.sort();
        });

        // Add new tests with their parameters to CBC_PARAMETERS
        Object.entries(response.parameters).forEach(([testName, params]) => {
            if (!CBC_PARAMETERS[testName]) {
                CBC_PARAMETERS[testName] = params;
            }
        });

        toast.success(`Added ${response.tests.length} new test types with parameters`);
    };

    // Update the test field rendering to handle missing parameters
    const renderTestField = (field: TestField) => {
        const params = CBC_PARAMETERS[field.testType] || DEFAULT_TEST_PARAMS;
        
        return (
            <div key={field.testType} className="relative group">
                <div className="p-4 rounded-lg border border-gray-200 bg-white 
                    hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.testType}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                        <input
                            type="number"
                            step="0.01"
                            value={field.value}
                            onChange={(e) => handleValueChange(field.testType, e.target.value)}
                            className="block w-full rounded-md border-gray-200 pl-3 pr-12
                                focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                                placeholder-gray-400"
                            placeholder={`${params.min}-${params.max}`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-500 sm:text-sm">
                                {params.unit}
                            </span>
                        </div>
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                        Normal range: {params.min}-{params.max} {params.unit}
                    </p>
                    <button
                        type="button"
                        onClick={() => removeTestField(field.testType)}
                        className="absolute top-2 right-2 p-1.5 text-gray-400 
                            hover:text-red-500 hover:bg-red-50 rounded-full
                            transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remove test"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    {/* Header section */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h2 className="text-2xl font-semibold text-gray-800">Record Test Results</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Select tests and enter their values below
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-6">
                            {/* Test Date section */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Test Date</label>
                                    <input
                                        type="date"
                                        value={testData.testDate}
                                        onChange={(e) => handleInputChange('testDate', e.target.value)}
                                        className="block w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Test Selection section */}
                            <div className="sticky top-0 z-10 bg-white pb-4 border-b border-gray-100">
                                <div className="flex gap-3 items-center justify-between">
                                    <div className="flex gap-3 items-center">
                                        <select
                                            value={selectedTest}
                                            onChange={(e) => setSelectedTest(e.target.value)}
                                            className="w-64 rounded-lg border-gray-200 shadow-sm 
                                                focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="">Select a test to add</option>
                                            {availableTests.map(testType => (
                                                <option key={testType} value={testType}>{testType}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={addTestField}
                                            disabled={!selectedTest}
                                            className="inline-flex items-center justify-center h-9 px-4
                                                bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                disabled:bg-blue-300 disabled:cursor-not-allowed 
                                                transition-colors duration-200 whitespace-nowrap"
                                        >
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Test
                                        </button>
                                    </div>
                                    <CSVUpload onUploadSuccess={handleCSVUploadSuccess} />
                                </div>
                            </div>

                            {/* Selected Tests Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
                                {selectedFields.map(field => renderTestField(field))}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                                    <div className="flex">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                                        </svg>
                                        <p className="ml-3 text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="sticky bottom-0 bg-white pt-4 mt-6 border-t border-gray-100">
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || selectedFields.length === 0}
                                        className="inline-flex items-center px-6 py-3 border border-transparent 
                                            text-base font-medium rounded-lg shadow-sm text-white 
                                            bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                                            focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 
                                            disabled:cursor-not-allowed transition-all duration-200"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Recording...
                                            </>
                                        ) : 'Record Results'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MedicalForm; 