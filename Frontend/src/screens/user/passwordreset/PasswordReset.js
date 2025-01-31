import React, { useState } from 'react';
import { View, Text,Alert} from 'react-native';
import CustomInput from '../../../components/CustomInput';
import CustomButton from '../../../components/CustomButton';
import axios from 'axios';
import {styles} from '../../../styles/SharedStyles';
import { API_URL } from '../../../context/constants';
const PasswordReset = () => {
  const [email, setEmail] = useState('');

  const onSendPressed = async (email) => {
    try {
      email = email.toLowerCase();
      console.log("Email: ", email); // Verifica si este log aparece
  
      const response = await axios.post(`${API_URL}/auth/users/reset_password/`, { email });
  
      if (response.status === 204) {
        Alert.alert("Revise su casilla de correo para restablecer la contraseña.");
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
      Alert.alert("Hubo un error al enviar el correo. Inténtelo de nuevo.");
    }
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
        onPress={() => onSendPressed(email)} 
      />
    </View>
  );
};

export default PasswordReset;
