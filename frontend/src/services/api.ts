import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000';

// Create axios instance with defaults
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // This is crucial for cookies to be sent!
    timeout: 10000,
});

// Flag to prevent multiple refresh calls
let isRefreshing = false;
// Store all the requests that failed due to 401
let failedQueue: any[] = [];

// Process the queue of failed requests
const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    
    failedQueue = [];
};

// Response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Skip refresh requests to prevent loops
        if (originalRequest.url === '/auth/refresh') {
            return Promise.reject(error);
        }
        
        // If the error is due to an expired token (401) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, add request to queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Try to refresh the token
                await api.post('/auth/refresh');
                
                // Process queue of pending requests
                processQueue();
                
                // If refresh was successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, handle logout
                processQueue(refreshError);
                
                // If it's a refresh token issue, redirect to login
                if (window.location.pathname !== '/signin') {
                    window.location.href = '/signin';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

export default api; 