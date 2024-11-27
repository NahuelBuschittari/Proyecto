import React from 'react';
import { TextInput } from 'react-native';
import { styles } from './SharedStyles.js';
const ParkingForm = ({ name, totalCapacity, characteristics, setName, setTotalCapacity, setCharacteristics }) => (
  <>
    <TextInput
      style={styles.input}
      placeholder="Nombre del Estacionamiento"
      value={name}
      onChangeText={setName}
    />
    <TextInput
      style={styles.input}
      placeholder="Capacidad"
      value={totalCapacity}
      onChangeText={setTotalCapacity}
    />
    <TextInput
      style={styles.input}
      placeholder="Características"
      value={characteristics}
      onChangeText={setCharacteristics}
    />
  </>
);

export default ParkingForm;
