import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext();

const USER_STORAGE_KEY = 'burger_shop_user';
const USERS_DB_KEY = 'burger_shop_users';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  const getStoredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    } catch (error) {
      console.error("Failed to parse users from localStorage", error);
      return [];
    }
  }

  const handleSuccessfulAuth = useCallback((authenticatedUser) => {
    // Never store password in state or session storage
    const { password: _, ...userToStore } = authenticatedUser;
    setUser(userToStore);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userToStore));
  }, []);

  const login = useCallback(async (email, password) => {
    // MOCK: In production, call an API. Storing passwords in localStorage is insecure.
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser) throw new Error('Invalid credentials');
    handleSuccessfulAuth(foundUser);
  }, [handleSuccessfulAuth]);

  const register = useCallback(async (email, password, name) => {
    const users = getStoredUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: `${Date.now()}-${Math.random()}`, // Slightly more unique ID for mock
      email,
      password, // In a real app, this would be hashed on the server
      name,
      role: 'customer',
      loyaltyPoints: 0,
    };

    users.push(newUser);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));

    handleSuccessfulAuth(newUser);
  }, [handleSuccessfulAuth]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('burger_shop_user');
  };
    
  return (
    <AuthContext.Provider value={useMemo(() => ({ user, login, register, logout, isAuthenticated: !!user }), [user, login, register])}>
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
