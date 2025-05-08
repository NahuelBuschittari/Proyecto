import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';
import axios from 'axios';

const UpdatePrices = () => {
  const vehicles = {
    Auto: ['Fracción Auto', 'Hora Auto', 'Medio día Auto', 'Día Auto'],
    Camioneta: ['Fracción Camioneta', 'Hora Camioneta', 'Medio día Camioneta', 'Día Camioneta'],
    Moto: ['Fracción Moto', 'Hora Moto', 'Medio día Moto', 'Día Moto'],
    Bicicleta: ['Fracción Bicicleta', 'Hora Bicicleta', 'Medio día Bicicleta', 'Día Bicicleta'],
  };

  const { user, authTokens } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState('Auto');
  const [allPrices, setAllPrices] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Estado para controlar el estado del botón

  const loadPrices = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking/${user.id}/prices/get`);
      if (response.data) {
        setAllPrices(response.data);
        setPrices(response.data[selectedVehicle] || {});
      }
    } catch (error) {
      console.log('Error al cargar precios:', error);
      Alert.alert('Error', 'No se pudieron cargar los precios');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleChange = (value) => {
    setSelectedVehicle(value);
    if (allPrices) {
      setPrices(allPrices[value] || {});
    }
  };

  const handlePriceChange = (item, value) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [item]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true); // Desactivar el botón
    try {
      console.log('Enviando solicitud para actualizar precios...');
      const response = await axios.post(
        `${API_URL}/parking/${user.id}/prices/update`,
        {
          vehicleType: selectedVehicle,
          prices,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );

      console.log('Respuesta del servidor:', response.data);

      if (response.status >= 200 && response.status < 300) {
        console.log('Actualización exitosa. Mostrando alerta...');
        Alert.alert(
          'Precios Actualizados',
          response.data.message || 'Precios actualizados correctamente.',
          [{ text: 'OK', onPress: () => console.log('Alerta cerrada') }]
        );

        loadPrices(); // Recargar los precios después de la actualización
      } else {
        console.log('Respuesta no válida del servidor:', response);
        Alert.alert('Error', 'No se recibió un mensaje válido del servidor.');
      }
    } catch (error) {
      console.log('Error al actualizar precios:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Ocurrió un error inesperado. Intenta nuevamente.'
      );
    } finally {
      setIsSaving(false); // Reactivar el botón
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.card, { width: '90%', alignSelf: 'center' }]}>
      <Text style={[styles.title, { textAlign: 'center', marginBottom: theme.spacing.md }]}>Actualizar Precios</Text>

      <Text style={[styles.label, { textAlign: 'center' }]}>Selecciona el tipo de vehículo:</Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.sm,
          marginBottom: theme.spacing.md,
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <Picker
          selectedValue={selectedVehicle}
          onValueChange={handleVehicleChange}
          style={{ height: 52, color: theme.colors.text }}
        >
          {Object.keys(vehicles).map((vehicle) => (
            <Picker.Item key={vehicle} label={vehicle} value={vehicle} color={theme.colors.text} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={vehicles[selectedVehicle]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View
            style={[styles.horizontalContainer, {
              marginBottom: theme.spacing.sm,
              justifyContent: 'space-between',
            }]}>
            <Text style={[styles.label, { flex: 1 }]}>{item}</Text>
            <TextInput
              style={{
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: theme.borderRadius.sm,
                padding: theme.spacing.sm,
                width: 100,
                textAlign: 'center',
                color: theme.colors.text,
              }}
              keyboardType="numeric"
              value={prices[item]?.toString() || ''}
              onChangeText={(value) => handlePriceChange(item, value)}
              placeholder="Precio"
            />
          </View>
        )}
      />

      <TouchableOpacity
        style={[
          styles.navigationButton,
          {
            backgroundColor: isSaving ? theme.colors.disabled : theme.colors.primary, // Cambiar color si está guardando
            marginTop: theme.spacing.lg,
            alignSelf: 'center',
            width: '100%',
          },
        ]}
        onPress={handleSave}
        disabled={isSaving} // Desactivar el botón mientras se guarda
      >
        <Text style={styles.navigationButtonText}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdatePrices;
