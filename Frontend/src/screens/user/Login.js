import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {styles} from '../../styles/SharedStyles';

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
    navigation.navigate('PasswordReset'); 
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

export default Login;
