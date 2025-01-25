import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {styles} from '../../styles/SharedStyles';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async () => {
    try {
      console.log("Intentando login en URL:", `${API_URL}/auth/jwt/create/`);
      console.log("Con credenciales:", { email, password });
      await login(email, password);
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Error message:", error.message);
      Alert.alert(
        'Error de inicio de sesión',
        `Error: ${error.message}\n${JSON.stringify(error.response?.data || {})}`
      );
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
  }
});

export default Login;
