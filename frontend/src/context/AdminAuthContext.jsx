import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('ms_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ms_admin_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.token) {
        setToken(res.token);
        setAdminUser(res.admin);
        localStorage.setItem('ms_admin_token', res.token);
        localStorage.setItem('ms_admin_user', JSON.stringify(res.admin));
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Connection failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('ms_admin_token');
    localStorage.removeItem('ms_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
