import React, { useState } from 'react'; 
import { View,  Text, Button, Switch, Alert, ScrollView } from 'react-native';
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
  const [step, setStep] = useState(1);
  const [vehiculoIndex, setVehiculoIndex] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [carCapacity, setCarCapacity] = useState('');
  const [bikeCapacity, setBikeCapacity] = useState('');
  const [motoCapacity, setMotoCapacity] = useState('');

  const [address, setAddress] = useState('');

  const [prices, setPrices] = useState({
    Auto: {},
    Camioneta: {},
    Moto: {},
    Bicicleta: {}
  });

  const [isCovered, setIsCovered] = useState(false);
  const [has24hSecurity, setHas24hSecurity] = useState(false);
  const [hasCCTV, setHasCCTV] = useState(false);
  const [hasValetService, setHasValetService] = useState(false);
  const [hasDisabledParking, setHasDisabledParking] = useState(false);
  const [hasEVChargers, setHasEVChargers] = useState(false);
  const [hasAutoPayment, setHasAutoPayment] = useState(false);
  const [hasCardAccess, setHasCardAccess] = useState(false);
  const [hasCarWash, setHasCarWash] = useState(false);
  const [hasRestrooms, setHasRestrooms] = useState(false);
  const [hasBreakdownAssistance, setHasBreakdownAssistance] = useState(false);
  const [hasFreeWiFi, setHasFreeWiFi] = useState(false);


  const characteristics = [
    { label: 'Techado', value: isCovered },
    { label: 'Seguridad 24h', value: has24hSecurity },
    { label: 'Cámaras de Seguridad', value: hasCCTV },
    { label: 'Servicio de Valet', value: hasValetService },
    { label: 'Estacionamiento para Discapacitados', value: hasDisabledParking },
    { label: 'Cargadores para Vehículos Eléctricos', value: hasEVChargers },
    { label: 'Pago Automático', value: hasAutoPayment },
    { label: 'Acceso con Tarjeta', value: hasCardAccess },
    { label: 'Lavado de Autos', value: hasCarWash },
    { label: 'Baños', value: hasRestrooms },
    { label: 'Asistencia en Carretera', value: hasBreakdownAssistance },
    { label: 'WiFi Gratuito', value: hasFreeWiFi }
  ];

  // Filtrar solo las características seleccionadas
  const selectedCharacteristics = characteristics.filter(char => char.value);
  const periodos = ['fraccion', 'hora', 'medio dia', 'dia completo'];
  const vehiculos = ['Auto', 'Camioneta', 'Moto', 'Bicicleta'];
  const vehiculo = vehiculos[vehiculoIndex];
  
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
  const handleScheduleChange = (newSchedule) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = { ...prevSchedule };
      
      // Itera sobre los días seleccionados y actualiza sus horarios
      newSchedule.days.forEach((day) => {
        updatedSchedule[day] = {
          openTime: newSchedule.openTime,
          closeTime: newSchedule.closeTime,
        };
      });
  
      return updatedSchedule;
    });
  };
  
  

  const onSignUpPressed = () => {
    if (step === 1) {
      if (!email || !password || !name || (!isParking && (!surname || !birthDate))) {
        Alert.alert('Error', 'Por favor, complete todos los campos requeridos.');
        return;
      }
      if (isParking) {
        setStep(step + 1);
      } else {
        Alert.alert('Success', 'Cuenta de usuario creada exitosamente.');
        navigation.navigate('Login');
      }
    } else if (step === 2) {
      if (!address) {
        Alert.alert('Error', 'Por favor, ingrese una dirección.');
        return;
      }
      setStep(step + 1);
    } else if (step === 3) {
      if(!carCapacity || !motoCapacity || !bikeCapacity){
        Alert.alert('Error', 'Por favor, ingrese las capacidades.');
        return;
      }
      setStep(step + 1);
    }else if (step === 4) {

      if (vehiculoIndex < vehiculos.length - 1) {
        setVehiculoIndex(vehiculoIndex + 1);
      } else {
        setStep(step + 1);
      }
    } else if (step === 5) {
      // Validar características seleccionadas si es necesario
      setStep(step + 1);
    } else if (step === 6) {
      // Validar horarios
      if (Object.keys(schedule).length === 0) {
        Alert.alert('Error', 'Por favor, ingrese los horarios del estacionamiento.');
        return;
      } else{
        setStep(step+1);
      }
    } else if (step === 7){
        // Aquí podrías enviar los datos al backend o mostrar mensaje de éxito
      Alert.alert('Éxito', 'Registro de estacionamiento completado.', [
        {
          text: 'Inicio',
          onPress: () => navigation.navigate('Login'),
        },
      ]);;
    }
  };

  const onBackPressed = () => {
    if (step > 1 && vehiculoIndex === 0) {
      setStep(step - 1);
    } else if (vehiculoIndex > 0) {
      setVehiculoIndex(vehiculoIndex - 1);
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
  
  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.cardTitle}>{isParking ? 'Registro de Estacionamiento' : 'Registro de Usuario'}</Text>
        <Switch
          value={isParking}
          onValueChange={value => {
            setIsParking(value);
            setStep(1);
          }}
        />
      </View>

      {step === 1 && (
        <UserForm
          isParking={isParking}
          name={name}
          surname={surname}
          birthDate={birthDate}
          setName={setName}
          setSurname={setSurname}
          setBirthDate={setBirthDate}
        />
      )}

      {step === 1 && (
        <>
          <CustomInput
            style={styles.input}
            placeholder="Email"
            value={email}
            setValue={setEmail}
            keyboardType="email-address"
          />
          <CustomInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            setValue={setPassword}
            secureTextEntry={!showPassword}
          />
          <CustomInput
            style={styles.input}
            placeholder="Repetir Contraseña"
            value={repeatPassword}
            setValue={setRepeatPassword}
            secureTextEntry={!showPassword}
            
          />
          <CustomButton style={styles.navigationButton} textStyle={styles.navigationButtonText}
            text={showPassword ? "Ocultar Contraseña" : "Mostrar Contraseña"} 
            onPress={() => setShowPassword(!showPassword)} />
          <CustomButton
            style={styles.navigationButton} textStyle={styles.navigationButtonText}
            text={isParking ? "Siguiente" : "Registrarse"}
            onPress={onSignUpPressed}
          />
        </>
      )}

      {step === 2 && (
        <>
          <AddressForm
            address={address}
            setAddress={setAddress}
          />
          <View style={styles.buttonContainer}>
            <CustomButton text="Atrás" onPress={onBackPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
            <CustomButton text="Siguiente" onPress={onSignUpPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
          </View>
        </>
      )}
      {step === 3 && (
        <>
          <CapacityForm
            carCapacity={carCapacity}
            motoCapacity={motoCapacity}
            bikeCapacity={bikeCapacity}
            setCarCapacity={setCarCapacity}
            setMotoCapacity={setMotoCapacity}
            setBikeCapacity={setBikeCapacity}
          />
          <View style={styles.buttonContainer}>
            <CustomButton text="Atrás" onPress={onBackPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
            <CustomButton text="Siguiente" onPress={onSignUpPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
          </View>
        </>
      )}
      {step === 4 && (
        <>
          <View>
              <VehiclePricesForm
                vehiculo={vehiculo}
                periodos={periodos}
                handlePriceChange={handlePriceChange}
                prices={prices[vehiculo] || {}}
              />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton text="Atrás" onPress={onBackPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
            <CustomButton text={vehiculoIndex < vehiculos.length - 1 ? "Siguiente Vehículo" : "Finalizar Paso"} onPress={onSignUpPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
          </View>
        </>
      )}
      {step === 5 && (
        <>
            <CharacteristicsForm
            isCovered={isCovered}
            setIsCovered={setIsCovered}
            has24hSecurity={has24hSecurity}
            setHas24hSecurity={setHas24hSecurity}
            hasCCTV={hasCCTV}
            setHasCCTV={setHasCCTV}
            hasValetService={hasValetService}
            setHasValetService={setHasValetService}
            hasDisabledParking={hasDisabledParking}
            setHasDisabledParking={setHasDisabledParking}
            hasEVChargers={hasEVChargers}
            setHasEVChargers={setHasEVChargers}
            hasAutoPayment={hasAutoPayment}
            setHasAutoPayment={setHasAutoPayment}
            hasCardAccess={hasCardAccess}
            setHasCardAccess={setHasCardAccess}
            hasCarWash={hasCarWash}
            setHasCarWash={setHasCarWash}
            hasRestrooms={hasRestrooms}
            setHasRestrooms={setHasRestrooms}
            hasBreakdownAssistance={hasBreakdownAssistance}
            setHasBreakdownAssistance={setHasBreakdownAssistance}
            hasFreeWiFi={hasFreeWiFi}
            setHasFreeWiFi={setHasFreeWiFi}
            />       
          <View style={styles.buttonContainer}>
            <CustomButton text="Atrás" onPress={onBackPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
            <CustomButton text="Siguiente" onPress={onSignUpPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
          </View>
        </>
      )}
      {step === 6 && (
        <>
        <ScheduleForm
        handleScheduleChange={handleScheduleChange}
        schedule={schedule}
        />
        <View style={styles.buttonContainer}>
          <CustomButton text="Atrás" onPress={onBackPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
          <CustomButton text="Siguiente" onPress={onSignUpPressed} style={styles.navigationButton} textStyle={styles.navigationButtonText}/>
        </View>
        </>
      )}{step === 7 &&(
      <>
        <Text style={styles.title}>Resumen de Registro</Text>

       <View style={styles.card}>
          <Text style={styles.cardTitle}>Información Personal</Text>
          <Text style={styles.label}>Nombre: {name} {surname}</Text>
          <Text style={styles.label}>Email: {email}</Text>
          <Text style={styles.label}>Dirección: {address}</Text>
        </View>
 
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Capacidades</Text>
          <Text style={styles.label}>Autos: {carCapacity}</Text>
          <Text style={styles.label}>Motos: {motoCapacity}</Text>
          <Text style={styles.label}>Bicicletas: {bikeCapacity}</Text>
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

  
        {selectedCharacteristics.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Características del Estacionamiento</Text>
            {selectedCharacteristics.map((char, index) => (
              <Text key={index} style={styles.label}>• {char.label}</Text>
            ))}
          </View>
        )} 
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

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Atrás"
            onPress={onBackPressed}
            style={styles.navigationButton}
            textStyle={styles.navigationButtonText}
          />
          <CustomButton
            text="Finalizar Registro"
            onPress={onSignUpPressed}
            style={styles.navigationButton}
            textStyle={styles.navigationButtonText}
          />
        </View>
        
      </>
      )}
    </View>
  );
};

export default SignUp;
