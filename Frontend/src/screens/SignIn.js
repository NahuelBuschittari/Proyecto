import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SignIn = () => {
  const [isParking, setIsParking] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState(''); // Añadido para usuarios
  const [prices, setPrices] = useState(''); // Añadido para estacionamientos
  const [totalCapacity, setTotalCapacity] = useState(''); // Añadido para estacionamientos
  const [characteristics, setCharacteristics] = useState(''); // Añadido para estacionamientos
  const [address, setAddress] = useState(''); // Añadido para estacionamientos

  const onSignUpPressed = () => {
    // Lógica para manejar el registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Switch
        value={isParking}
        onValueChange={setIsParking}
      />
      <Text>{isParking ? 'Registro de Estacionamiento' : 'Registro de Usuario'}</Text>
      {isParking ? (
        <>
          <CustomInput placeholder="Nombre del Estacionamiento" value={name} setValue={setName} />
          <CustomInput placeholder="Precios" value={prices} setValue={setPrices} />
          <CustomInput placeholder="Capacidad Total" value={totalCapacity} setValue={setTotalCapacity} />
          <CustomInput placeholder="Características" value={characteristics} setValue={setCharacteristics} />
          <CustomInput placeholder="Dirección" value={address} setValue={setAddress} />
        </>
      ) : (
        <>
          <CustomInput placeholder="Nombre" value={name} setValue={setName} />
          <CustomInput placeholder="Apellido" value={surname} setValue={setSurname} />
          <CustomInput placeholder="Fecha de Nacimiento" value={birthDate} setValue={setBirthDate} />
        </>
      )}
      <CustomInput placeholder="Email" value={email} setValue={setEmail} />
      <CustomInput placeholder="Contraseña" value={password} setValue={setPassword} secureTextEntry />
      <CustomButton text="Registrarse" onPress={onSignUpPressed} />
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

export default SignIn;
