import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './SharedStyles';

const ScheduleForm = ({ handleScheduleChange, schedule }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horario de Estacionamiento</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Lunes a Viernes</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Desde" 
            value={schedule['weekdays']?.desde} 
            onChangeText={(text) => handleScheduleChange('weekdays', 'desde', text)} 
          />
          <TextInput
            style={styles.input}
            placeholder="Hasta" 
            value={schedule['weekdays']?.hasta} 
            onChangeText={(text) => handleScheduleChange('weekdays', 'hasta', text)} 
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sábados, Domingos y Feriados</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Desde" 
            value={schedule['weekend']?.desde} 
            onChangeText={(text) => handleScheduleChange('weekend', 'desde', text)} 
          />
          <TextInput
            style={styles.input}
            placeholder="Hasta" 
            value={schedule['weekend']?.hasta} 
            onChangeText={(text) => handleScheduleChange('weekend', 'hasta', text)} 
          />
        </View>
      </View>
    </View>
  );
};

export default ScheduleForm;
