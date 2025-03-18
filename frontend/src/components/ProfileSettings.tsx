import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from './common/Button';
import Input from './common/Input';
import Select from './common/Select';

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
                const response = await api.getProfile();
                setProfileData(response.data);
            } catch (err) {
                setError('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
            const response = await api.updateProfile(profileData);
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
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header - Responsive text sizes */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="mt-1 text-sm md:text-base text-gray-600">
                        Manage your personal information and health details
                    </p>
                </div>

                {/* Notifications - Stack on mobile */}
                <div className="space-y-4 mb-6">
                    {showSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 animate-fade-in shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-4 w-4 md:h-5 md:w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">Profile updated successfully</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-4 w-4 md:h-5 md:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Grid - Stack on mobile, side-by-side on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Horizontal on mobile, vertical on desktop */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* User Info Section */}
                            <div className="p-4 md:p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                                <div className="flex items-center md:block text-center">
                                    <div className="inline-flex items-center justify-center h-12 w-12 md:h-16 md:w-16 rounded-full bg-white text-indigo-600 text-lg md:text-xl font-bold mx-auto">
                                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                    </div>
                                    <div className="ml-4 md:ml-0 md:mt-4">
                                        <h2 className="text-base md:text-lg font-semibold">{user?.firstName} {user?.lastName}</h2>
                                        <p className="text-sm text-indigo-100">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="p-2 md:p-4">
                                <nav className="flex md:flex-col gap-2">
                                    <button
                                        onClick={() => setActiveTab('personal')}
                                        className={`flex-1 md:flex-none flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'personal'
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="mr-2 h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Personal Information
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('medical')}
                                        className={`flex-1 md:flex-none flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            activeTab === 'medical'
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="mr-2 h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Medical Information
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="border-b border-gray-200 px-4 py-4 md:px-6 md:py-4">
                                <h2 className="text-lg font-medium text-gray-900">
                                    {activeTab === 'personal' ? 'Personal Information' : 'Medical Information'}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 md:p-6">
                                {/* Form fields with responsive grid */}
                                <div className="space-y-6">
                                    {activeTab === 'personal' && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <Input
                                                    type="text"
                                                    name="firstName"
                                                    value={profileData.firstName}
                                                    onChange={handleChange}
                                                    label="First Name"
                                                    required
                                                />
                                                <Input
                                                    type="text"
                                                    name="lastName"
                                                    value={profileData.lastName}
                                                    onChange={handleChange}
                                                    label="Last Name"
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <Input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleChange}
                                                    label="Email Address"
                                                    required
                                                />
                                            </div>
                                            <div className="mt-4">
                                                <Input
                                                    type="tel"
                                                    name="phone"
                                                    value={profileData.phone || ''}
                                                    onChange={handleChange}
                                                    label="Phone Number"
                                                    helperText="Format: +1 123-456-7890 (optional)"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
                                                <Input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={profileData.dateOfBirth || ''}
                                                    onChange={handleChange}
                                                    label="Date of Birth"
                                                />
                                                <Select
                                                    name="gender"
                                                    value={profileData.gender || ''}
                                                    onChange={handleChange}
                                                    label="Gender"
                                                    options={[
                                                        { value: '', label: 'Select gender' },
                                                        { value: 'male', label: 'Male' },
                                                        { value: 'female', label: 'Female' },
                                                        { value: 'other', label: 'Other' }
                                                    ]}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'medical' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <Input
                                                    type="number"
                                                    name="height"
                                                    value={profileData.height || ''}
                                                    onChange={handleChange}
                                                    label="Height (cm)"
                                                />
                                                <Input
                                                    type="number"
                                                    name="weight"
                                                    value={profileData.weight || ''}
                                                    onChange={handleChange}
                                                    label="Weight (kg)"
                                                />
                                            </div>
                                            <Select
                                                name="bloodType"
                                                value={profileData.bloodType || ''}
                                                onChange={handleChange}
                                                label="Blood Type"
                                                options={[
                                                    { value: '', label: 'Select blood type' },
                                                    { value: 'A+', label: 'A+' },
                                                    { value: 'A-', label: 'A-' },
                                                    { value: 'B+', label: 'B+' },
                                                    { value: 'B-', label: 'B-' },
                                                    { value: 'AB+', label: 'AB+' },
                                                    { value: 'AB-', label: 'AB-' },
                                                    { value: 'O+', label: 'O+' },
                                                    { value: 'O-', label: 'O-' }
                                                ]}
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Allergies
                                                </label>
                                                <textarea
                                                    name="allergies"
                                                    value={profileData.allergies || ''}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="List any medical conditions here..."
                                                />
                                                <p className="mt-1 text-xs text-gray-500">
                                                    Include diagnosed conditions and ongoing treatments
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button - Full width on mobile, auto width on desktop */}
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        isLoading={isSaving}
                                        disabled={isSaving}
                                        className="w-full md:w-auto"
                                    >
                                        Save Changes
                                    </Button>
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