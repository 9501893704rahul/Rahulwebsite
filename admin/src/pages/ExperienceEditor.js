import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Briefcase, Plus, Trash2, Edit3, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ExperienceEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [experiences, setExperiences] = useState([]);
    const [editingExperience, setEditingExperience] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchExperienceContent = async () => {
        try {
            const response = await api.get('/content/experience');
            const data = response.data;
            
            // Convert experience array and add IDs - API returns array directly
            const experienceArray = (Array.isArray(data) ? data : []).map((exp, index) => ({
                id: exp.id || Date.now() + index,
                ...exp
            }));
            
            setExperiences(experienceArray);
        } catch (error) {
            console.error('Error fetching experience content:', error);
            toast.error('Failed to load experience content');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchExperienceContent();
    }, []);

    const onSubmit = async (data) => {
        const responsibilities = data.responsibilities.split('\n').filter(resp => resp.trim());
        const technologies = data.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
        
        const newExperience = {
            id: editingExperience ? editingExperience.id : Date.now() + Math.random(),
            position: data.position,
            company: data.company,
            location: data.location,
            duration: data.duration,
            type: data.type || 'Full-time',
            description: data.description,
            responsibilities,
            technologies,
            achievements: data.achievements ? data.achievements.split('\n').filter(ach => ach.trim()) : []
        };

        if (editingExperience) {
            setExperiences(experiences.map(exp => exp.id === editingExperience.id ? newExperience : exp));
            setEditingExperience(null);
            toast.success('Experience updated successfully!');
        } else {
            setExperiences([...experiences, newExperience]);
            toast.success('Experience added successfully!');
        }

        reset();
    };

    const editExperience = (experience) => {
        setEditingExperience(experience);
        reset({
            position: experience.position,
            company: experience.company,
            location: experience.location,
            duration: experience.duration,
            type: experience.type,
            description: experience.description,
            responsibilities: experience.responsibilities?.join('\n') || '',
            technologies: experience.technologies?.join(', ') || '',
            achievements: experience.achievements?.join('\n') || ''
        });
    };

    const deleteExperience = (experienceId) => {
        setExperiences(experiences.filter(exp => exp.id !== experienceId));
        toast.success('Experience deleted successfully!');
    };

    const cancelEdit = () => {
        setEditingExperience(null);
        reset();
    };

    const saveAllExperiences = async () => {
        setLoading(true);
        try {
            const experienceData = {
                experiences: experiences.map(exp => ({
                    ...exp,
                    id: exp.id
                }))
            };

            await api.put('/content/experience', experienceData);
            toast.success('All experiences saved successfully!');
        } catch (error) {
            console.error('Error saving experiences:', error);
            toast.error('Failed to save experiences');
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
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Experience Management</h1>
                </div>

                {/* Add/Edit Experience Form */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingExperience ? 'Edit Experience' : 'Add New Experience'}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position/Role *
                                </label>
                                <input
                                    type="text"
                                    {...register('position', { required: 'Position is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Senior .NET Developer"
                                />
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company *
                                </label>
                                <input
                                    type="text"
                                    {...register('company', { required: 'Company is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., IIT Mandi"
                                />
                                {errors.company && (
                                    <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    {...register('location')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Mandi, India"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration *
                                </label>
                                <input
                                    type="text"
                                    {...register('duration', { required: 'Duration is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 2022 - Present"
                                />
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employment Type
                                </label>
                                <select
                                    {...register('type')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description of your role and the company..."
                            />
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Key Responsibilities (one per line)
                            </label>
                            <textarea
                                {...register('responsibilities')}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Developed and maintained web applications&#10;Led a team of 5 developers&#10;Implemented CI/CD pipelines"
                            />
                        </div>

                        {/* Technologies */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Technologies Used (comma-separated)
                            </label>
                            <input
                                type="text"
                                {...register('technologies')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ASP.NET Core, C#, Angular, SQL Server, Azure"
                            />
                        </div>

                        {/* Achievements */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Key Achievements (one per line)
                            </label>
                            <textarea
                                {...register('achievements')}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Increased system performance by 40%&#10;Successfully delivered 15+ projects&#10;Mentored 3 junior developers"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-2">
                            {editingExperience && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4" />
                                {editingExperience ? 'Update' : 'Add'} Experience
                            </button>
                        </div>
                    </form>
                </div>

                {/* Experience List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Work Experience ({experiences.length})</h3>
                    
                    {experiences.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No work experience added yet. Add your first experience above!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {experiences.map(experience => (
                                <div key={experience.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-xl font-semibold text-gray-900">{experience.position}</h4>
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                    {experience.type || 'Full-time'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-600 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="h-4 w-4" />
                                                    <span className="font-medium">{experience.company}</span>
                                                </div>
                                                {experience.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{experience.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{experience.duration}</span>
                                                </div>
                                            </div>
                                            {experience.description && (
                                                <p className="text-gray-600 mb-3">{experience.description}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 ml-4">
                                            <button
                                                onClick={() => editExperience(experience)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteExperience(experience.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Responsibilities */}
                                    {experience.responsibilities && experience.responsibilities.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="font-medium text-gray-900 mb-2">Key Responsibilities:</h5>
                                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                                {experience.responsibilities.map((resp, index) => (
                                                    <li key={index}>{resp}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Achievements */}
                                    {experience.achievements && experience.achievements.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="font-medium text-gray-900 mb-2">Key Achievements:</h5>
                                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                                {experience.achievements.map((achievement, index) => (
                                                    <li key={index}>{achievement}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Technologies */}
                                    {experience.technologies && experience.technologies.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-2">Technologies:</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {experience.technologies.map((tech, index) => (
                                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save All Button */}
                {experiences.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={saveAllExperiences}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Saving...' : 'Save All Experiences'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceEditor;