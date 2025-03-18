import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QueryClient } from '@tanstack/react-query';

// Define query keys for better cache management
export const queryKeys = {
  user: 'user',
  medicalData: 'medicalData',
  stats: 'stats',
};

// Use a consistent key for medical data
const MEDICAL_DATA_KEY = 'user-medical-data';

// Update the React Query configuration to be more aggressive with caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,    // Don't refetch on mount - important!
      retry: 1,
    },
  },
});

// Hook for fetching medical data with improved caching
export const useMedicalData = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  return useQuery({
    queryKey: [queryKeys.medicalData, userId],
    queryFn: () => api.get(`/medical-form/${userId}`).then(res => res.data),
    enabled: !!userId,
    staleTime: Infinity,           // Never consider it stale automatically
    refetchOnWindowFocus: false,   // Don't refetch when the window regains focus
    refetchOnMount: false,         // Don't refetch when the component mounts
    refetchOnReconnect: false,     // Don't refetch when reconnecting
  });
};

// Hook for fetching stats data with improved caching
export const useStats = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  return useQuery({
    queryKey: [queryKeys.stats, userId],
    queryFn: () => api.get(`/api/tests/stats`).then(res => res.data),
    staleTime: Infinity,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// Hook for submitting medical form data with proper cache invalidation
export const useSubmitMedicalForm = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (formData: any) => {
      // Create an array of promises for each test
      const submissions = formData.tests
        .filter((field: any) => field.value !== '')
        .map((field: any) => {
          return api.post('/medical-form', {
            testType: field.testType,
            testValue: parseFloat(field.value),
            testDate: formData.testDate,
            userId: formData.userId || user?.id,
            isAbnormal: field.isAbnormal
          });
        });
      
      return Promise.all(submissions);
    },
  });
}; 