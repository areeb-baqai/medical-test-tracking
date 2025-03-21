import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Button from './common/Button';
import Input from './common/Input';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });
            navigate('/signin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-white flex items-center justify-center p-4">
            <div className="max-w-5xl w-full mx-auto flex rounded-2xl shadow-xl overflow-hidden bg-white">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12">
                    <div className="w-full max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Create your TibbTrack account</h2>
                            <p className="mt-2 text-gray-600">Start your health journey today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    label="First Name"
                                    required
                                />
                                <Input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    label="Last Name"
                                    required
                                />
                            </div>

                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                label="Email"
                                placeholder="Enter your email"
                                required
                            />

                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                label="Password"
                                placeholder="••••••••"
                                required
                            />

                            <Input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                label="Confirm Password"
                                placeholder="••••••••"
                                required
                            />

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                variant="primary"
                                isLoading={isLoading}
                                isFullWidth={true}
                            >
                                Create account
                            </Button>

                            <div className="text-center">
                                <Link 
                                    to="/signin" 
                                    className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition duration-200"
                                >
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side - Branding & Info */}
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
                                Join Our Health Community
                            </h1>
                            <p className="text-indigo-100 text-lg leading-relaxed">
                                Track your health metrics, set goals, and monitor your progress all in one place.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-indigo-500/30">
                            <div className="flex items-center space-x-3 text-indigo-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-sm">Your data is secure and private</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp; 