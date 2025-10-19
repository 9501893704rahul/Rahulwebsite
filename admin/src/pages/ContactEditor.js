import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Mail, Phone, MapPin, Globe, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ContactEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const fetchContactContent = async () => {
        try {
            const response = await api.get('/api/content/contact');
            const data = response.data;
            
            // Set form values
            setValue('email', data.email || '');
            setValue('phone', data.phone || '');
            setValue('location', data.location || '');
            setValue('availability', data.availability || '');
            setValue('responseTime', data.responseTime || '');
            setValue('workingHours', data.workingHours || '');
            setValue('timezone', data.timezone || '');
            
            // Social links
            setValue('github', data.socialLinks?.github || '');
            setValue('linkedin', data.socialLinks?.linkedin || '');
            setValue('twitter', data.socialLinks?.twitter || '');
            setValue('instagram', data.socialLinks?.instagram || '');
            setValue('website', data.socialLinks?.website || '');
            
            // Contact form settings
            setValue('formTitle', data.formSettings?.title || '');
            setValue('formDescription', data.formSettings?.description || '');
            setValue('successMessage', data.formSettings?.successMessage || '');
            setValue('emailNotifications', data.formSettings?.emailNotifications || false);
            
        } catch (error) {
            console.error('Error fetching contact content:', error);
            toast.error('Failed to load contact content');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchContactContent();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const contactData = {
                email: data.email,
                phone: data.phone,
                location: data.location,
                availability: data.availability,
                responseTime: data.responseTime,
                workingHours: data.workingHours,
                timezone: data.timezone,
                socialLinks: {
                    github: data.github,
                    linkedin: data.linkedin,
                    twitter: data.twitter,
                    instagram: data.instagram,
                    website: data.website
                },
                formSettings: {
                    title: data.formTitle,
                    description: data.formDescription,
                    successMessage: data.successMessage,
                    emailNotifications: data.emailNotifications
                }
            };

            await api.put('/api/content/contact', contactData);
            toast.success('Contact information updated successfully!');
        } catch (error) {
            console.error('Error updating contact content:', error);
            toast.error('Failed to update contact information');
        } finally {
            setLoading(false);
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
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Mail className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Contact Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Basic Contact Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="your.email@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    {...register('phone')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    {...register('location')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="City, Country"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timezone
                                </label>
                                <input
                                    type="text"
                                    {...register('timezone')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., UTC+5:30, EST"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Availability Information */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Availability & Response Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability Status
                                </label>
                                <select
                                    {...register('availability')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Available for new projects">Available for new projects</option>
                                    <option value="Open to opportunities">Open to opportunities</option>
                                    <option value="Partially available">Partially available</option>
                                    <option value="Currently unavailable">Currently unavailable</option>
                                    <option value="Available for freelance">Available for freelance</option>
                                    <option value="Available for full-time">Available for full-time</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Response Time
                                </label>
                                <input
                                    type="text"
                                    {...register('responseTime')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Usually within 24 hours"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Working Hours
                                </label>
                                <input
                                    type="text"
                                    {...register('workingHours')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 9 AM - 6 PM IST"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Social Media & Professional Links
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Github className="h-4 w-4" />
                                    GitHub Profile
                                </label>
                                <input
                                    type="url"
                                    {...register('github')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn Profile
                                </label>
                                <input
                                    type="url"
                                    {...register('linkedin')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Twitter className="h-4 w-4" />
                                    Twitter Profile
                                </label>
                                <input
                                    type="url"
                                    {...register('twitter')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://twitter.com/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Instagram className="h-4 w-4" />
                                    Instagram Profile
                                </label>
                                <input
                                    type="url"
                                    {...register('instagram')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://instagram.com/username"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    Personal Website
                                </label>
                                <input
                                    type="url"
                                    {...register('website')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Settings */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Form Settings
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Form Title
                                </label>
                                <input
                                    type="text"
                                    {...register('formTitle')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Get In Touch"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Form Description
                                </label>
                                <textarea
                                    {...register('formDescription')}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Brief description that appears above the contact form"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Success Message
                                </label>
                                <textarea
                                    {...register('successMessage')}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Message shown after successful form submission"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('emailNotifications')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Enable email notifications for new contact form submissions
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
                            {loading ? 'Saving...' : 'Save Contact Information'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactEditor;