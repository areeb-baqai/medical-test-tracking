import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center p-4">
            <div className="max-w-5xl w-full mx-auto flex rounded-2xl shadow-xl overflow-hidden bg-white">
                {/* Left Side - Branding & Info */}
                <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-56 h-56 bg-indigo-500 opacity-10 rounded-full translate-x-1/4 translate-y-1/4"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center mb-16">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="ml-2 text-2xl font-bold text-white">TibbTrack</span>
                        </div>
                        
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold leading-tight text-white">
                                Welcome Back!
                            </h1>
                            <p className="text-indigo-100 text-lg leading-relaxed">
                                Continue your journey to better health monitoring and wellness tracking.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-indigo-500/30">
                            <div className="flex items-center space-x-3 text-indigo-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-sm">Secure & Encrypted Data Protection</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign In Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
                            <p className="mt-2 text-gray-600">Access your health dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-lg text-white text-sm font-semibold
                                    ${isLoading 
                                        ? 'bg-indigo-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/50'
                                    } transition duration-200`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : 'Sign in'}
                            </button>

                            <div className="text-center">
                                <Link 
                                    to="/signup" 
                                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition duration-200"
                                >
                                    Don't have an account? Create one now
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn; 