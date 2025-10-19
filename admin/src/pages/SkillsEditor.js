import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Code, Plus, Trash2, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const SkillsEditor = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [skills, setSkills] = useState([]);
    const [editingSkill, setEditingSkill] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const skillCategories = ['Backend Development', 'Frontend Development', 'Database & Cloud', 'AI & Development Tools', 'Other'];

    const fetchSkillsContent = async () => {
        try {
            const response = await api.get('/api/content/skills');
            const data = response.data;
            
            // Convert skills object to array format
            const skillsArray = [];
            Object.keys(data).forEach(category => {
                if (Array.isArray(data[category])) {
                    data[category].forEach(skill => {
                        skillsArray.push({
                            id: Date.now() + Math.random(),
                            category,
                            name: skill.name,
                            level: skill.level,
                            percentage: skill.percentage || getLevelPercentage(skill.level)
                        });
                    });
                }
            });
            
            setSkills(skillsArray);
        } catch (error) {
            console.error('Error fetching skills content:', error);
            toast.error('Failed to load skills content');
        } finally {
            setFetchLoading(false);
        }
    };

    const getLevelPercentage = (level) => {
        const percentages = {
            'Beginner': 25,
            'Intermediate': 50,
            'Advanced': 75,
            'Expert': 90
        };
        return percentages[level] || 50;
    };

    useEffect(() => {
        fetchSkillsContent();
    }, []);

    const onSubmit = async (data) => {
        const newSkill = {
            id: editingSkill ? editingSkill.id : Date.now() + Math.random(),
            category: data.category,
            name: data.name,
            level: data.level,
            percentage: getLevelPercentage(data.level)
        };

        if (editingSkill) {
            setSkills(skills.map(skill => skill.id === editingSkill.id ? newSkill : skill));
            setEditingSkill(null);
            toast.success('Skill updated successfully!');
        } else {
            setSkills([...skills, newSkill]);
            toast.success('Skill added successfully!');
        }

        reset();
    };

    const editSkill = (skill) => {
        setEditingSkill(skill);
        reset({
            category: skill.category,
            name: skill.name,
            level: skill.level
        });
    };

    const deleteSkill = (skillId) => {
        setSkills(skills.filter(skill => skill.id !== skillId));
        toast.success('Skill deleted successfully!');
    };

    const cancelEdit = () => {
        setEditingSkill(null);
        reset();
    };

    const saveAllSkills = async () => {
        setLoading(true);
        try {
            // Convert skills array back to categorized object
            const skillsData = {};
            skillCategories.forEach(category => {
                skillsData[category] = skills
                    .filter(skill => skill.category === category)
                    .map(skill => ({
                        name: skill.name,
                        level: skill.level,
                        percentage: skill.percentage
                    }));
            });

            await api.put('/api/content/skills', skillsData);
            toast.success('All skills saved successfully!');
        } catch (error) {
            console.error('Error saving skills:', error);
            toast.error('Failed to save skills');
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
                    <Code className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Skills Management</h1>
                </div>

                {/* Add/Edit Skill Form */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Category</option>
                                {skillCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skill Name
                            </label>
                            <input
                                type="text"
                                {...register('name', { required: 'Skill name is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., React, Node.js"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Proficiency Level
                            </label>
                            <select
                                {...register('level', { required: 'Level is required' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Level</option>
                                {skillLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                            {errors.level && (
                                <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
                            )}
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Plus className="h-4 w-4" />
                                {editingSkill ? 'Update' : 'Add'} Skill
                            </button>
                            {editingSkill && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Skills List by Category */}
                <div className="space-y-6">
                    {skillCategories.map(category => {
                        const categorySkills = skills.filter(skill => skill.category === category);
                        if (categorySkills.length === 0) return null;

                        return (
                            <div key={category} className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categorySkills.map(skill => (
                                        <div key={skill.id} className="bg-white p-4 rounded-lg border">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => editSkill(skill)}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSkill(skill.id)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{skill.level}</span>
                                                <span className="text-gray-600">{skill.percentage}%</span>
                                            </div>
                                            <div className="mt-2 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${skill.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Save All Button */}
                {skills.length > 0 && (
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={saveAllSkills}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Saving...' : 'Save All Skills'}
                        </button>
                    </div>
                )}

                {skills.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No skills added yet. Add your first skill above!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsEditor;