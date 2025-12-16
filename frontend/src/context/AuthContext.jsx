import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedAdmin = localStorage.getItem('admin');

    if (token && storedAdmin) {
      try {
        const response = await api.get('/auth/me');
        setAdmin(response.data.data);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, admin } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    setAdmin(admin);
    
    return admin;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
    isSuperAdmin: admin?.role === 'super-admin',
    isCoAdmin: admin?.role === 'co-admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
