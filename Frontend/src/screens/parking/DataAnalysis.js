import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const DataAnalysis = () => {
  const [characteristics, setCharacteristics] = useState('');

  const onUpdatePressed = () => {
    // Lógica para actualizar las características en la base de datos
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Características</Text>
      <TextInput
        style={styles.input}
        placeholder="Características"
        value={characteristics}
        onChangeText={setCharacteristics}
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
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});

export default DataAnalysis;
