// CustomInput.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const CustomInput = ({ 
  value, 
  setValue, 
  placeholder, 
  secureTextEntry,
  style 
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder={placeholder}
      style={[styles.input, style]}
      secureTextEntry={secureTextEntry}
      placeholderTextColor={theme.colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    width: '80%',
    color: theme.colors.text,
  },
});

export default CustomInput;