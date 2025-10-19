import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, FolderOpen, Plus, Trash2, Edit3, Upload, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ProjectsEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

    const projectCategories = ['All Projects', 'Enterprise', 'Web Apps', 'AI Projects', 'Mobile Apps'];
    const projectStatuses = ['LIVE', 'IN DEVELOPMENT', 'COMPLETED', 'ARCHIVED'];

    const fetchProjectsContent = async () => {
        try {
            const response = await api.get('/api/content/projects');
            const data = response.data;
            
            // Convert projects array and add IDs
            const projectsArray = (data.projects || []).map((project, index) => ({
                id: project.id || Date.now() + index,
                ...project
            }));
            
            setProjects(projectsArray);
        } catch (error) {
            console.error('Error fetching projects content:', error);
            toast.error('Failed to load projects content');
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectsContent();
    }, []);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setImageUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setValue('image', response.data.filePath);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    const onSubmit = async (data) => {
        const technologies = data.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
        const features = data.features.split('\n').filter(feature => feature.trim());
        
        const newProject = {
            id: editingProject ? editingProject.id : Date.now() + Math.random(),
            title: data.title,
            description: data.description,
            image: data.image,
            category: data.category,
            status: data.status,
            technologies,
            features,
            liveUrl: data.liveUrl,
            githubUrl: data.githubUrl,
            stats: {
                users: data.users || '',
                duration: data.duration || '',
                type: data.type || ''
            }
        };

        if (editingProject) {
            setProjects(projects.map(project => project.id === editingProject.id ? newProject : project));
            setEditingProject(null);
            toast.success('Project updated successfully!');
        } else {
            setProjects([...projects, newProject]);
            toast.success('Project added successfully!');
        }

        reset();
    };

    const editProject = (project) => {
        setEditingProject(project);
        reset({
            title: project.title,
            description: project.description,
            image: project.image,
            category: project.category,
            status: project.status,
            technologies: project.technologies?.join(', ') || '',
            features: project.features?.join('\n') || '',
            liveUrl: project.liveUrl,
            githubUrl: project.githubUrl,
            users: project.stats?.users || '',
            duration: project.stats?.duration || '',
            type: project.stats?.type || ''
        });
    };

    const deleteProject = (projectId) => {
        setProjects(projects.filter(project => project.id !== projectId));
        toast.success('Project deleted successfully!');
    };

    const cancelEdit = () => {
        setEditingProject(null);
        reset();
    };

    const saveAllProjects = async () => {
        setLoading(true);
        try {
            const projectsData = {
                projects: projects.map(project => ({
                    ...project,
                    id: project.id
                }))
            };

            await api.put('/api/content/projects', projectsData);
            toast.success('All projects saved successfully!');
        } catch (error) {
            console.error('Error saving projects:', error);
            toast.error('Failed to save projects');
        } finally {
            setLoading(false);
        }
    };

    const currentImage = watch('image');

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Projects Management</h1>
                </div>

                {/* Add/Edit Project Form */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingProject ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Title *
                                </label>
                                <input
                                    type="text"
                                    {...register('title', { required: 'Project title is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., E-commerce Platform"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    {projectCategories.slice(1).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    {...register('status', { required: 'Status is required' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Status</option>
                                    {projectStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Technologies (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    {...register('technologies')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="React, Node.js, MongoDB"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe your project..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Key Features (one per line)
                            </label>
                            <textarea
                                {...register('features')}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="User authentication&#10;Real-time notifications&#10;Payment integration"
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                                >
                                    {imageUploading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                                </label>
                                {currentImage && (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={currentImage}
                                            alt="Preview"
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                        <span className="text-sm text-green-600">Image uploaded</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="hidden"
                                {...register('image')}
                            />
                        </div>

                        {/* URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Live URL
                                </label>
                                <input
                                    type="url"
                                    {...register('liveUrl')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    {...register('githubUrl')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>
                        </div>

                        {/* Project Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Users/Clients
                                </label>
                                <input
                                    type="text"
                                    {...register('users')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1000+ Users"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    {...register('duration')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 6 months"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    {...register('type')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Enterprise Level"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4" />
                                {editingProject ? 'Update' : 'Add'} Project
                            </button>
                            {editingProject && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Projects ({projects.length})</h3>
                    
                    {projects.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No projects added yet. Add your first project above!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <div key={project.id} className="bg-white border rounded-lg overflow-hidden">
                                    {project.image && (
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 truncate">{project.title}</h4>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                project.status === 'LIVE' ? 'bg-green-100 text-green-800' :
                                                project.status === 'IN DEVELOPMENT' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {project.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{project.category}</span>
                                            <div className="flex gap-1">
                                                {project.liveUrl && (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => editProject(project)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteProject(project.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Save All Button */}
                {projects.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={saveAllProjects}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Saving...' : 'Save All Projects'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectsEditor;