import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPressed = () => {
    navigation.navigate('ParkingMenu')
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput placeholder="Contraseña" value={password} setValue={setPassword} secureTextEntry />
      <CustomButton text="Iniciar Sesión" onPress={onSignInPressed} />
      <CustomButton text="Crear Cuenta" onPress={onSignUpPressed} />
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
});

export default Login;
