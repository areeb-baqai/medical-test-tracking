import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Import the CBC parameters from constants
import { CBC_PARAMETERS } from '../constants/testParameters';

// Key for stored test parameters
const STORED_TESTS_KEY = 'tibbtrack_test_parameters';

interface TestStats {
    lastTestDate: string;
    totalTests: number;
}

interface TestStatsContextProps {
    stats: any;
    loading: boolean;
    refreshStats: () => Promise<void>;
    availableTestTypes: string[];
    updateAvailableTestTypes: (newTypes: string[]) => void;
    updateTestParameters: (parameters: Record<string, any>) => void;
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
}

const TestStatsContext = createContext<TestStatsContextProps | undefined>(undefined);

export const TestStatsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [availableTestTypes, setAvailableTestTypes] = useState<string[]>(() => {
        // Initialize with stored test types from localStorage
        const storedParams = localStorage.getItem(STORED_TESTS_KEY);
        const parameters = storedParams ? JSON.parse(storedParams) : CBC_PARAMETERS;
        return Object.keys(parameters);
    });
    const [selectedFilter, setSelectedFilter] = useState<string>('');

    const fetchStats = async () => {
        try {
            setLoading(true);
            const filter = selectedFilter ? `?testType=${selectedFilter}` : '';
            const response = await api.get(`/api/tests/stats${filter}`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [selectedFilter]); // Refetch when filter changes

    const refreshStats = async () => {
        await fetchStats();
    };

    const updateAvailableTestTypes = (newTypes: string[]) => {
        setAvailableTestTypes(prev => {
            const combined = [...prev, ...newTypes];
            return Array.from(new Set(combined)).sort(); // Using Array.from instead of spread
        });
    };

    const updateTestParameters = (parameters: Record<string, any>) => {
        // Update local storage
        const storedParams = localStorage.getItem(STORED_TESTS_KEY);
        const existingParams = storedParams ? JSON.parse(storedParams) : {};
        const updatedParams = { ...existingParams, ...parameters };
        localStorage.setItem(STORED_TESTS_KEY, JSON.stringify(updatedParams));
        
        // Update available test types
        updateAvailableTestTypes(Object.keys(parameters));
    };

    return (
        <TestStatsContext.Provider value={{ 
            stats, 
            loading, 
            refreshStats, 
            availableTestTypes,
            updateAvailableTestTypes,
            updateTestParameters,
            selectedFilter,
            setSelectedFilter
        }}>
            {children}
        </TestStatsContext.Provider>
    );
};

export const useTestStats = () => {
    const context = useContext(TestStatsContext);
    if (context === undefined) {
        throw new Error('useTestStats must be used within a TestStatsProvider');
    }
    return context;
}; 