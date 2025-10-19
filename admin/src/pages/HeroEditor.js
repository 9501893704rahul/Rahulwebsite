import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { contentAPI } from '../utils/api';
import { Save, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const HeroEditor = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    setLoading(true);
    try {
      const response = await contentAPI.getSection('hero');
      const heroData = response.data;
      
      // Set form values
      setValue('name', heroData.name || '');
      setValue('title', heroData.title || '');
      setValue('description', heroData.description || '');
      setValue('stats.experience', heroData.stats?.experience || 0);
      setValue('stats.projects', heroData.stats?.projects || 0);
      setValue('stats.clients', heroData.stats?.clients || 0);
    } catch (error) {
      toast.error('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await contentAPI.updateSection('hero', data);
      toast.success('Hero section updated successfully!');
    } catch (error) {
      toast.error('Failed to update hero section');
    } finally {
      setSaving(false);
    }
  };

  const watchedValues = watch();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
          <p className="text-gray-600">Edit the main banner and introduction of your website</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center"
        >
          <Eye size={16} className="mr-2" />
          Preview
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Content</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="input-field"
                placeholder="e.g., .NET Angular Developer & AI Engineer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="input-field"
                placeholder="Brief description about yourself and your expertise"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years Experience
                  </label>
                  <input
                    type="number"
                    {...register('stats.experience', { 
                      required: 'Experience is required',
                      min: { value: 0, message: 'Must be 0 or greater' }
                    })}
                    className="input-field"
                    placeholder="5"
                  />
                  {errors.stats?.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.stats.experience.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projects Completed
                  </label>
                  <input
                    type="number"
                    {...register('stats.projects', { 
                      required: 'Projects count is required',
                      min: { value: 0, message: 'Must be 0 or greater' }
                    })}
                    className="input-field"
                    placeholder="50"
                  />
                  {errors.stats?.projects && (
                    <p className="mt-1 text-sm text-red-600">{errors.stats.projects.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Happy Clients
                  </label>
                  <input
                    type="number"
                    {...register('stats.clients', { 
                      required: 'Clients count is required',
                      min: { value: 0, message: 'Must be 0 or greater' }
                    })}
                    className="input-field"
                    placeholder="100"
                  />
                  {errors.stats?.clients && (
                    <p className="mt-1 text-sm text-red-600">{errors.stats.clients.message}</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-lg">
            <div className="text-center">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Hello, I'm</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {watchedValues.name || 'Your Name'}
              </h1>
              <h2 className="text-lg text-primary-600 mb-4">
                {watchedValues.title || 'Your Professional Title'}
              </h2>
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                {watchedValues.description || 'Your description will appear here...'}
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {watchedValues.stats?.experience || 0}
                  </div>
                  <div className="text-xs text-gray-600">Years Experience</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {watchedValues.stats?.projects || 0}
                  </div>
                  <div className="text-xs text-gray-600">Projects Completed</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {watchedValues.stats?.clients || 0}
                  </div>
                  <div className="text-xs text-gray-600">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;