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
      console.log('Error in getUserProfile:', error.response?.data || error.message);
      throw error;
    }
  };

  const storeAuthData = async (tokens, userData) => {
    try {
      console.log('Storing auth data:', { tokens, userData });
      await AsyncStorage.setItem('authTokens', JSON.stringify(tokens));
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.log('Error storing auth data:', error);
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
      console.log('Error loading auth data:', error);
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
      console.log('Login error:', error.response?.data || error.message);
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
      console.log('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      console.log('Refreshing token with:', authTokens?.refresh);
      if (!authTokens?.refresh) {
        throw new Error('No refresh token available');
      }
  
      const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
        refresh: authTokens.refresh
      });
  
      const newToken = response.data.access;
      console.log('Received new token:', newToken);
  
      const tokens = {
        ...authTokens,
        access: newToken
      };
  
      await storeAuthData(tokens, user);
      setAuthTokens(tokens);
  
      return newToken;
    } catch (error) {
      console.log('Token refresh error:', error.response?.data || error.message);
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
      (config) => {
        // Obtener el token más reciente del estado
        const currentToken = authTokens?.access;
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
          console.log('Using token in request:', currentToken); // Para debugging
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  
    const responseIntercept = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
  
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
  
          try {
            const newToken = await refreshToken();
            if (newToken) {
              // Actualizar la solicitud original con el nuevo token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              console.log('Retrying with new token:', newToken); // Para debugging
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.log('Error during token refresh:', refreshError);
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );
  
    // Refresh  cada 4 minutos
    const refreshInterval = setInterval(async () => {
      if (authTokens?.refresh) {
        try {
          await refreshToken();
        } catch (error) {
          console.log('Error in periodic refresh:', error);
        }
      }
    }, 240000);
  
    return () => {
      axios.interceptors.request.eject(requestIntercept);
      axios.interceptors.response.eject(responseIntercept);
      clearInterval(refreshInterval);
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