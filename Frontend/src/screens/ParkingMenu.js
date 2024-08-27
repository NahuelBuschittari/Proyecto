import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ParkingMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      <Button
        title="Actualizar Espacio Disponible"
        onPress={() => navigation.navigate('UpdateSpace')}
      />
      <Button
        title="Actualizar Características"
        onPress={() => navigation.navigate('UpdateCharacteristics')}
      />
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
});

export default ParkingMenu;
