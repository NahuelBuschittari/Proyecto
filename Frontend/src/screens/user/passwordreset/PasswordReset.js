import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';

const PasswordReset = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const onSignInPressed = () => {
    navigation.navigate('PasswordSet');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar contraseña</Text>
      
      <CustomInput 
        placeholder="Email" 
        value={email} 
        setValue={setEmail} 
      />

      <CustomButton 
        text="Enviar e-mail" 
        onPress={onSignInPressed} 
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
    backgroundColor: '#f5f5f5', // Wild Sand
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a0a0a', // Black
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#394c74', // East Bay
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  signupButton: {
    backgroundColor: '#8ba4c1', // Nepal
  },
  signupButtonText: {
    color: '#0a0a0a', // Black
  },
});

export default PasswordReset;
