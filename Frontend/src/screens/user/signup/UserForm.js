import React, {useState} from 'react';
import { Modal,Button,Text, View, TouchableOpacity, StyleSheet, TextInput ,Pressable, Platform} from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import CustomInput from '../../../components/CustomInput.js';
import CustomButton from '../../../components/CustomButton.js';
import { theme } from '../../../styles/theme.js';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserForm = ({ userData, setUserData, isParking }) => {
  const handleInputChange = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };
  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      const formattedDate = currentDate.toLocaleDateString();
    handleInputChange('birthDate', formattedDate);
    }
    toggleDatepicker();
  };
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const getMaximumBirthDate = () => {
    const today = new Date();
    return new Date(
      today.getFullYear() - 18, 
      today.getMonth(), 
      today.getDate()
    );
  };
  const toggleDatepicker=()=>{
    setShowPicker(!showPicker);
  }
  return (
    <>
      <Text style={styles.upperInputText}>{isParking ? "Nombre del Estacionamiento" : "Nombre"}</Text>
      <CustomInput
        placeholder={isParking ? "Introduce el nombre del estacionamiento" : "Introduce tu nombre"}
        value={userData.name}
        setValue={(value) => handleInputChange('name', value)}
        keyboardType="default"
        autoFocus={true}
      />
      {!isParking && (
        <>
          <Text style={styles.upperInputText}>Apellido</Text>
          <CustomInput
            placeholder="Introduce tu apellido"
            value={userData.surname}
            setValue={(value) => handleInputChange('surname', value)}
            keyboardType="default"
          />
          <Text style={styles.upperInputText}>Fecha de nacimiento</Text>
          <Pressable onPress={toggleDatepicker} style={[{width:'100%', alignItems:'center'}]}>
            <TextInput
            placeholder="Introduzca fecha de Nacimiento"
            value={userData.birthDate}
            setValue={(value) => handleInputChange('birthDate', value)}
            editable={false}
            onPressIn={toggleDatepicker}
            style={styles2.input}
            />            
          </Pressable>
          {showPicker && (
           <DateTimePicker
            mode="date"
            display="default"
            value={date}
            onChange={onChange}
            maximumDate={getMaximumBirthDate()}
          />
          )} 
        </>
      )}
      <Text style={styles.upperInputText}>Email</Text>
      <CustomInput
        placeholder="nombre@ejemplo.com"
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
        placeholder="Crea una contraseña segura"
        value={userData.password}
        setValue={(value) => handleInputChange('password', value)}
        secureTextEntry={!showPassword}
        keyboardType="default"        
      />
      <Text style={styles.upperInputText}>Repetir contraseña</Text>
      <CustomInput
        placeholder="Repite tu Contraseña"
        value={userData.repeatPassword}
        setValue={(value) => handleInputChange('repeatPassword', value)}
        secureTextEntry={!showPassword}
        keyboardType="default"
      />
    </>
  );
};
const styles2 = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    width: '80%',
    color: theme.colors.text,
  },
});
export default UserForm;
