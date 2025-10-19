import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI } from '../utils/api';
import { 
  User, 
  Code, 
  Briefcase, 
  MessageSquare, 
  Mail, 
  Eye,
  Edit,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await contentAPI.getAll();
      setContent(response.data);
    } catch (error) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Projects',
      value: content?.projects?.length || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
      link: '/admin/projects'
    },
    {
      title: 'Skills',
      value: content?.skills?.reduce((acc, category) => acc + category.skills.length, 0) || 0,
      icon: Code,
      color: 'bg-green-500',
      link: '/admin/skills'
    },
    {
      title: 'Experience',
      value: content?.experience?.length || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/admin/experience'
    },
    {
      title: 'Testimonials',
      value: content?.testimonials?.length || 0,
      icon: MessageSquare,
      color: 'bg-orange-500',
      link: '/admin/testimonials'
    }
  ];

  const quickActions = [
    {
      title: 'Edit Hero Section',
      description: 'Update main banner and introduction',
      icon: User,
      link: '/admin/hero',
      color: 'bg-primary-500'
    },
    {
      title: 'Manage Projects',
      description: 'Add or edit your portfolio projects',
      icon: Briefcase,
      link: '/admin/projects',
      color: 'bg-blue-500'
    },
    {
      title: 'Update Skills',
      description: 'Modify your technical skills',
      icon: Code,
      link: '/admin/skills',
      color: 'bg-green-500'
    },
    {
      title: 'Contact Info',
      description: 'Update contact information',
      icon: Mail,
      link: '/admin/contact',
      color: 'bg-red-500'
    }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your website.</p>
        </div>
        <div className="flex space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center"
          >
            <Eye size={16} className="mr-2" />
            View Website
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="card hover:shadow-md transition-shadow duration-200 group"
              >
                <div className={`p-3 rounded-lg ${action.color} mb-4 inline-block`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                  <Edit size={16} className="mr-1" />
                  Edit
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Website Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Hero Section</p>
              <p className="text-sm text-gray-600">
                {content?.hero?.name} - {content?.hero?.title}
              </p>
            </div>
            <Link to="/admin/hero" className="text-primary-600 hover:text-primary-700">
              <Edit size={16} />
            </Link>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">About Section</p>
              <p className="text-sm text-gray-600">
                {content?.about?.details?.experience} experience
              </p>
            </div>
            <Link to="/admin/about" className="text-primary-600 hover:text-primary-700">
              <Edit size={16} />
            </Link>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Contact Information</p>
              <p className="text-sm text-gray-600">
                {content?.contact?.email}
              </p>
            </div>
            <Link to="/admin/contact" className="text-primary-600 hover:text-primary-700">
              <Edit size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;