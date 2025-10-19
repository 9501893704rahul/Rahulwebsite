import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, MessageSquare, Plus, Trash2, Edit3, Star, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const TestimonialsEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [testimonials, setTestimonials] = useState([]);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

    const fetchTestimonialsContent = async () => {
        try {
            const response = await api.get('/api/content/testimonials');
            const data = response.data;
            
            // Convert testimonials array and add IDs
            const testimonialsArray = (data.testimonials || []).map((testimonial, index) => ({
                id: testimonial.id || Date.now() + index,
                ...testimonial
            }));
            
            setTestimonials(testimonialsArray);
        } catch (error) {
            console.error('Error fetching testimonials content:', error);
            toast.error('Failed to load testimonials content');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonialsContent();
    }, []);

    const onSubmit = async (data) => {
        const newTestimonial = {
            id: editingTestimonial ? editingTestimonial.id : Date.now() + Math.random(),
            name: data.name,
            position: data.position,
            company: data.company,
            location: data.location,
            rating: parseInt(data.rating),
            testimonial: data.testimonial,
            project: data.project || '',
            amount: data.amount || '',
            platform: data.platform || 'Direct',
            date: data.date || new Date().toISOString().split('T')[0],
            featured: data.featured || false
        };

        if (editingTestimonial) {
            setTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? newTestimonial : t));
            setEditingTestimonial(null);
            toast.success('Testimonial updated successfully!');
        } else {
            setTestimonials([...testimonials, newTestimonial]);
            toast.success('Testimonial added successfully!');
        }

        reset();
    };

    const editTestimonial = (testimonial) => {
        setEditingTestimonial(testimonial);
        reset({
            name: testimonial.name,
            position: testimonial.position,
            company: testimonial.company,
            location: testimonial.location,
            rating: testimonial.rating,
            testimonial: testimonial.testimonial,
            project: testimonial.project,
            amount: testimonial.amount,
            platform: testimonial.platform,
            date: testimonial.date,
            featured: testimonial.featured
        });
    };

    const deleteTestimonial = (testimonialId) => {
        setTestimonials(testimonials.filter(t => t.id !== testimonialId));
        toast.success('Testimonial deleted successfully!');
    };

    const cancelEdit = () => {
        setEditingTestimonial(null);
        reset();
    };

    const saveAllTestimonials = async () => {
        setLoading(true);
        try {
            const testimonialsData = {
                testimonials: testimonials.map(testimonial => ({
                    ...testimonial,
                    id: testimonial.id
                }))
            };

            await api.put('/api/content/testimonials', testimonialsData);
            toast.success('All testimonials saved successfully!');
        } catch (error) {
            console.error('Error saving testimonials:', error);
            toast.error('Failed to save testimonials');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const currentRating = watch('rating');

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
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
                </div>

                {/* Add/Edit Testimonial Form */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Client Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client Name *
                                </label>
                                <input
                                    type="text"
                                    {...register('name', { required: 'Client name is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., John Doe"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position/Title
                                </label>
                                <input
                                    type="text"
                                    {...register('position')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., CEO, Project Manager"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    {...register('company')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Tech Solutions Inc."
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
                                    placeholder="e.g., New York, USA"
                                />
                            </div>
                        </div>

                        {/* Project Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project/Service
                                </label>
                                <input
                                    type="text"
                                    {...register('project')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., E-commerce Website"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Value
                                </label>
                                <input
                                    type="text"
                                    {...register('amount')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., $5,000 USD"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Platform
                                </label>
                                <select
                                    {...register('platform')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Direct">Direct Client</option>
                                    <option value="Freelancer.com">Freelancer.com</option>
                                    <option value="Upwork">Upwork</option>
                                    <option value="Fiverr">Fiverr</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Rating and Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating *
                                </label>
                                <div className="flex items-center gap-4">
                                    <select
                                        {...register('rating', { required: 'Rating is required' })}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Rating</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                    {currentRating && (
                                        <div className="flex">
                                            {renderStars(parseInt(currentRating))}
                                        </div>
                                    )}
                                </div>
                                {errors.rating && (
                                    <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    {...register('date')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Testimonial Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Testimonial *
                            </label>
                            <textarea
                                {...register('testimonial', { required: 'Testimonial text is required' })}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter the client's testimonial..."
                            />
                            {errors.testimonial && (
                                <p className="mt-1 text-sm text-red-600">{errors.testimonial.message}</p>
                            )}
                        </div>

                        {/* Featured Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                {...register('featured')}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-700">
                                Feature this testimonial (show prominently on website)
                            </label>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-2">
                            {editingTestimonial && (
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
                                {editingTestimonial ? 'Update' : 'Add'} Testimonial
                            </button>
                        </div>
                    </form>
                </div>

                {/* Testimonials List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Client Testimonials ({testimonials.length})</h3>
                    
                    {testimonials.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No testimonials added yet. Add your first testimonial above!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {testimonials.map(testimonial => (
                                <div key={testimonial.id} className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${testimonial.featured ? 'ring-2 ring-yellow-400' : ''}`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-5 w-5 text-gray-400" />
                                                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                                </div>
                                                {testimonial.featured && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 mb-2">
                                                {testimonial.position && testimonial.company ? (
                                                    <span>{testimonial.position} at {testimonial.company}</span>
                                                ) : testimonial.position ? (
                                                    <span>{testimonial.position}</span>
                                                ) : testimonial.company ? (
                                                    <span>{testimonial.company}</span>
                                                ) : null}
                                                {testimonial.location && (
                                                    <span className="ml-2">• {testimonial.location}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex">
                                                    {renderStars(testimonial.rating)}
                                                </div>
                                                <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-1 ml-4">
                                            <button
                                                onClick={() => editTestimonial(testimonial)}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteTestimonial(testimonial.id)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <blockquote className="text-gray-700 italic mb-4">
                                        "{testimonial.testimonial}"
                                    </blockquote>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            {testimonial.project && (
                                                <span>Project: {testimonial.project}</span>
                                            )}
                                            {testimonial.amount && (
                                                <span>Value: {testimonial.amount}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>{testimonial.platform}</span>
                                            {testimonial.date && (
                                                <span>• {new Date(testimonial.date).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save All Button */}
                {testimonials.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={saveAllTestimonials}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Saving...' : 'Save All Testimonials'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsEditor;