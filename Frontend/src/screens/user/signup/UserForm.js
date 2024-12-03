import React, {useState} from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import CustomInput from '../../../components/CustomInput.js';
import { theme } from '../../../styles/theme.js';

const UserForm = ({ userData, setUserData, isParking }) => {
  const handleInputChange = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Text style={styles.upperInputText}>{isParking ? "Nombre del Estacionamiento" : "Nombre"}</Text>
      <CustomInput
        placeholder={isParking ? "Nombre del Estacionamiento" : "Nombre"}
        value={userData.name}
        setValue={(value) => handleInputChange('name', value)}
      />
      {!isParking && (
        <>
          <Text style={styles.upperInputText}>Apellido</Text>
          <CustomInput
            placeholder="Apellido"
            value={userData.surname}
            setValue={(value) => handleInputChange('surname', value)}
          />
          <Text style={styles.upperInputText}>Fecha de nacimiento</Text>
          <CustomInput
            placeholder="Fecha de Nacimiento"
            value={userData.birthDate}
            setValue={(value) => handleInputChange('birthDate', value)}
          />
        </>
      )}
      <Text style={styles.upperInputText}>Email</Text>
      <CustomInput
        placeholder="Correo Electrónico"
        value={userData.email}
        setValue={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
      />
      <View style={styles.horizontalContainer}>
        <Text style={styles.upperInputText}>Contraseña</Text>
        <TouchableOpacity  style={{paddingRight:'12%'}} onPress={() => setShowPassword(!showPassword)}>
          <Text>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>
      <CustomInput
        placeholder="Contraseña"
        value={userData.password}
        setValue={(value) => handleInputChange('password', value)}
        secureTextEntry={!showPassword}        
      />
        <Text style={styles.upperInputText}>Retetir contraseña</Text>
      <CustomInput
        placeholder="Repetir Contraseña"
        value={userData.repeatPassword}
        setValue={(value) => handleInputChange('repeatPassword', value)}
        secureTextEntry={!showPassword}
      />
    </>
  );
};

export default UserForm;
