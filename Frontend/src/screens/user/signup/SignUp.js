import React, { useState } from 'react'; 
import { View, TextInput, Text, Button, Switch, Alert, ScrollView } from 'react-native';
import { styles } from './SharedStyles.js';
import UserForm from './UserForm';
import AddressForm from './AddressForm';
import VehiclePricesForm from './VehiclePricesForm';
import CharacteristicsForm from './CharacteristicsForm.js';
import ScheduleForm from './ScheduleForm.js'
import CapacityForm from './CapacityForm.js'
const vehiculos = ["Auto", "Camioneta", "Moto", "Bicicleta"];
const periodos = ["Fracción", "Hora", "Medio día", "Día"];
const dias=["Lunes","Martes","Miércoles","Jueves","Sábado","Domingo","Feriado"]
const horario=["Desde", "Hasta"]

const SignUp = ({ navigation }) => {
  const [isParking, setIsParking] = useState(false);
  const [step, setStep] = useState(1);
  const [vehiculoIndex, setVehiculoIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [carCapacity, setCarCapacity] = useState('');
  const [bikeCapacity, setBikeCapacity] = useState('');
  const [motoCapacity, setMotoCapacity] = useState('');
  const [address, setAddress] = useState('');
  const [prices, setPrices] = useState({});
  const [schedule, setSchedule]=useState({});
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
        setStep(step+1)
      }
    } else if (step === 5) {
      // Validar características seleccionadas si es necesario
      setStep(step + 1);
    } else if (step === 6) {
      // Validar horarios
      if (Object.keys(schedule).length === 0) {
        Alert.alert('Error', 'Por favor, ingrese los horarios del estacionamiento.');
        return;
      }
      // Aquí podrías enviar los datos al backend o mostrar mensaje de éxito
      Alert.alert('Éxito', 'Registro de estacionamiento completado.');
      navigation.navigate('Login');
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
    setPrices(prevPrices => ({ ...prevPrices, [`${vehiculo}-${periodo}`]: value }));
  };

  const handleScheduleChange = (diaGrupo, horario, value) => {
  setSchedule(prevSchedule => ({
    ...prevSchedule,
    [diaGrupo]: {
      ...prevSchedule[diaGrupo],
      [horario]: value,
    },
  }));
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <View style={styles.switchContainer}>
        <Text>{isParking ? 'Registro de Estacionamiento' : 'Registro de Usuario'}</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title={isParking ? "Siguiente" : "Registrarse"}
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
            <Button title="Atrás" onPress={onBackPressed} />
            <Button title="Siguiente" onPress={onSignUpPressed} />
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
            <Button title="Atrás" onPress={onBackPressed} />
            <Button title="Siguiente" onPress={onSignUpPressed} />
          </View>
        </>
      )}
      {step === 4 && (
        <>
          <VehiclePricesForm
            vehiculo={vehiculos[vehiculoIndex]}
            periodos={periodos}
            handlePriceChange={handlePriceChange}
            prices={prices}
          />
          <View style={styles.buttonContainer}>
            <Button title="Atrás" onPress={onBackPressed} />
            <Button title={vehiculoIndex < vehiculos.length - 1 ? "Siguiente Vehículo" : "Finalizar Paso"} onPress={onSignUpPressed} />
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
            <Button title="Atrás" onPress={onBackPressed} />
            <Button title="Siguiente" onPress={onSignUpPressed} />
        </View>
        </>
      )}
      {step === 6 && (
        <>
        <ScheduleForm
        dias={dias}
        horario={horario}
        handleScheduleChange={handleScheduleChange}
        schedule={schedule}
        />
        <View style={styles.buttonContainer}>
            <Button title="Atrás" onPress={onBackPressed} />
            <Button title="Siguiente" onPress={onSignUpPressed} />
        </View>
        </>
      )}
    </ScrollView>
  );
};

export default SignUp;
