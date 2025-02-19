import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {styles} from '../../styles/SharedStyles';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Intentando login en URL:", `${API_URL}/auth/jwt/create/`);
      console.log("Con credenciales:", { email, password });
      await login(email, password);
    } catch (error) {
      if (error.response?.data?.detail === "No active account found with the given credentials") {
        Alert.alert(
          'Error de inicio de sesión',
          'Usuario y/o contraseña incorrectos'
        );
      } else {
        Alert.alert(
          'Error de inicio de sesión',
          `Error: ${error.message}\n${JSON.stringify(error.response?.data || {})}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('PasswordReset'); 
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <CustomInput 
        placeholder="Email" 
        value={email} 
        setValue={setEmail} 
      />
      
      <View style={[styles2.passwordInputContainer]}>
        <CustomInput
          placeholder="Contraseña"
          value={password}
          setValue={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity 
          onPress={togglePasswordVisibility}
          style={styles2.passwordVisibilityButton}
        >
          <Text>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onForgotPasswordPressed}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <CustomButton 
        text="Iniciar Sesión" 
        onPress={handleLogin} 
      />
      
      <CustomButton 
        text="Crear Cuenta" 
        onPress={onSignUpPressed} 
        style={styles.signupButton} 
        textStyle={styles.signupButtonText}
      />

      {isLoading && (
        <View style={styles2.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const styles2 = StyleSheet.create({
  passwordInputContainer: {
    position: 'static',
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordVisibilityButton: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Login;