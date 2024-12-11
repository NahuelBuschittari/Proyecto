import { refreshAccessToken } from './authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchProtectedData = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    const response = await fetch('https://yourapi.com/protected', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      // Token expirado, manejar la renovación
      const newAccessToken = await refreshAccessToken();
      // Reintentar la solicitud original
      const retryResponse = await fetch('https://yourapi.com/protected', {
        headers: { 'Authorization': `Bearer ${newAccessToken}` },
      });
      return await retryResponse.json();
    } else {
      return await response.json();
    }
  } catch (error) {
    throw new Error(error.message || 'An error occurred during data fetch');
  }
};
