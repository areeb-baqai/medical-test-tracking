import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

// Add authentication debug logs
const debugAuth = true;
const logAuth = (...args: any[]) => {
    if (debugAuth) console.log('[Auth]', ...args);
};

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    loading: boolean;
    refreshAuth: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add a type guard to validate User object
const isValidUser = (user: any): user is User => {
    return (
        user &&
        typeof user === 'object' &&
        typeof user.id === 'number' &&
        typeof user.email === 'string' &&
        typeof user.firstName === 'string' &&
        typeof user.lastName === 'string'
    );
};

// Helper functions for localStorage
const saveUserToStorage = (user: User) => {
    if (isValidUser(user)) {
        localStorage.setItem('user', JSON.stringify(user));
        logAuth('User saved to storage:', user.id);
    } else {
        logAuth('Attempted to save invalid user data');
        localStorage.removeItem('user');
    }
};

const getUserFromStorage = (): User | null => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) return null;

        const parsedUser = JSON.parse(userData);
        
        // Validate the parsed user data
        if (!isValidUser(parsedUser)) {
            logAuth('Invalid user data in storage, clearing...');
            localStorage.removeItem('user');
            return null;
        }

        logAuth('Valid user loaded from storage:', parsedUser.id);
        return parsedUser;
    } catch (e) {
        logAuth('Error parsing user data from storage, clearing...');
        localStorage.removeItem('user');
        return null;
    }
};

const clearUserFromStorage = () => {
    localStorage.removeItem('user');
    logAuth('User cleared from storage');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize user state from localStorage for a faster initial render
    const [user, setUser] = useState<User | null>(() => getUserFromStorage());
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getUserFromStorage());
    const [loading, setLoading] = useState(true);
    const authCheckPerformed = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Function to refresh authentication status
    const refreshAuth = useCallback(async () => {
        logAuth('Refreshing authentication');
        try {
            const response = await api.get('/auth/profile');
            const userData = response.data;
            setUser(userData);
            setIsAuthenticated(true);
            saveUserToStorage(userData);
            logAuth('Authentication refreshed successfully');
            return userData;
        } catch (error) {
            logAuth('Authentication refresh failed', error);
            setUser(null);
            setIsAuthenticated(false);
            clearUserFromStorage();
            return null;
        }
    }, []);

    // Create a stable logout function with useCallback
    const logout = useCallback(async () => {
        logAuth('Logging out');
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Clear auth state regardless of API call success
            setUser(null);
            setIsAuthenticated(false);
            clearUserFromStorage();
            navigate('/signin');
            logAuth('Logged out successfully');
        }
    }, [navigate]);

    // Check auth status only once when the app loads
    useEffect(() => {
        let isMounted = true;
        
        if (authCheckPerformed.current) {
            logAuth('Auth check already performed, skipping');
            return;
        }
        
        const checkAuthStatus = async () => {
            logAuth('Checking auth status');
            setLoading(true);
            
            try {
                const response = await api.get('/auth/profile');
                
                // Only update state if component is still mounted
                if (isMounted) {
                    const userData = response.data;
                    setUser(userData);
                    setIsAuthenticated(true);
                    saveUserToStorage(userData);
                    logAuth('Auth check successful, user is authenticated');
                }
            } catch (error) {
                // Only update state if component is still mounted
                if (isMounted) {
                    logAuth('Auth check failed, clearing state');
                    setUser(null);
                    setIsAuthenticated(false);
                    clearUserFromStorage();
                    
                    // Only redirect if we're not already on auth pages
                    const path = location.pathname;
                    if (path !== '/signin' && path !== '/signup') {
                        navigate('/signin', { replace: true });
                    }
                }
            } finally {
                // Only update state if component is still mounted
                if (isMounted) {
                    setLoading(false);
                    authCheckPerformed.current = true;
                    logAuth('Auth check completed');
                }
            }
        };

        checkAuthStatus();
        
        // Cleanup function to prevent state updates after unmount
        return () => {
            isMounted = false;
            logAuth('Auth provider unmounted');
        };
    }, [navigate, location]);

    const login = useCallback((userData: User) => {
        logAuth('Login called with user:', userData.id);
        setUser(userData);
        setIsAuthenticated(true);
        saveUserToStorage(userData);
    }, []);

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...userData } : null);
    };

    const contextValue = {
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        refreshAuth,
        updateUser
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 