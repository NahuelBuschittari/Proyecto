import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { API_URL } from '../../context/constants';
import { useAuth } from '../../context/AuthContext';

const ParkingManager = () => {
  const { user, authTokens } = useAuth();
  const [spaces, setSpaces] = useState({ cars: 0, motorcycles: 0, bikes: 0 });
  const [isSaved, setIsSaved] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  useEffect(() => {
    loadSpaces();
  }, [user.id]);
  
  const loadSpaces = async () => {
    try {
      const response = await fetch(`${API_URL}/parking/${user.id}/spaces/get`, {
        headers: { Authorization: `Bearer ${authTokens.access}` },
      });
      if (!response.ok) throw new Error('Error al cargar los espacios');
      const data = await response.json();
      console.log('Datos cargados:', data);
      setSpaces({
        cars: data.carCapacity || 0,
        motorcycles: data.motoCapacity || 0,
        bikes: data.bikeCapacity || 0,
      });
    } catch (error) {
      console.error(error);
    }
  };


  const handleIncrement = (type, increment) => {
    setSpaces(prev => ({ ...prev, [type]: Math.max(0, prev[type] + increment) }));
    setPendingChanges(true);
  };

  const saveChanges = async () => {
    try {
      const payload = {
        carCapacity: spaces.cars,
        bikeCapacity: spaces.bikes,
        motoCapacity: spaces.motorcycles
      };
  
      console.log("Enviando datos al servidor:", payload);
  
      const response = await fetch(`${API_URL}/parking/${user.id}/spaces/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);
  
      if (response.ok) {
        setIsSaved(true);
        setPendingChanges(false);
        setTimeout(() => setIsSaved(false), 3000);
        loadSpaces(); // Recargar los datos después de guardar
      } else {
        Alert.alert('Error', 'Hubo un problema al guardar los datos');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar los datos');
    }
  };
  

  const SpaceCard = ({ title, emoji, available, type }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.availableNumber}>{available}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleIncrement(type, -1)}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleIncrement(type, 1)}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Control de Espacios</Text>
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        <SpaceCard title="Vehículos" emoji="🚗" available={spaces.cars} type="cars" />
        <SpaceCard title="Motos" emoji="🏍️" available={spaces.motorcycles} type="motorcycles" />
        <SpaceCard title="Bicicletas" emoji="🚲" available={spaces.bikes} type="bikes" />
      </ScrollView>
      <TouchableOpacity
        style={[styles.saveButton, pendingChanges ? styles.activeSaveButton : styles.disabledSaveButton]}
        onPress={saveChanges}
        disabled={!pendingChanges}
      >
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity>
      {isSaved && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>¡Guardado con éxito!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 8 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  cardsContainer: { flex: 1, justifyContent: 'center', gap: 8 },
  card: { borderRadius: 8, padding: 8, backgroundColor: '#b1c8e7', height: '28%' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 24 },
  title: { fontSize: 16, fontWeight: 'bold' },
  cardContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  availableNumber: { fontSize: 32, fontWeight: 'bold' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  button: { backgroundColor: '#394c74', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#f5f5f5', fontSize: 20, fontWeight: 'bold' },
  saveButton: { padding: 12, borderRadius: 8, marginVertical: 16 },
  activeSaveButton: { backgroundColor: '#394c74' },
  disabledSaveButton: { backgroundColor: '#ccc' },
  saveButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  successMessage: { backgroundColor: '#5f6f95', padding: 8, borderRadius: 8, marginTop: 8 },
  successMessageText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default ParkingManager;
