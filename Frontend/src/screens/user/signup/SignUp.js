import React, { useState } from 'react'; 
import { View, Text, Button, Switch, Alert, ScrollView } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import CustomButton from '../../../components/CustomButton.js';
import CustomInput from '../../../components/CustomInput.js';
import UserForm from './UserForm';
import AddressForm from './AddressForm';
import VehiclePricesForm from './VehiclePricesForm';
import CharacteristicsForm from './CharacteristicsForm.js';
import ScheduleForm from './ScheduleForm.js';
import CapacityForm from './CapacityForm.js';

const SignUp = ({ navigation }) => {
  const [isParking, setIsParking] = useState(false);
  const [step, setStep] = useState(4);
  const [vehiculoIndex, setVehiculoIndex] = useState(0);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    surname: '',
    birthDate: '',
    repeatPassword: '',
    address: '',
  });

  const [capacities, setCapacities] = useState({
    carCapacity: '',
    bikeCapacity: '',
    motoCapacity: '',
  });

  const [features, setFeatures] = useState({
    isCovered: false,
    has24hSecurity: false,
    hasCCTV: false,
    hasValetService: false,
    hasDisabledParking: false,
    hasEVChargers: false,
    hasAutoPayment: false,
    hasCardAccess: false,
    hasCarWash: false,
    hasRestrooms: false,
    hasBreakdownAssistance: false,
    hasFreeWiFi: false,
  });

  const formatFeatureLabel = (key) => {
    const labels = {
      isCovered: 'Techado',
      has24hSecurity: 'Seguridad 24h',
      hasCCTV: 'Cámaras de Seguridad',
      hasValetService: 'Servicio de Valet',
      hasDisabledParking: 'Estacionamiento para Discapacitados',
      hasEVChargers: 'Cargadores para Vehículos Eléctricos',
      hasAutoPayment: 'Pago Automático',
      hasCardAccess: 'Acceso con Tarjeta',
      hasCarWash: 'Lavado de Autos',
      hasRestrooms: 'Baños',
      hasBreakdownAssistance: 'Asistencia en Carretera',
      hasFreeWiFi: 'WiFi Gratuito',
    };
    return labels[key] || key;
  };
  

  const [prices, setPrices] = useState({
    Auto: {},
    Camioneta: {},
    Moto: {},
    Bicicleta: {},
  });

  const [schedule, setSchedule] = useState({
    L: { openTime: '', closeTime: '' },
    Ma: { openTime: '', closeTime: '' },
    Mi: { openTime: '', closeTime: '' },
    J: { openTime: '', closeTime: '' },
    V: { openTime: '', closeTime: '' },
    S: { openTime: '', closeTime: '' },
    D: { openTime: '', closeTime: '' },
    F: { openTime: '', closeTime: '' },
  });

  const periodos = ['fraccion', 'hora', 'medio dia', 'dia completo'];
  const vehiculos = ['Auto', 'Camioneta', 'Moto', 'Bicicleta'];
  const vehiculo = vehiculos[vehiculoIndex];

  const validateStep = () => {
    if (step === 1) {
      return (
        userData.email &&
        userData.password &&
        userData.name &&
        (isParking || (userData.surname && userData.birthDate))
      );
    }
    if (step === 2) return !!userData.address;
    if (step === 3) {
      const { carCapacity, bikeCapacity, motoCapacity } = capacities;
      return carCapacity && bikeCapacity && motoCapacity;
    }
    if (step === 6) {
      return Object.values(schedule).some(
        (day) => day.openTime && day.closeTime
      );
    }
    return true;
  };

  const handleNavigation = (direction) => {
    if (direction === 'back' && step > 1) {
      if (vehiculoIndex > 0) {
        setVehiculoIndex((prev) => prev - 1);
      } else {
        setStep((prev) => prev - 1);
      }
    } else if (direction === 'next') {
      if (validateStep()) {
        if (step === 4 && vehiculoIndex < vehiculos.length - 1) {
          setVehiculoIndex((prev) => prev + 1);
        } else {
          setStep((prev) => prev + 1);
        }
      } else {
        Alert.alert('Error', 'Por favor, complete todos los campos requeridos.');
      }
    }
  };

  const handlePriceChange = (vehiculo, periodo, value) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [vehiculo]: {
        ...prevPrices[vehiculo],
        [periodo]: value,
      },
    }));
  };

  const updateFeature = (key, value) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  const handleScheduleChange = (newSchedule) => {
    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      newSchedule.days.forEach((day) => {
        updatedSchedule[day] = {
          openTime: newSchedule.openTime,
          closeTime: newSchedule.closeTime,
        };
      });
      return updatedSchedule;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.cardTitle}>
          {isParking ? 'Registro de Estacionamiento' : 'Registro de Usuario'}
        </Text>
        <Switch
          value={isParking}
          onValueChange={(value) => {
            setIsParking(value);
            setStep(1);
          }}
        />
      </View>

      {step === 1 && (
      <> 
        <UserForm
          userData={userData}
          setUserData={setUserData}
          isParking={isParking}
        />
        <CustomButton
          text={!isParking ? 'Registrarse' : 'Siguiente'}
          onPress={() => handleNavigation('next')}
          style={styles.navigationButton}
          textStyle={styles.navigationButtonText}
        />
      </>
      )}

      {step === 2 && (
        <AddressForm
          address={userData.address}
          setAddress={(value) =>
            setUserData((prev) => ({ ...prev, address: value }))
          }
        />
      )}

      {step === 3 && (
        <CapacityForm
          capacities={capacities}
          setCapacities={setCapacities}
        />
      )}

      {step === 4 && (
        <VehiclePricesForm
          vehiculo={vehiculo}
          periodos={periodos}
          handlePriceChange={handlePriceChange}
          prices={prices[vehiculo] || {}}
        />
      )}

      {step === 5 && (
        <CharacteristicsForm
          features={features}
          updateFeature={updateFeature}
        />
      )}

      {step === 6 && (
        <ScheduleForm
          schedule={schedule}
          handleScheduleChange={handleScheduleChange}
        />
      )}

      {step === 7 && (
        <>
          <Text style={styles.title}>Resumen de Registro</Text>
          {/* Resumen de datos */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información Personal</Text>
            <Text style={styles.label}>Nombre: {userData.name} {userData.surname}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Dirección: {userData.address}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Capacidades</Text>
            <Text style={styles.label}>Autos: {capacities.carCapacity}</Text>
            <Text style={styles.label}>Motos: {capacities.motoCapacity}</Text>
            <Text style={styles.label}>Bicicletas: {capacities.bikeCapacity}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Precios por Vehículo</Text>
            {Object.keys(prices).length > 0 ? (
              <>
                {/* Encabezados para los períodos */}
                <View style={styles.horizontalContainer}>
                  <Text style={[styles.label, styles.header]}>Vehículo</Text>
                  {Object.keys(prices[Object.keys(prices)[0]]).map((periodo) => (
                    <Text key={periodo} style={[styles.label, styles.header]}>
                      {periodo}
                    </Text>
                  ))}
                </View>

                {/* Filas con los precios */}
                {Object.keys(prices).map((vehiculo) => (
                  <View key={vehiculo} style={styles.horizontalContainer}>
                    <Text style={styles.label}>{vehiculo}</Text>
                    {Object.keys(prices[vehiculo]).map((periodo) => (
                      <Text key={periodo} style={styles.label}>
                        ${prices[vehiculo][periodo] || 'No definido'}
                      </Text>
                    ))}
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.errorText}>No hay precios definidos.</Text>
            )}
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Características Seleccionadas</Text>
            {Object.keys(features).map((key) =>
              features[key] ? (
                <Text key={key} style={styles.label}>
                  • {formatFeatureLabel(key)}
                </Text>
              ) : null
            )}
          </View>

          <View style={styles.card}>
            <Text  style={styles.cardTitle}>Horarios</Text>
            {Object.keys(schedule).map((day) => {
                if (schedule[day].openTime && schedule[day].closeTime) {
                  return (
                      <Text key={day}>{day}: {schedule[day].openTime} - {schedule[day].closeTime}</Text>
                  );
                }
                return null;
              })}
          </View>
        </>
      )}
      {step > 1 && (
      <View style={styles.buttonContainer}>        
          <CustomButton
            text="Atrás"
            onPress={() => handleNavigation('back')}
            style={styles.navigationButton}
            textStyle={styles.navigationButtonText}
          />
        <CustomButton
          text={step === 7 ? 'Finalizar Registro' : 'Siguiente'}
          onPress={() => handleNavigation('next')}
          style={styles.navigationButton}
          textStyle={styles.navigationButtonText}
        />
      </View>
      )}
    </ScrollView>
  );
};

export default SignUp;
