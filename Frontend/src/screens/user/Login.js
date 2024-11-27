import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPressed = () => {
    navigation.navigate('ParkingMenu');
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('PasswordReset'); // O la pantalla que maneje el "Olvidé mi contraseña"
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <CustomInput 
        placeholder="Email" 
        value={email} 
        setValue={setEmail} 
      />
      
      <CustomInput 
        placeholder="Contraseña" 
        value={password} 
        setValue={setPassword} 
        secureTextEntry 
      />

      {/* Link de "¿Olvidaste tu contraseña?" */}
      <TouchableOpacity onPress={onForgotPasswordPressed}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <CustomButton 
        text="Iniciar Sesión" 
        onPress={onSignInPressed} 
      />
      
      <CustomButton 
        text="Crear Cuenta" 
        onPress={onSignUpPressed} 
        style={styles.signupButton} 
        textStyle={styles.signupButtonText}
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

export default Login;
