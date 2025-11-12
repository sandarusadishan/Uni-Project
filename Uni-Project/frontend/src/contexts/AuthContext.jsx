import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const USER_STORAGE_KEY = 'burger_shop_user';
const API_URL = 'http://localhost:3000/api/users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem(USER_STORAGE_KEY);
      const userObject = savedUser ? JSON.parse(savedUser) : null;
      if (userObject && userObject.token) {
        setUser(userObject);
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const handleSuccessfulAuth = useCallback((authenticatedUser) => {
    // The backend already removes the password. We store the user object and token.
    const userToStore = authenticatedUser;
    setUser(userToStore);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      handleSuccessfulAuth(response.data);
    } catch (error) {
      // axios wraps errors in error.response.data
      throw new Error(error.response?.data?.message || error.message || 'Failed to log in');
    }
  }, [handleSuccessfulAuth]);

  const register = useCallback(async (email, password, name) => {
    try {
      // Do not automatically log in the user after registration.
      // Just make the request and let the Auth page handle the UI change.
      await axios.post(`${API_URL}/register`, { name, email, password });
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to register');
    }
  }, [handleSuccessfulAuth]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }, []);
    
  return (
    <AuthContext.Provider value={useMemo(() => ({ user, login, register, logout, isAuthenticated: !!user?.token }), [user, login, register, logout])}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
