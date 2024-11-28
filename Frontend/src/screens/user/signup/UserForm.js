import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import CustomInput from '../../../components/CustomInput.js';
const UserForm = ({ isParking, name, surname, birthDate, setName, setSurname, setBirthDate}) => {
  return (
    <>
      <CustomInput
        style={styles.input}
        placeholder={isParking ? "Nombre del Estacionamiento" : "Nombre"}
        value={name}
        setValue={setName}
      />
      {!isParking && (
        <>
          <CustomInput
            style={styles.input}
            placeholder="Apellido"
            value={surname}
            setValue={setSurname}
          />
          <CustomInput
            style={styles.input}
            placeholder="Fecha de Nacimiento"
            value={birthDate}
            setValue={setBirthDate}
          />
        </>
      )}
    </>
  );
};

export default UserForm;
