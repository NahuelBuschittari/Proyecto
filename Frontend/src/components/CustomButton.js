import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const CustomButton = ({ 
  text, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  style,
  textStyle 
}) => {
  const buttonVariants = {
    primary: {
      backgroundColor: disabled ? theme.colors.secondary : theme.colors.primary,
      textColor: theme.colors.background,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      textColor: theme.colors.text,
    },
  };

  const currentVariant = buttonVariants[variant];

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button, 
        { backgroundColor: currentVariant.backgroundColor },
        style
      ]}
    >
      <Text 
        style={[
          styles.buttonText, 
          { color: currentVariant.textColor },
          textStyle
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '80%',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  buttonText: {
    fontSize: theme.typography.fontSize.normal,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default CustomButton;