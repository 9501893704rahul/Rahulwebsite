import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroEditor from './pages/HeroEditor';
import AboutEditor from './pages/AboutEditor';
import SkillsEditor from './pages/SkillsEditor';
import ProjectsEditor from './pages/ProjectsEditor';
import ExperienceEditor from './pages/ExperienceEditor';
import TestimonialsEditor from './pages/TestimonialsEditor';
import ContactEditor from './pages/ContactEditor';
import SettingsEditor from './pages/SettingsEditor';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/admin" />;
};



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: '#4aed88',
                },
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route
              path="/admin/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="hero" element={<HeroEditor />} />
                      <Route path="about" element={<AboutEditor />} />
                      <Route path="skills" element={<SkillsEditor />} />
                      <Route path="projects" element={<ProjectsEditor />} />
                      <Route path="experience" element={<ExperienceEditor />} />
                      <Route path="testimonials" element={<TestimonialsEditor />} />
                      <Route path="contact" element={<ContactEditor />} />
                      <Route path="settings" element={<SettingsEditor />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to admin */}
            <Route path="/" element={<Navigate to="/admin" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;