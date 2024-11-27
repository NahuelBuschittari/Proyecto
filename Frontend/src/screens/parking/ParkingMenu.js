import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ParkingMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      <Button
        title="Análisis de datos"
        onPress={() => navigation.navigate('UpdateSpace')}
      />
      <Button
        title="Actualizar espacio disponible"
        onPress={() => navigation.navigate('UpdateSpace')}
      />
      <Button
        title="Actualizar precios"
        onPress={() => navigation.navigate('UpdateCharacteristics')}
      />
      <Button
        title="Información de pago"
        onPress={() => navigation.navigate('UpdateSpace')}
      />
      <Button
        title="Mi perfil"
        onPress={() => navigation.navigate('UpdateSpace')}
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
