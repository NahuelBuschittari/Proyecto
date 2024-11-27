import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ value, setValue, placeholder, secureTextEntry }) => {
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#394c74" // East Bay color
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#b1c8e7', // Spindle
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    width: '80%',
    color: '#0a0a0a', // Black
  },
});

export default CustomInput;
