import React, { useState } from 'react'; 
import { View, Text, Button, Switch, Alert, ScrollView, KeyboardAvoidingView, } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import CustomButton from '../../../components/CustomButton.js';
import CustomInput from '../../../components/CustomInput.js';
import UserForm from './UserForm';
import AddressForm from './AddressForm';
import VehiclePricesForm from './VehiclePricesForm';
import CharacteristicsForm from './CharacteristicsForm.js';
import ScheduleForm from './ScheduleForm.js';
import CapacityForm from './CapacityForm.js';
import { theme } from '../../../styles/theme.js';


const SignUp = ({ navigation }) => {
  const [isParking, setIsParking] = useState(false);
  const [step, setStep] = useState(5);
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

  const validateStep = () => {
    if (step === 1) {
      // Validación para el formulario principal
      const userFormValid = userData.email && userData.password && userData.name;
      const additionalUserFieldsValid = isParking || (userData.surname && userData.birthDate);
  
      if (!userFormValid) {
        Alert.alert('Error', 'Por favor, complete el nombre, correo y contraseña.');
        return false;
      }
  
      if (!additionalUserFieldsValid) {
        Alert.alert('Error', 'Por favor, complete el apellido y la fecha de nacimiento.');
        return false;
      }
  
      return true;
    }
  
    if (isParking) {
      // Validaciones adicionales solo si es un estacionamiento
      if (step === 2) {
        if (!userData.address) {
          Alert.alert('Error', 'Por favor, ingrese la dirección del estacionamiento.');
          return false;
        }
      }
  
      if (step === 3) {
        const { carCapacity, bikeCapacity, motoCapacity } = capacities;
        if (!carCapacity || !bikeCapacity || !motoCapacity) {
          Alert.alert('Error', 'Por favor, complete las capacidades para cada vehículo (0 si no tiene).');
          return false;
        }
      }
  
      if (step === 4) {
        const vehiculoPricesValid = Object.keys(prices[vehiculos[vehiculoIndex]] || {}).length > 0;
        if (!vehiculoPricesValid) {
          Alert.alert('Error', `Por favor, complete los precios para ${vehiculos[vehiculoIndex]}.`);
          return false;
        }
      }
  
      if (step === 6) {
        const scheduleValid = Object.values(schedule).some(
          (day) => day.openTime && day.closeTime
        );
        if (!scheduleValid) {
          Alert.alert('Error', 'Por favor, ingrese los horarios de apertura y cierre.');
          return false;
        }
      }
      if (step === 7) {
        Alert.alert(
          'Registro exitoso',
          isParking ? 'Estacionamiento registrado correctamente.' : '¡Bienvenido!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }
      
    }
  
    return true;
  };
  
  const filteredVehiculos = vehiculos.filter((tipo) => {
    if (tipo === 'Auto' || tipo === 'Camioneta') {
      return parseInt(capacities.carCapacity) > 0;
    }
    if (tipo === 'Moto') {
      return parseInt(capacities.motoCapacity) > 0;
    }
    if (tipo === 'Bicicleta') {
      return parseInt(capacities.bikeCapacity) > 0;
    }
    return false;
  });
  

  const handleNavigation = (direction) => {
    if (direction === 'back' && step > 1) {
      if (vehiculoIndex > 0) {
        setVehiculoIndex((prev) => prev - 1);
      } else {
        setStep((prev) => prev - 1);
      }
    } else if (direction === 'next') {
      if (validateStep()) {
        if (step === 1 && !isParking) {
          Alert.alert('Registro exitoso', '¡Bienvenido!', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
          return;
        }
  
        if (step === 4 && vehiculoIndex < filteredVehiculos.length - 1) {
          setVehiculoIndex((prev) => prev + 1);
        } else {
          setStep((prev) => prev + 1);
        }
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
      <View style={styles.mapPlaceholder}>
        <AddressForm
          address={userData.address}
          setAddress={(value) =>
            setUserData((prev) => ({ ...prev, address: value }))
          }
        />
      </View>
      )}

      {step === 3 && (
        <CapacityForm
          capacities={capacities}
          setCapacities={setCapacities}
        />
      )}

      {step === 4 && (
      <ScrollView style={styles.scrollContent}> 
        <VehiclePricesForm
          vehiculo={filteredVehiculos[vehiculoIndex]}
          periodos={periodos}
          handlePriceChange={handlePriceChange}
          prices={prices[filteredVehiculos[vehiculoIndex]] || {}}
        />
      </ScrollView>
      )}


      {step === 5 && (
      <ScrollView style={styles.scrollContent}> 
        <CharacteristicsForm
          features={features}
          updateFeature={updateFeature}
        />
      </ScrollView>
      )}

      {step === 6 && (
      <ScrollView style={styles.scrollContent}> 
          <ScheduleForm
            schedule={schedule}
            handleScheduleChange={handleScheduleChange}
          />
      </ScrollView> 
      )}

      {step === 7 && (
        <ScrollView style={styles.scrollContent}> 
          <Text style={styles.title}>Resumen de Registro</Text>
          {/* Resumen de datos */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Información Personal</Text>
            <Text style={styles.label}>Nombre: {userData.name} {userData.surname}</Text>
            <Text style={styles.label}>Email: {userData.email}</Text>
            <Text style={styles.label}>Dirección: {userData.address}</Text>
            <Text style={styles.label}>Fecha de nacimiento: {userData.birthDate}</Text>
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
        </ScrollView> 
      )}
      {/* Footer */}
      <View style={styles.footer}>
      {step > 1 && (
        <>
          <CustomButton
            text="Atrás"
            onPress={() => handleNavigation('back')}
            style={styles.navigationButton}
          />        
          <CustomButton
            text={step === 7 ? 'Finalizar' : 'Siguiente'}
            onPress={() => handleNavigation('next')}
            style={styles.navigationButton}
          />
        </>   
      )}
        
    </View>
    </View>
  );
};

export default SignUp;
