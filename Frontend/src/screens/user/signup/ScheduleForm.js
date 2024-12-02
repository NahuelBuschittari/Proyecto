import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { styles } from '../../../styles/SharedStyles';

const ScheduleForm = ({ handleScheduleChange, schedule }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [is24Hours, setIs24Hours] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  // Función para manejar la selección o eliminación de días
  const toggleDay = (day) => {
    // Si el día ya tiene un horario asignado, eliminamos el horario
    if (schedule[day].openTime && schedule[day].closeTime) {
      // Eliminar el horario y actualizar el estado
      handleScheduleChange({
        days: [], // Reiniciar días seleccionados
        openTime: '',
        closeTime: '',
      });

      // Eliminar específicamente el horario de este día
      delete schedule[day].openTime;
      delete schedule[day].closeTime;
    } 
    // Si el día está en la lista de días seleccionados, lo deseleccionamos
    else if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } 
    // Si el día no está seleccionado, lo seleccionamos
    else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Función para agregar el horario a los días seleccionados

const addSchedule = () => {
  if (selectedDays.length === 0 || (openTime === '' && !is24Hours && !isClosed) || (closeTime === '' && !is24Hours && !isClosed)) {
    alert('Por favor, selecciona al menos un día y completa los horarios o selecciona 24 horas o Cerrado.');
    return;
  }

  // Actualizamos los horarios para los días seleccionados
  handleScheduleChange({
    days: selectedDays,
    openTime,
    closeTime,
  });

  // Limpiar los campos después de agregar
  setOpenTime('');
  setCloseTime('');
  setSelectedDays([]);
  setIs24Hours(false);
  setIsClosed(false);
};

  return (
    <ScrollView contentContainerStyle={styles2.container}>
      <View style={styles2.formContainer}>
        <Text style={styles.label}>Selecciona los días:</Text>
        <View style={styles2.daysContainer}>
          {['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D', 'F'].map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles2.dayButton,
                selectedDays.includes(day) ? styles2.selectedDay : null,
                schedule[day].openTime && schedule[day].closeTime
                  ? styles2.dayDisabled
                  : null, // Marca los días con horario asignado en gris
              ]}
              onPress={() => toggleDay(day)} // Seleccionar o deseleccionar días
            >
              <Text style={styles2.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Switches para 24 horas y Cerrado */}
        <View style={styles2.switchContainer}>
        <View style={styles2.switchItem}>
          <Text>24 Horas</Text>
          <Switch
            value={is24Hours}
            onValueChange={(value) => {
              setIs24Hours(value);
              if (value) {
                setIsClosed(false);
                setOpenTime('00:00');
                setCloseTime('23:59');
              } else {
                setOpenTime('');
                setCloseTime('');
              }
            }}
          />
        </View>
        <View style={styles2.switchItem}>
          <Text>Cerrado</Text>
          <Switch
            value={isClosed}
            onValueChange={(value) => {
              setIsClosed(value);
              if (value) {
                setIs24Hours(false);
                setOpenTime('00:00');
                setCloseTime('00:00');
              } else {
                setOpenTime('');
                setCloseTime('');
              }
            }}
          />
        </View>
      </View>
        <Text style={styles.label}>Horario:</Text>
        <View style={styles2.timeContainer}>
          <TextInput
            
            style={[styles2.timeInput, (is24Hours || isClosed) && styles2.disabledInput]}
            placeholder="Apertura"
            value={openTime}
            onChangeText={setOpenTime}
            editable={!(is24Hours || isClosed)}
          />
          <TextInput
            style={[styles2.timeInput, (is24Hours || isClosed) && styles2.disabledInput]}
            placeholder="Cierre"
            value={closeTime}
            onChangeText={setCloseTime}
            editable={!(is24Hours || isClosed)}
          />
        </View>

        <TouchableOpacity style={styles2.addButton} onPress={addSchedule}>
          <Text style={styles2.addButtonText}>Agregar Horario</Text>
        </TouchableOpacity>

        {/* Mostrar los horarios programados debajo */}
        {Object.keys(schedule).map((day) => {
          if (schedule[day].openTime && schedule[day].closeTime) {
            return (
              <View key={day} style={styles2.scheduledItem}>
                <Text style={styles2.scheduledDays}>{day}</Text>
                <Text style={styles2.scheduledTime}>
                  {schedule[day].openTime} - {schedule[day].closeTime}
                </Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    </ScrollView>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 40,
  },
  formContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedDay: {
    backgroundColor: '#007aff',
    color: '#fff',
  },
  dayDisabled: {
    backgroundColor: '#d3d3d3', // Gris para los días con horario asignado
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  addButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduledContainer: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 10,
  },
  scheduledItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduledDays: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduledTime: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default ScheduleForm;
