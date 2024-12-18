import React, { useState } from 'react'; 
import { View, Text, Button, Switch, Alert, ScrollView,} from 'react-native';
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
import { Picker } from '@react-native-picker/picker';


const SignUp = ({ navigation }) => {
  const [isParking, setIsParking] = useState(false);
  const [step, setStep] = useState(1);
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
   // Estado para el vehículo seleccionado
   const [selectedVehicle, setSelectedVehicle] = useState(
    Object.keys(prices)[0] || '' // Selecciona el primer vehículo por defecto
  );
  

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

  // Validation utility functions
const validations = {
  // Email validation using a comprehensive regex
  validateEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  },

  // Password validation
  validatePassword: (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  },

  // Check if passwords match
  validatePasswordMatch: (password, repeatPassword) => {
    return password === repeatPassword;
  },

  // Validate age (must be 18 or older)
  validateAge: (birthDateString) => {
    // Convertir el formato de fecha local a un objeto Date
    const dateParts = birthDateString.includes('/') 
    ? birthDateString.split('/').map(Number)
    : birthDateString.split('.').map(Number);
  
  const [day, month, year] = dateParts;
    const dob = new Date(year, month - 1, day); // Resta 1 al mes porque en JS los meses son 0-indexed
    const today = new Date();
  
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    
    return age >= 18;
  },

  // Validate positive integer
  validatePositiveInteger: (value) => {
    return Number.isInteger(Number(value)) && Number(value) >= 0;
  },

  // Validate time range (start time before end time)
  validateTimeRange: (openTime, closeTime) => {
    if (!openTime || !closeTime) return false;
    
    const [openHours, openMinutes] = openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTime.split(':').map(Number);
    
    return openHours <= closeHours || 
           (openHours === closeHours && openMinutes < closeMinutes);
  },

  // Comprehensive user data validation
  validateUserData: (userData, isParking) => {
    const errors = {};

    // Name validation
    if (!userData.name || userData.name.trim().length < 2) {
      errors.name = 'Nombre debe tener al menos 2 caracteres';
    }

    // Email validation
    if (!validations.validateEmail(userData.email)) {
      errors.email = 'Correo electrónico inválido';
    }

    // Password validation
    if (!validations.validatePassword(userData.password)) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
    }

    // Password match validation
    if (!validations.validatePasswordMatch(userData.password, userData.repeatPassword)) {
      errors.repeatPassword = 'Las contraseñas no coinciden';
    }

    // Additional fields for driver
    if (!isParking) {
      // Surname validation
      if (!userData.surname || userData.surname.trim().length < 2) {
        errors.surname = 'Apellido debe tener al menos 2 caracteres';
      }

      // Birth date validation
      if (!userData.birthDate) {
        errors.birthDate = 'Fecha de nacimiento es requerida';
      } else if (!validations.validateAge(userData.birthDate)) {
        errors.birthDate = 'Debe ser mayor de 18 años';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate parking capacities
  validateCapacities: (capacities) => {
    const errors = {};
  
    // Validate that values are provided for each capacity
    ['carCapacity', 'bikeCapacity', 'motoCapacity'].forEach(capacity => {
      // Check if the value is undefined, null, or an empty string
      if (capacities[capacity] === undefined || 
          capacities[capacity] === null || 
          capacities[capacity] === '') {
        errors[capacity] = `${capacity === 'carCapacity' ? 'Capacidad de autos' : 
                             capacity === 'bikeCapacity' ? 'Capacidad de bicicletas' : 
                             'Capacidad de motos'} es requerida`;
      } 
      // If a value is provided, check if it's a valid non-negative integer
      else if (!validations.validatePositiveInteger(capacities[capacity])) {
        errors[capacity] = `Los números ingresados deben ser enteros no negativos`;
      }
    });
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate prices for each vehicle type
  validatePrices : (prices, currentVehicle) => {
    const errors = {};
    const vehiclePrices = prices[currentVehicle] || {};
    const periodosRequeridos = ['fraccion', 'hora', 'medio dia', 'dia completo'];
  
    periodosRequeridos.forEach(periodo => {
      const price = vehiclePrices[periodo];
      if (price === undefined || price === null || price === '') {
        errors[`${currentVehicle}_${periodo}`] = `Precio para ${currentVehicle} - ${periodo} es requerido`;
        return;
      }
  
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        errors[`${currentVehicle}_${periodo}`] = `Precio inválido para ${currentVehicle} - ${periodo}. Debe ser un número positivo.`;
      }
    });
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
  

  // Validate schedule
  validateSchedule: (schedule) => {
    const errors = {};
    let hasValidSchedule = true;
  
    // Lista de días esperados
    const diasSemana = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D', 'F'];
  
    diasSemana.forEach((day) => {
      const { openTime, closeTime } = schedule[day] || {};
  
      // Verificar si el horario está definido
      if (!openTime || !closeTime) {
        errors[day] = `Debe definir horarios de apertura y cierre para todos los días`;
        hasValidSchedule = false;
      } else if (!validations.validateTimeRange(openTime, closeTime)) {
        errors[day] = `El horario de apertura debe ser menor o igual al de cierre para el día ${day}`;
        hasValidSchedule = false;
      }
    });
  
    return {
      isValid: hasValidSchedule,
      errors,
    };
  }
};
  const validateStep = () => {
    if (step === 1) {
      const userValidation = validations.validateUserData(userData, isParking);
      if (!userValidation.isValid) {
        // Display first error found
        const firstErrorKey = Object.keys(userValidation.errors)[0];
        Alert.alert('Error de Validación', userValidation.errors[firstErrorKey]);
        return false;
      }
      return true;
    }
  
    if (isParking) {
      if (step === 2) {
        if (!userData.address) {
          Alert.alert('Error', 'Por favor, ingrese la dirección del estacionamiento.');
          return false;
        }
      }
  
      if (step === 3) {
        const capacityValidation = validations.validateCapacities(capacities);
        if (!capacityValidation.isValid) {
          const firstErrorKey = Object.keys(capacityValidation.errors)[0];
          Alert.alert('Error de Validación', capacityValidation.errors[firstErrorKey]);
          return false;
        }
      }
  
      if (step === 4) {
        const priceValidation = validations.validatePrices(prices, filteredVehiculos[vehiculoIndex]);
        if (!priceValidation.isValid) {
          const firstErrorKey = Object.keys(priceValidation.errors)[0];
          Alert.alert('Error de Validación', priceValidation.errors[firstErrorKey]);
          return false;
        }
      }
      if (step === 6) {
        const scheduleValidation = validations.validateSchedule(schedule);
      
        if (!scheduleValidation.isValid) {
          const firstErrorKey = Object.keys(scheduleValidation.errors)[0];
          const errorMessage = scheduleValidation.errors[firstErrorKey] || 'Debe definir horarios válidos para todos los días';
          Alert.alert('Error de Validación', errorMessage);
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
        <ScrollView contentContainerStyle={[{
          alignItems:'center',
          flexGrow: 1,}]}>
            <UserForm
              userData={userData}
              setUserData={setUserData}
              isParking={isParking}
            />
        </ScrollView>
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
                {/* Picker for vehicle selection */}
                <View style={{borderWidth: 1,
                  borderColor: theme.colors.secondary,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.background,
                  width: '100%'}}>
                  <Picker
                    selectedValue={selectedVehicle}
                    onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
                    style={styles.picker}
                  >
                    {Object.keys(prices).map((vehicle) => (
                      <Picker.Item key={vehicle} label={vehicle} value={vehicle} />
                    ))}
                  </Picker>
                </View>
                {/* Display selected vehicle prices */}
                <View style={styles.horizontalContainer}>
                  <Text style={[styles.label, styles.header]}>Periodo</Text>
                  <Text style={[styles.label, styles.header]}>Precio</Text>
                </View>
                {periodos.map((periodo) => (
                  <View key={periodo} style={styles.horizontalContainer}>
                    <Text style={styles.label}>{periodo}</Text>
                    <Text style={styles.label}>
                      {prices[selectedVehicle]?.[periodo] !== undefined
                        ? `$${prices[selectedVehicle][periodo]}`
                        : 'No definido'}
                    </Text>
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
                      <Text style={styles.label} key={day}>{day}: {schedule[day].openTime} - {schedule[day].closeTime}</Text>
                  );
                }
                return null;
              })}
          </View>
        </ScrollView> 
      )}
      {/* Footer */}
      <View style={styles.footer}>
      {step === 1 && (
        <CustomButton
        text={!isParking ? 'Registrarse' : 'Siguiente'}
        onPress={() => handleNavigation('next')}
        style={styles.navigationButton}
        textStyle={styles.navigationButtonText}
        />
      )}
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
