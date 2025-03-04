import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

interface TestStats {
    lastTestDate: string;
    totalTests: number;
}

interface TestStatsContextType {
    stats: TestStats;
    refreshStats: () => Promise<void>;
}

const TestStatsContext = createContext<TestStatsContextType | undefined>(undefined);

export const TestStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stats, setStats] = useState<TestStats>({
        lastTestDate: "Not available",
        totalTests: 0
    });

    const refreshStats = useCallback(async () => {
        try {
            const response = await api.get('/api/tests/stats');
            setStats({
                lastTestDate: response.data.lastTestDate || "Not available",
                totalTests: response.data.totalTests || 0
            });
        } catch (err) {
            console.error("Failed to refresh test statistics:", err);
        }
    }, []);

    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    return (
        <TestStatsContext.Provider value={{ stats, refreshStats }}>
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