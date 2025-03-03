import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
            });
            
            // With HTTP-only cookies, we don't need to manually store tokens
            // But we do store user data in context and localStorage for UI purposes
            login(response.data.user);
            
            // Navigate to the requested page or dashboard
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-100 to-blue-300 p-8 flex flex-col justify-center relative overflow-hidden">
                {/* Medical Icon Background Elements */}
                <div className="absolute top-10 left-10 text-white opacity-20">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 text-white opacity-20">
                    <svg className="h-24 w-24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.5 12H9v-1.5h1.5V15zm0-4H9V9.5h1.5V11zm3 4h-1.5v-1.5H13V15zm0-4h-1.5V9.5H13V11z" />
                    </svg>
                </div>
                
                <div className="max-w-md mx-auto z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-xl">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-2">
                            <svg className="text-blue-500" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">WELCOME BACK</h1>
                        <p className="text-gray-600">Personal Health Center</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <div className="flex items-center border border-gray-300 bg-white rounded-md overflow-hidden">
                                <div className="p-2 text-gray-400">
                                    {/* User icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="block w-full p-2 focus:outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <div className="mb-6 relative">
                            <div className="flex items-center border border-gray-300 bg-white rounded-md overflow-hidden">
                                <div className="p-2 text-gray-400">
                                    {/* Lock icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="block w-full p-2 focus:outline-none"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`w-full py-3 bg-blue-500 text-white rounded-md font-medium transition-colors ${
                                !isLoading ? 'hover:bg-blue-600' : 'opacity-70 cursor-not-allowed'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Login'}
                        </button>
                        
                        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                    </form>
                    
                    <div className="mt-6 flex justify-center space-x-4">
                        <img src="/qrcode-placeholder.png" alt="QR Code" className="h-10 w-10 opacity-70" />
                        <img src="/qrcode-placeholder.png" alt="QR Code" className="h-10 w-10 opacity-70" />
                    </div>
                </div>
            </div>
            
            {/* Right Side - Image */}
            <div className="hidden md:block md:w-1/2 bg-blue-50">
                <div className="h-full w-full relative">
                    <img 
                        src="/doctor-stethoscope.jpg" 
                        alt="Healthcare Professional" 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60';
                        }}
                    />
                    <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
                </div>
            </div>
        </div>
    );
};

export default SignIn; 