import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native';

// Constantes para la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://tu-backend-api.com';
const API_ENDPOINTS = {
  characteristics: '/api/characteristics',
};

const Profile = () => {
  const [characteristics, setCharacteristics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const validateInput = () => {
    if (!characteristics.trim()) {
      Alert.alert('Error', 'Por favor ingresa características antes de actualizar.');
      return false;
    }
    return true;
  };

  const updateCharacteristics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.characteristics}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Aquí puedes agregar headers adicionales como tokens de autenticación
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          characteristics,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al actualizar características');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const onUpdatePressed = useCallback(async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    try {
      await updateCharacteristics();
      Alert.alert('Éxito', 'Las características se actualizaron correctamente.');
      setCharacteristics('');
      setRetryCount(0);
    } catch (error) {
      console.error('Error en actualización:', error);

      // Manejo de reintentos para errores de red
      if (error.message.includes('Network') && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        Alert.alert(
          'Error de conexión',
          'Hubo un problema de conexión. ¿Deseas intentar nuevamente?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => setRetryCount(0)
            },
            {
              text: 'Reintentar',
              onPress: () => onUpdatePressed()
            }
          ]
        );
      } else {
        Alert.alert('Error', 'No se pudieron actualizar las características. Por favor, intenta más tarde.');
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, [characteristics, retryCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Características</Text>
      <TextInput
        style={styles.input}
        placeholder="Características"
        value={characteristics}
        onChangeText={setCharacteristics}
        multiline
        editable={!isLoading}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Actualizar"
          onPress={onUpdatePressed}
          disabled={isLoading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
  },
});

export default Profile;