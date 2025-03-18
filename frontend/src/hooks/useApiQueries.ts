import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Define query keys for better cache management
export const queryKeys = {
  user: 'user',
  medicalData: 'medicalData',
  stats: 'stats',
};

// Use a consistent key for medical data
const MEDICAL_DATA_KEY = 'user-medical-data';

// Hook for fetching medical data with user context
export const useMedicalData = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  return useQuery({
    queryKey: [queryKeys.medicalData, 'medical-data'],
    queryFn: () => api.get(`/medical-form/${userId}`).then(res => res.data),
    enabled: !!userId,
  });
};

// Hook for fetching stats data
export const useStats = () => {
  return useQuery({
    queryKey: [queryKeys.stats, 'timeFilter'],
    queryFn: () => api.get(`/api/tests/stats`).then(res => res.data),
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