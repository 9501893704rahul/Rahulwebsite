import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, User, Award, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const AboutEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const fetchAboutContent = async () => {
        try {
            const response = await api.get('/api/content/about');
            const data = response.data;
            
            // Set form values
            setValue('overview', data.overview || '');
            setValue('description', data.description || '');
            setValue('name', data.personalInfo?.name || '');
            setValue('experience', data.personalInfo?.experience || '');
            setValue('location', data.personalInfo?.location || '');
            setValue('availability', data.personalInfo?.availability || '');
            setValue('degree', data.education?.degree || '');
            setValue('university', data.education?.university || '');
            setValue('graduationYear', data.education?.graduationYear || '');
            setValue('certifications', data.certifications?.join('\n') || '');
            setValue('strengths', data.keyStrengths?.map(s => `${s.title}: ${s.description}`).join('\n') || '');
            
        } catch (error) {
            console.error('Error fetching about content:', error);
            toast.error('Failed to load about content');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchAboutContent();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Parse certifications and strengths
            const certifications = data.certifications.split('\n').filter(cert => cert.trim());
            const strengthsArray = data.strengths.split('\n').filter(s => s.trim()).map(strength => {
                const [title, ...descParts] = strength.split(':');
                return {
                    title: title.trim(),
                    description: descParts.join(':').trim()
                };
            });

            const aboutData = {
                overview: data.overview,
                description: data.description,
                personalInfo: {
                    name: data.name,
                    experience: data.experience,
                    location: data.location,
                    availability: data.availability
                },
                education: {
                    degree: data.degree,
                    university: data.university,
                    graduationYear: data.graduationYear
                },
                certifications,
                keyStrengths: strengthsArray
            };

            await api.put('/api/content/about', aboutData);
            toast.success('About section updated successfully!');
        } catch (error) {
            console.error('Error updating about content:', error);
            toast.error('Failed to update about section');
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
                    <User className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">About Section</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Professional Overview */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Overview</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Overview Title
                                </label>
                                <input
                                    type="text"
                                    {...register('overview', { required: 'Overview title is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Professional Overview"
                                />
                                {errors.overview && (
                                    <p className="mt-1 text-sm text-red-600">{errors.overview.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Write your professional description..."
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Name is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience
                                </label>
                                <input
                                    type="text"
                                    {...register('experience', { required: 'Experience is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 5+ Years"
                                />
                                {errors.experience && (
                                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    {...register('location', { required: 'Location is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., India"
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Availability
                                </label>
                                <input
                                    type="text"
                                    {...register('availability', { required: 'Availability is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Open to Opportunities"
                                />
                                {errors.availability && (
                                    <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Degree
                                </label>
                                <input
                                    type="text"
                                    {...register('degree')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Bachelor's in Computer Science"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    University
                                </label>
                                <input
                                    type="text"
                                    {...register('university')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="University Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Graduation Year
                                </label>
                                <input
                                    type="text"
                                    {...register('graduationYear')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2015-2019"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Certifications */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Certifications (one per line)
                            </label>
                            <textarea
                                {...register('certifications')}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Microsoft Certified Developer&#10;Angular Certification&#10;Azure Fundamentals"
                            />
                            <p className="mt-1 text-sm text-gray-500">Enter each certification on a new line</p>
                        </div>
                    </div>

                    {/* Key Strengths */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Strengths</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Strengths (Title: Description format, one per line)
                            </label>
                            <textarea
                                {...register('strengths')}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full-Stack Development: Expertise in both frontend and backend technologies&#10;AI & Machine Learning: Integration of AI solutions in web applications&#10;Team Leadership: Leading development teams and mentoring junior developers"
                            />
                            <p className="mt-1 text-sm text-gray-500">Format: "Title: Description" (one per line)</p>
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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AboutEditor;