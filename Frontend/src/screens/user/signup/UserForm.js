import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { styles } from './SharedStyles.js';

const UserForm = ({ isParking, name, surname, birthDate, setName, setSurname, setBirthDate}) => {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder={isParking ? "Nombre del Estacionamiento" : "Nombre"}
        value={name}
        onChangeText={setName}
      />
      {!isParking && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={surname}
            onChangeText={setSurname}
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de Nacimiento"
            value={birthDate}
            onChangeText={setBirthDate}
          />
        </>
      )}
    </>
  );
};

export default UserForm;
