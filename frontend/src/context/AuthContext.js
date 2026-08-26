import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('itsUser')) || null;
  } catch (_) {
    localStorage.removeItem('itsUser');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  const login = (userData) => {
    localStorage.setItem('itsUser', JSON.stringify(userData));
    setUser(userData);
  };

  const updateUser = (userData) => {
    localStorage.setItem('itsUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('itsUser');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, updateUser, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
