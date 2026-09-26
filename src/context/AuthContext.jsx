import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER } from '../data/mockData';

const AuthContext = createContext(null);
const AUTH_KEY = 'smart_diabetes_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading auth user:', e);
    }
    // Default demo session for immediate exploration
    return INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(user);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem(AUTH_KEY);
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = async (email, password) => {
    // Simulated credential check
    if (!email || !password) {
      throw new Error('Please provide both email and password.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const loggedUser = {
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role: 'Clinical Researcher',
      age: 32,
      gender: 'Female',
      department: 'Preventative Medicine & Endocrinology',
      institution: 'Metabolic Care Analytics Institute',
      joinedDate: 'March 2026'
    };
    setUser(loggedUser);
    return loggedUser;
  };

  const demoLogin = () => {
    setUser(INITIAL_USER);
    return INITIAL_USER;
  };

  const register = async (userData) => {
    const newUser = {
      name: userData.fullName || userData.name,
      email: userData.email,
      role: 'Registered Clinician',
      age: Number(userData.age) || 30,
      gender: userData.gender || 'Not Specified',
      department: 'General Medicine & Health Analytics',
      institution: 'University Hospital Consortium',
      joinedDate: 'March 2026'
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      return updated;
    });
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
      throw new Error('All password fields are required.');
    }
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }
    // Simulated delay
    await new Promise((r) => setTimeout(r, 400));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
