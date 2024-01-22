import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);

  const setToken = (newToken) => {
    console.log("Setting token in context:", newToken); // Add this log

    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const checkForStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    console.log("Retrieved token from storage:", storedToken);

    if (storedToken) {
      setToken(storedToken);
    }
  };

  useEffect(() => {
    checkForStoredToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.token) {
        setToken(response.data.token);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
