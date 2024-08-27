import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const UpdateSpace = () => {
  const [availableSpaces, setAvailableSpaces] = useState('');

  const onUpdatePressed = () => {
    // Lógica para actualizar el espacio disponible en la base de datos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Espacio Disponible</Text>
      <TextInput
        style={styles.input}
        placeholder="Espacios Disponibles"
        value={availableSpaces}
        onChangeText={setAvailableSpaces}
        keyboardType="numeric"
      />
      <Button
        title="Actualizar"
        onPress={onUpdatePressed}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 20,
  },
});

export default UpdateSpace;
