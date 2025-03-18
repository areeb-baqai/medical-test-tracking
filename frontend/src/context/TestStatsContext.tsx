import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

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
    testParameters: Record<string, any>;
}

const TestStatsContext = createContext<TestStatsContextProps | undefined>(undefined);

// Get stored parameters - merging defaults with custom values
const getStoredParameters = () => {
    const stored = localStorage.getItem(STORED_TESTS_KEY);
    return stored ? { ...CBC_PARAMETERS, ...JSON.parse(stored) } : CBC_PARAMETERS;
};

export const TestStatsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFilter, setSelectedFilter] = useState<string>('week');
    
    // Initialize with BOTH default and stored parameters
    const [testParameters, setTestParameters] = useState(() => getStoredParameters());
    
    // Make available test types derived from the merged parameters
    const [availableTestTypes, setAvailableTestTypes] = useState<string[]>(() => 
        Object.keys(testParameters)
    );

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/tests/stats`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchStats();
        }
    }, [user, selectedFilter]);

    const refreshStats = async () => {
        await fetchStats();
    };

    const updateAvailableTestTypes = (newTypes: string[]) => {
        setAvailableTestTypes(prev => {
            const combined = [...prev, ...newTypes];
            return Array.from(new Set(combined)).sort(); // Using Array.from instead of spread
        });
    };

    const updateTestParameters = useCallback((newParameters: any) => {
        const mergedParameters = { ...testParameters, ...newParameters };
        setTestParameters(mergedParameters);
        setAvailableTestTypes(Object.keys(mergedParameters));
        localStorage.setItem(STORED_TESTS_KEY, JSON.stringify(mergedParameters));
    }, [testParameters]);

    return (
        <TestStatsContext.Provider value={{ 
            stats, 
            loading, 
            refreshStats, 
            availableTestTypes,
            updateAvailableTestTypes,
            updateTestParameters,
            selectedFilter,
            setSelectedFilter,
            testParameters
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