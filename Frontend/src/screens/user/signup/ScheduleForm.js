import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, Pressable } from 'react-native';
import { styles } from '../../../styles/SharedStyles';
import CustomButton from '../../../components/CustomButton';
import { theme } from '../../../styles/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
const ScheduleForm = ({ handleScheduleChange, schedule }) => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [is24Hours, setIs24Hours] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const toggleDay = (day) => {
    if (schedule[day]?.openTime && schedule[day]?.closeTime) {
      handleScheduleChange({
        days: [],
        openTime: '',
        closeTime: '',
      });
      delete schedule[day].openTime;
      delete schedule[day].closeTime;
    } else if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const addSchedule = () => {
    if (
      selectedDays.length === 0 ||
      (openTime === '' && !is24Hours && !isClosed) ||
      (closeTime === '' && !is24Hours && !isClosed)
    ) {
      alert('Selecciona al menos un día y completa los horarios o selecciona 24 horas o Cerrado.');
      return;
    }

    handleScheduleChange({
      days: selectedDays,
      openTime,
      closeTime,
    });

    setOpenTime('');
    setCloseTime('');
    setSelectedDays([]);
    setIs24Hours(false);
    setIsClosed(false);
  };

  return (
    <View style={styles2.container}>
      <Text style={styles.label}>Selecciona los días:</Text>
      <View style={styles2.daysContainer}>
        {['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D', 'F'].map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles2.dayButton,
              selectedDays.includes(day) && styles2.selectedDay,
              schedule[day]?.openTime && schedule[day]?.closeTime && styles2.dayDisabled,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles2.dayText,
                selectedDays.includes(day) ? { color: '#fff' } : { color: theme.colors.text },
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles2.switchContainer}>
        <View style={styles2.switchItem}>
          <Text style={styles.label}>24 Horas</Text>
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
          <Text style={styles.label}>Cerrado</Text>
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
          style={[
            styles2.timeInput,
            (is24Hours || isClosed) && styles2.disabledInput,
          ]}
          placeholder="Apertura"
          value={openTime}
          onChangeText={setOpenTime}
          editable={!(is24Hours || isClosed)}
        />
        <TextInput
          style={[
            styles2.timeInput,
            (is24Hours || isClosed) && styles2.disabledInput,
          ]}
          placeholder="Cierre"
          value={closeTime}
          onChangeText={setCloseTime}
          editable={!(is24Hours || isClosed)}
          keyboardType='numeric'
        />
        <CustomButton
          style={styles2.addButton}
          textStyle={styles.navigationButtonText}
          onPress={addSchedule}
          text="+"
        />
      </View>
      {Object.keys(schedule).map((day) => (
        schedule[day]?.openTime && schedule[day]?.closeTime ? (
          <View key={day} style={styles2.scheduledItem}>
            <Text style={styles2.scheduledDays}>{day}</Text>
            <Text style={styles2.scheduledTime}>
              {schedule[day].openTime} - {schedule[day].closeTime}
            </Text>
          </View>
        ) : null
      ))}
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    alignSelf: 'center',
  },
  daysContainer: {
    flexWrap:'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  dayButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary,
  },
  dayDisabled: {
    backgroundColor: theme.colors.secondary,
  },
  dayText: {
    fontSize: theme.typography.fontSize.normal,
    fontWeight: theme.typography.fontWeight.bold,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    width:'10%'
  },
  scheduledItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.sm,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
  },
  scheduledDays: {
    fontSize: theme.typography.fontSize.normal,
    color: theme.colors.primary,
  },
  scheduledTime: {
    fontSize: theme.typography.fontSize.normal,
    color: theme.colors.text,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default ScheduleForm;

