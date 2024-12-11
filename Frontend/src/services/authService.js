import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://yourapi.com'; // Reemplaza con la URL de tu API

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      // Guardar tokens en almacenamiento seguro
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
      return data;
    } else {
      throw new Error(data.detail || 'Login failed');
    }
  } catch (error) {
    throw new Error(error.message || 'An error occurred during login');
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const response = await fetch(`${API_URL}/token/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    const data = await response.json();
    if (response.ok) {
      // Guardar nuevo token de acceso
      await AsyncStorage.setItem('access_token', data.access);
      return data.access;
    } else {
      throw new Error(data.detail || 'Failed to refresh token');
    }
  } catch (error) {
    throw new Error(error.message || 'An error occurred during token refresh');
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
  } catch (error) {
    throw new Error(error.message || 'An error occurred during logout');
  }
};
