import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTestStats } from '../context/TestStatsContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CBC_PARAMETERS } from '../constants/testParameters';
import CSVUpload from './CSVUpload';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';

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

// Add at the top of the file
const STORED_TESTS_KEY = 'tibbtrack_test_parameters';

// Initialize CBC_PARAMETERS with stored data
const getStoredParameters = () => {
    const stored = localStorage.getItem(STORED_TESTS_KEY);
    return stored ? { ...CBC_PARAMETERS, ...JSON.parse(stored) } : CBC_PARAMETERS;
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
    const { refreshStats, updateTestParameters } = useTestStats();
    const [testParameters, setTestParameters] = useState(() => getStoredParameters());
    const [availableTestTypes, setAvailableTestTypes] = useState<string[]>(() => 
        Object.keys(testParameters)
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
                    const { min, max } = testParameters[field.testType] || DEFAULT_TEST_PARAMS;
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
        // Update test parameters in context (will be available to Dashboard)
        refreshStats(); // Refresh stats after adding new test types
        updateTestParameters(response.parameters);
        
        // Still update local state for immediate UI update
        setAvailableTestTypes(prevTests => {
            const combined = prevTests.concat(
                response.tests.filter(test => !testParameters[test])
            );
            return Array.from(new Set(combined)).sort();
        });
        
        setTestParameters((prev: Record<string, { unit: string, min: number, max: number }>) => {
            return {
                ...prev,
                ...response.parameters
            };
        });

        toast.success(`Added ${response.tests.length} new test types with parameters`);
    };

    // Render test field function
    const renderTestField = (field: TestField) => {
        const params = testParameters[field.testType] || DEFAULT_TEST_PARAMS;
        const value = parseFloat(field.value);
        const isAbnormal = !isNaN(value) && (value < params.min || value > params.max);

        return (
            <div key={field.testType} className="group relative">
                <div className={`p-4 rounded-lg border ${isAbnormal ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    <div className="mb-3 flex justify-between items-start">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.testType}
                        </label>
                        <Button
                            type="button"
                            onClick={() => removeTestField(field.testType)}
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 p-1.5 text-gray-400 
                                hover:text-red-500 hover:bg-red-50 rounded-full
                                transition-colors duration-200 opacity-0 group-hover:opacity-100"
                            aria-label="Remove test"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </div>
                    <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => handleValueChange(field.testType, e.target.value)}
                        className={isAbnormal ? 'border-red-300' : ''}
                        step="0.01"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Normal range: {params.min}-{params.max} {params.unit}
                    </p>
                </div>
            </div>
        );
    };

    const handleTestTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        
        if (selectedValue) {
            // Use the existing component function structure
            setSelectedFields([
                ...selectedFields, 
                { 
                    testType: selectedValue, 
                    value: '' 
                }
            ]);
            
            // Reset the dropdown
            setSelectedTest('');
        }
    };

    const getUnitForTestType = (testType: string): string => {
        switch (testType) {
            case 'hemoglobin':
                return 'g/dL';
            case 'whiteBloodCells':
                return '×10³/µL';
            case 'platelets':
                return '×10³/µL';
            default:
                return '';
        }
    };

    const formatTestName = (testType: string): string => {
        switch (testType) {
            case 'hemoglobin':
                return 'Hemoglobin';
            case 'whiteBloodCells':
                return 'White Blood Cells';
            case 'platelets':
                return 'Platelets';
            default:
                return testType;
        }
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
                                    <Input
                                        type="date"
                                        value={testData.testDate}
                                        onChange={(e) => handleInputChange('testDate', e.target.value)}
                                        label="Test Date"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Test Selection section */}
                            <div className="sticky top-0 z-10 bg-white pb-4 border-b border-gray-100">
                                <div className="flex gap-3 items-center justify-between">
                                    <div className="flex gap-3 items-center">
                                        <Select
                                            value={selectedTest}
                                            onChange={handleTestTypeChange}
                                            className="w-64"
                                            options={[
                                                { value: '', label: 'Select a test to add' },
                                                ...availableTests.map(test => ({
                                                    value: test,
                                                    label: test
                                                }))
                                            ]}
                                        />
                                    </div>
                                    <CSVUpload onUploadSuccess={handleCSVUploadSuccess} />
                                </div>
                                {/* Help text for CSV upload */}
                                <p className="mt-2 text-sm text-gray-500">
                                    Use the CSV upload to quickly add multiple test types to your form. 
                                    This allows you to record various tests in your personal account efficiently.
                                </p>
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
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || selectedFields.length === 0}
                                        isLoading={isSubmitting}
                                        variant="primary"
                                        size="lg"
                                    >
                                        Record Results
                                    </Button>
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