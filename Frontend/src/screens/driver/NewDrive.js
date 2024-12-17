import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../../styles/theme'; // Asegúrate de tener el tema adecuado

const NewDrive = ({ navigation }) => {
  // Estado para guardar el vehículo seleccionado
  const [vehicle, setVehicle] = useState(null);

  // Función que maneja la selección del vehículo
  const handleVehicleSelection = (selectedVehicle) => {
    setVehicle(selectedVehicle);
    Alert.alert('Vehículo seleccionado', `Has seleccionado: ${selectedVehicle}`);
  };

  // Función para navegar a la pantalla "SearchParking" cuando el botón Siguiente sea presionado
  const handleNext = () => {
    if (vehicle) {
      navigation.navigate('SearchParking', {vehicle: vehicle}); // Navega a la pantalla SearchParking
    } else {
      Alert.alert('Por favor, selecciona un vehículo primero.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu vehículo</Text>
      
      {/* Botones para cada vehículo */}
      <TouchableOpacity 
        style={styles.vehicleButton} 
        onPress={() => handleVehicleSelection('Auto')}
      >
        <Text style={styles.buttonText}>Auto</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.vehicleButton} 
        onPress={() => handleVehicleSelection('Camioneta')}
      >
        <Text style={styles.buttonText}>Camioneta</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.vehicleButton} 
        onPress={() => handleVehicleSelection('Moto')}
      >
        <Text style={styles.buttonText}>Moto</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.vehicleButton} 
        onPress={() => handleVehicleSelection('Bicicleta')}
      >
        <Text style={styles.buttonText}>Bicicleta</Text>
      </TouchableOpacity>

      {/* Mostrar vehículo seleccionado */}
      {vehicle && (
        <Text style={styles.selectedVehicleText}>Vehículo seleccionado: {vehicle}</Text>
      )}

      {/* Botón "Siguiente" */}
      <TouchableOpacity 
        style={[styles.nextButton, !vehicle && styles.disabledButton]} 
        onPress={handleNext} 
        disabled={!vehicle} // Deshabilitar si no hay vehículo seleccionado
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.primary,
  },
  vehicleButton: {
    backgroundColor: theme.colors.secondary, 
    padding: 15,
    marginVertical: 10,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  selectedVehicleText: {
    marginTop: 20,
    fontSize: 18,
    color: theme.colors.primary, 
  },
  nextButton: {
    backgroundColor: theme.colors.primary, 
    padding: 15,
    marginTop: 30,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled, 
  },
});

export default NewDrive;
