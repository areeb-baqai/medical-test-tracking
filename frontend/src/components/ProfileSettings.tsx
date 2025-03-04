import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    height?: number;
    weight?: number;
    bloodType?: string;
    allergies?: string;
    medicalConditions?: string;
}

const ProfileSettings: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
    });
    
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/users/${user?.id}/profile`);
                setProfileData(response.data);
            } catch (err) {
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setProfileData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        try {
            const response = await api.put(`/users/${user?.id}/profile`, profileData);
            updateUser(response.data);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your personal information and health details
                    </p>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">Profile updated successfully</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white text-indigo-600 text-xl font-bold">
                                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                </div>
                                <h2 className="mt-4 text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
                                <p className="mt-1 text-sm text-indigo-100">{user?.email}</p>
                            </div>
                            <div className="p-4">
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab('personal')}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                                            activeTab === 'personal'
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Information
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('medical')}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                                            activeTab === 'medical'
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Medical Information
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-900">Profile Tips</h3>
                            <ul className="mt-4 space-y-4 text-sm text-gray-600">
                                <li className="flex">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Keep your medical information up-to-date for accurate health tracking
                                </li>
                                <li className="flex">
                                    <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Your personal data is encrypted and securely stored
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {activeTab === 'personal' ? 'Personal Information' : 'Medical Information'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                {activeTab === 'personal' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={profileData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={profileData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone || ''}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Format: +1 123-456-7890 (optional)
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Date of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={profileData.dateOfBirth || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Gender
                                                </label>
                                                <select
                                                    name="gender"
                                                    value={profileData.gender || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                >
                                                    <option value="">Select gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'medical' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Height (cm)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={profileData.height || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Weight (kg)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="weight"
                                                    value={profileData.weight || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Blood Type
                                            </label>
                                            <select
                                                name="bloodType"
                                                value={profileData.bloodType || ''}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            >
                                                <option value="">Select blood type</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Allergies
                                            </label>
                                            <textarea
                                                name="allergies"
                                                value={profileData.allergies || ''}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                                                placeholder="List any allergies here..."
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                E.g., medications, foods, environmental factors
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Medical Conditions
                                            </label>
                                            <textarea
                                                name="medicalConditions"
                                                value={profileData.medicalConditions || ''}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                                                placeholder="List any medical conditions here..."
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                Include diagnosed conditions and ongoing treatments
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex items-center justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={`
                                            flex items-center justify-center px-4 py-2
                                            border border-transparent rounded-md shadow-sm
                                            text-sm font-medium text-white
                                            bg-indigo-600 hover:bg-indigo-700 
                                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                                            transition-colors duration-200
                                            ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings; 