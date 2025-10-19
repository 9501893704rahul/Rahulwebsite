import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Settings, Eye, EyeOff, Key, Globe, Palette, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const SettingsEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

    const fetchSettingsContent = async () => {
        try {
            const response = await api.get('/api/content/settings');
            const data = response.data;
            
            // Set form values
            setValue('siteTitle', data.siteTitle || '');
            setValue('siteDescription', data.siteDescription || '');
            setValue('siteKeywords', data.siteKeywords || '');
            setValue('googleAnalytics', data.googleAnalytics || '');
            setValue('favicon', data.favicon || '');
            setValue('logo', data.logo || '');
            setValue('primaryColor', data.theme?.primaryColor || '#3B82F6');
            setValue('secondaryColor', data.theme?.secondaryColor || '#1F2937');
            setValue('accentColor', data.theme?.accentColor || '#10B981');
            setValue('maintenanceMode', data.maintenanceMode || false);
            setValue('allowRegistration', data.allowRegistration || false);
            setValue('enableComments', data.enableComments || false);
            setValue('enableNewsletter', data.enableNewsletter || false);
            
        } catch (error) {
            console.error('Error fetching settings content:', error);
            toast.error('Failed to load settings');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchSettingsContent();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const settingsData = {
                siteTitle: data.siteTitle,
                siteDescription: data.siteDescription,
                siteKeywords: data.siteKeywords,
                googleAnalytics: data.googleAnalytics,
                favicon: data.favicon,
                logo: data.logo,
                theme: {
                    primaryColor: data.primaryColor,
                    secondaryColor: data.secondaryColor,
                    accentColor: data.accentColor
                },
                maintenanceMode: data.maintenanceMode,
                allowRegistration: data.allowRegistration,
                enableComments: data.enableComments,
                enableNewsletter: data.enableNewsletter
            };

            await api.put('/api/content/settings', settingsData);
            toast.success('Settings updated successfully!');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (data) => {
        if (!data.currentPassword || !data.newPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            await api.post('/api/change-password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            
            toast.success('Password changed successfully!');
            reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('Failed to change password. Please check your current password.');
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Settings className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Site Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Site Information
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Title
                                </label>
                                <input
                                    type="text"
                                    {...register('siteTitle')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Rahul Thakur - Portfolio"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Description
                                </label>
                                <textarea
                                    {...register('siteDescription')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Brief description of your website for SEO"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SEO Keywords (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    {...register('siteKeywords')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="web developer, .NET, Angular, portfolio"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Favicon URL
                                    </label>
                                    <input
                                        type="url"
                                        {...register('favicon')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="/favicon.ico"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Logo URL
                                    </label>
                                    <input
                                        type="url"
                                        {...register('logo')}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="/images/logo.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Settings */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Theme & Appearance
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primary Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        {...register('primaryColor')}
                                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...register('primaryColor')}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="#3B82F6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Secondary Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        {...register('secondaryColor')}
                                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...register('secondaryColor')}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="#1F2937"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Accent Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        {...register('accentColor')}
                                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...register('accentColor')}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="#10B981"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics & Tracking */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Analytics & Tracking
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Analytics Tracking ID
                            </label>
                            <input
                                type="text"
                                {...register('googleAnalytics')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Enter your Google Analytics tracking ID to enable website analytics
                            </p>
                        </div>
                    </div>

                    {/* Feature Toggles */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Feature Settings
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('maintenanceMode')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    <span className="font-medium">Maintenance Mode</span>
                                    <span className="block text-gray-500">Show maintenance page to visitors</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('enableComments')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    <span className="font-medium">Enable Comments</span>
                                    <span className="block text-gray-500">Allow visitors to leave comments on projects</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('enableNewsletter')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    <span className="font-medium">Newsletter Subscription</span>
                                    <span className="block text-gray-500">Show newsletter signup form</span>
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('allowRegistration')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    <span className="font-medium">Allow User Registration</span>
                                    <span className="block text-gray-500">Allow new users to register accounts</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Shield className="h-6 w-6 text-red-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Change Password
                    </h3>
                    
                    <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    {...register('currentPassword')}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showCurrentPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...register('newPassword', {
                                        minLength: {
                                            value: 6,
                                            message: 'Password must be at least 6 characters'
                                        }
                                    })}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showNewPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit(handlePasswordChange)}
                                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <Key className="h-4 w-4" />
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsEditor;