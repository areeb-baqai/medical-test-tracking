import React, { useState, useMemo, Fragment } from 'react';
import { format } from 'date-fns';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon, DocumentIcon, ExclamationCircleIcon, XMarkIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const TestHistory: React.FC<TestHistoryProps> = ({ tests }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [sortField, setSortField] = useState<'testType' | 'testValue'>('testType');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filterType, setFilterType] = useState<string>('all');
    const [noteInput, setNoteInput] = useState<{ [testId: number]: string }>({});

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

    // Get tests for the selected date
    const selectedDateTests = useMemo(() => {
        return selectedDate ? groupedTests[selectedDate] : [];
    }, [selectedDate, groupedTests]);

    // Sort and filter tests
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

    const handleSort = (field: 'testType' | 'testValue') => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const openModal = (date: string) => {
        setSelectedDate(date);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const exportTests = () => {
        if (!selectedDate) return;
        
        const testsToExport = groupedTests[selectedDate];
        const csv = [
            ['Test Type', 'Value', 'Date', 'Notes', 'Status'].join(','),
            ...testsToExport.map(test => [
                test.testType,
                test.testValue,
                test.testDate,
                test.notes || '',
                test.isAbnormal ? 'Abnormal' : 'Normal'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tests-${selectedDate}.csv`;
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

    return (
        <div className="bg-white rounded-lg shadow">
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
                                    View Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sortedDates.map(date => (
                                <tr 
                                    key={date} 
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => openModal(date)}
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
                                        <ChevronRightIcon className="h-5 w-5 inline-block text-gray-400" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detailed Test Modal */}
            <Transition appear show={modalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                                    >
                                        <div>
                                            Test Results for {selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : ''}
                                        </div>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={closeModal}
                                        >
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </Dialog.Title>

                                    <div className="mt-4">
                                        <div className="flex justify-between mb-4">
                                            <div className="flex space-x-2">
                                                <select
                                                    value={filterType}
                                                    onChange={(e) => setFilterType(e.target.value)}
                                                    className="rounded-md border-gray-300 text-sm"
                                                >
                                                    <option value="all">All Tests</option>
                                                    <option value="normal">Normal</option>
                                                    <option value="abnormal">Abnormal</option>
                                                </select>
                                                <button
                                                    onClick={exportTests}
                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                >
                                                    <DocumentIcon className="h-4 w-4 mr-1" />
                                                    Export
                                                </button>
                                            </div>
                                        </div>

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
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Notes
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {selectedDateTests.length > 0 && getSortedAndFilteredTests(selectedDateTests).map(test => (
                                                    <tr key={test.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {test.testType}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span className={test.isAbnormal ? 'text-red-600 font-medium' : ''}>
                                                                {test.testValue}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {test.isAbnormal ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    <ExclamationCircleIcon className="mr-1 h-4 w-4" />
                                                                    Abnormal
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Normal
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <input
                                                                type="text"
                                                                value={noteInput[test.id] || test.notes || ''}
                                                                onChange={(e) => setNoteInput({
                                                                    ...noteInput,
                                                                    [test.id]: e.target.value
                                                                })}
                                                                placeholder="Add notes..."
                                                                className="text-sm border-gray-300 rounded-md w-full"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Trend Chart */}
                                    {selectedDateTests.length > 0 && (
                                        <div className="mt-6 border-t border-gray-200 pt-4">
                                            <h4 className="text-md font-medium text-gray-900 mb-4">Trend Analysis</h4>
                                            {getSortedAndFilteredTests(selectedDateTests).map(test => {
                                                const trendData = getTestTrend(test.testType);
                                                return trendData.length > 1 ? (
                                                    <div key={test.id} className="mb-6">
                                                        <h5 className="text-sm font-medium text-gray-700 mb-2">{test.testType} Trend</h5>
                                                        <div className="h-64">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <LineChart data={trendData}>
                                                                    <CartesianGrid strokeDasharray="3 3" />
                                                                    <XAxis 
                                                                        dataKey="date"
                                                                        tickFormatter={(date) => format(new Date(date), 'MMM d')}
                                                                    />
                                                                    <YAxis />
                                                                    <Tooltip 
                                                                        labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                                                                    />
                                                                    <Line 
                                                                        type="monotone" 
                                                                        dataKey="value" 
                                                                        stroke="#4F46E5" 
                                                                        name={test.testType}
                                                                    />
                                                                </LineChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key={test.id} className="mb-4">
                                                        <p className="text-sm text-gray-500">Not enough data for {test.testType} trend analysis.</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default TestHistory; 