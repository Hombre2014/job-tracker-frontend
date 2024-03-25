'use client';

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken && user) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        loading,
        setLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
