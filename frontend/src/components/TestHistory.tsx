import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronRightIcon, DocumentIcon, ExclamationCircleIcon, ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CBC_PARAMETERS, TestParameter } from '../constants/testParameters';

interface Test {
    id: number;
    testType: string;
    testValue: number;
    testDate: string;
    notes?: string;
    isAbnormal?: boolean;
}

interface GroupedTests {
    [date: string]: Test[];
}

interface TestHistoryProps {
    tests: Test[];
}

// Add this interface for reference ranges
interface ReferenceRange {
    min: number;
    max: number;
    unit: string;
}

const TestHistory: React.FC<TestHistoryProps> = ({ tests = [] }) => {
    console.log('tests', tests);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [sortField, setSortField] = useState<'testType' | 'testValue'>('testType');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filterType, setFilterType] = useState<string>('all');
    const [noteInput, setNoteInput] = useState<{ [testId: number]: string }>({});
    const panelRef = useRef<HTMLDivElement>(null);

    // Group tests by date
    const groupedTests = useMemo(() => {
        return tests.reduce((groups: GroupedTests, test) => {
            const date = format(new Date(test.testDate), 'yyyy-MM-dd');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(test);
            return groups;
        }, {});
    }, [tests]);

    // Sort dates in descending order (newest first)
    const sortedDates = useMemo(() => {
        return Object.keys(groupedTests).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    }, [groupedTests]);

    // Sort and filter tests for each date
    const getSortedAndFilteredTests = (dateTests: Test[]) => {
        let filtered = filterType === 'all' 
            ? dateTests 
            : filterType === 'abnormal' 
                ? dateTests.filter(test => test.isAbnormal)
                : dateTests.filter(test => !test.isAbnormal);

        return filtered.sort((a, b) => {
            if (sortField === 'testType') {
                return sortDirection === 'asc' 
                    ? a.testType.localeCompare(b.testType)
                    : b.testType.localeCompare(a.testType);
            }
            return sortDirection === 'asc' 
                ? a.testValue - b.testValue
                : b.testValue - a.testValue;
        });
    };

    const openPanel = (date: string) => {
        setSelectedDate(date);
        setIsPanelOpen(true);
    };

    const closePanel = () => {
        setIsPanelOpen(false);
    };

    const handleSort = (field: 'testType' | 'testValue') => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const exportTests = (date: string) => {
        const testsToExport = groupedTests[date];
        const csv = [
            ['Test Type', 'Value', 'Date'].join(','),
            ...testsToExport.map(test => [
                test.testType,
                test.testValue,
                test.testDate,
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tests-${date}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // For trend analysis, get historical data for a specific test type
    const getTestTrend = (testType: string) => {
        const trendData = Object.entries(groupedTests)
            .flatMap(([date, tests]) => {
                const test = tests.find(t => t.testType === testType);
                if (test) {
                    return [{
                        date,
                        value: test.testValue
                    }];
                }
                return [];
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        return trendData;
    };
    
    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                closePanel();
            }
        };
        
        if (isPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPanelOpen]);

    return (
        <div className="bg-white rounded-lg shadow relative">
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
                    <div className="flex space-x-4">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="rounded-md border-gray-300 text-sm"
                        >
                            <option value="all">All Tests</option>
                            <option value="normal">Normal</option>
                            <option value="abnormal">Abnormal</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden">
                {sortedDates.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No test data available
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tests
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedDates.map(date => (
                                <tr 
                                    key={date}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => openPanel(date)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {format(new Date(date), 'MMMM d, yyyy')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {groupedTests[date].length} tests
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    exportTests(date);
                                                }}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <DocumentIcon className="h-5 w-5" />
                                            </button>
                                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Sliding Panel */}
            <div className={`fixed inset-0 bg-black bg-opacity-25 z-40 transition-opacity duration-300 ${isPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div 
                    ref={panelRef}
                    className={`absolute top-0 right-0 w-full md:w-2/3 lg:w-1/2 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                        isPanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    {selectedDate && (
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Tests for {format(new Date(selectedDate), 'MMMM d, yyyy')}
                                </h2>
                                <button 
                                    onClick={closePanel}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        {groupedTests[selectedDate].length} tests recorded
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => exportTests(selectedDate)}
                                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <DocumentIcon className="h-4 w-4 mr-1" />
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-auto p-4">
                                {/* Tests Table */}
                                <div className="bg-white rounded-md shadow mb-6">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => handleSort('testType')}
                                                >
                                                    <div className="flex items-center">
                                                        Test Type
                                                        {sortField === 'testType' && (
                                                            sortDirection === 'asc' ? 
                                                                <ArrowUpIcon className="ml-1 h-4 w-4" /> : 
                                                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => handleSort('testValue')}
                                                >
                                                    <div className="flex items-center">
                                                        Value
                                                        {sortField === 'testValue' && (
                                                            sortDirection === 'asc' ? 
                                                                <ArrowUpIcon className="ml-1 h-4 w-4" /> : 
                                                                <ArrowDownIcon className="ml-1 h-4 w-4" />
                                                        )}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Reference Range
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {getSortedAndFilteredTests(groupedTests[selectedDate]).map(test => (
                                                <tr key={test.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {test.testType}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className={test.isAbnormal ? 'text-red-600 font-medium' : ''}>
                                                            {test.testValue} {CBC_PARAMETERS[test.testType]?.unit || ''}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {CBC_PARAMETERS[test.testType] ? (
                                                            <span>
                                                                {CBC_PARAMETERS[test.testType].min} - {CBC_PARAMETERS[test.testType].max}{' '}
                                                                {CBC_PARAMETERS[test.testType].unit}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">Not available</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestHistory; 