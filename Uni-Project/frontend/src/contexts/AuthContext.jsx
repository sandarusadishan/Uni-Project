import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext();

const USER_STORAGE_KEY = 'burger_shop_user';
const API_URL = 'http://localhost:3000/api/users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      const userObject = savedUser ? JSON.parse(savedUser) : null;
      if (userObject && userObject.token) {
        setUser(userObject);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const handleSuccessfulAuth = useCallback((authenticatedUser) => {
    // The backend already removes the password. We store the user object and token.
    const userToStore = authenticatedUser;
    setUser(userToStore);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to log in');
    }

    handleSuccessfulAuth(data);
  }, [handleSuccessfulAuth]);

  const register = useCallback(async (email, password, name) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to register');
    }

    handleSuccessfulAuth(data);
  }, [handleSuccessfulAuth]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };
    
  return (
    <AuthContext.Provider value={useMemo(() => ({ user, login, register, logout, isAuthenticated: !!user?.token }), [user, login, register])}>
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
