// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from './constants';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserProfile = async (token) => {
    try {
      console.log('Getting user profile with token:', token);
      const response = await axios.get(`${API_URL}/auth/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('User profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in getUserProfile:', error.response?.data || error.message);
      throw error;
    }
  };

  const storeAuthData = async (tokens, userData) => {
    try {
      console.log('Storing auth data:', { tokens, userData });
      await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const loadAuthData = async () => {
    try {
      console.log('Loading auth data from storage');
      const storedTokens = await AsyncStorage.getItem('authTokens');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedTokens && storedUser) {
        const tokens = JSON.parse(storedTokens);
        const userData = JSON.parse(storedUser);
        console.log('Loaded auth data:', { tokens, userData });
        setAuthTokens(tokens);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      // 1. Get tokens
      const tokenResponse = await axios.post(`${API_URL}/auth/jwt/create/`, {
        email,
        password
      });

      console.log('Token response:', tokenResponse.data);

      const tokens = {
        access: tokenResponse.data.access,
        refresh: tokenResponse.data.refresh
      };

      // 2. Get user profile
      const userData = await getUserProfile(tokens.access);

      // 3. Store everything
      await storeAuthData(tokens, userData);

      // 4. Update state
      setAuthTokens(tokens);
      setUser(userData);

      console.log('Login successful');
      return userData;

    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      setAuthTokens(null);
      setUser(null);
      await AsyncStorage.removeItem('authTokens');
      await AsyncStorage.removeItem('userData');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      console.log('Refreshing token');
      const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
        refresh: authTokens?.refresh
      });

      const tokens = {
        ...authTokens,
        access: response.data.access
      };

      await storeAuthData(tokens, user);
      setAuthTokens(tokens);

      console.log('Token refresh successful');
      return tokens.access;
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      await logout();
      return null;
    }
  };

  // Load auth data on startup
  useEffect(() => {
    loadAuthData();
  }, []);

  // Set up axios interceptors
  useEffect(() => {
    const requestIntercept = axios.interceptors.request.use(
      config => {
        if (authTokens?.access) {
          config.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    const responseIntercept = axios.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          const originalRequest = error.config;
          
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
    };
  }, [authTokens]);

  const contextValue = {
    user,
    authTokens,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};