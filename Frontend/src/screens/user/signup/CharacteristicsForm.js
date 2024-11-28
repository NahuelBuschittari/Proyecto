import React from 'react';
import { View, Text, Switch } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js'; // Asegúrate de que la ruta sea correcta

const CharacteristicsForm = ({
  isCovered, setIsCovered,
  has24hSecurity, setHas24hSecurity,
  hasCCTV, setHasCCTV,
  hasValetService, setHasValetService,
  hasDisabledParking, setHasDisabledParking,
  hasEVChargers, setHasEVChargers,
  hasAutoPayment, setHasAutoPayment,
  hasCardAccess, setHasCardAccess,
  hasCarWash, setHasCarWash,
  hasRestrooms, setHasRestrooms,
  hasBreakdownAssistance, setHasBreakdownAssistance,
  hasFreeWiFi, setHasFreeWiFi
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Características del Estacionamiento</Text>
      <FeatureToggle
        label="¿Está techado?"
        value={isCovered}
        onValueChange={setIsCovered}
      />
      <FeatureToggle
        label="¿Tiene seguridad 24 horas?"
        value={has24hSecurity}
        onValueChange={setHas24hSecurity}
      />
      <FeatureToggle
        label="¿Cuenta con cámaras de vigilancia?"
        value={hasCCTV}
        onValueChange={setHasCCTV}
      />
      <FeatureToggle
        label="¿Ofrece servicio de valet?"
        value={hasValetService}
        onValueChange={setHasValetService}
      />
      <FeatureToggle
        label="¿Estacionamiento para discapacitados?"
        value={hasDisabledParking}
        onValueChange={setHasDisabledParking}
      />
      <FeatureToggle
        label="¿Cargadores para vehículos eléctricos?"
        value={hasEVChargers}
        onValueChange={setHasEVChargers}
      />
      <FeatureToggle
        label="¿Ofrece sistema de pago automático?"
        value={hasAutoPayment}
        onValueChange={setHasAutoPayment}
      />
      <FeatureToggle
        label="¿Tiene acceso con tarjeta/ticket?"
        value={hasCardAccess}
        onValueChange={setHasCardAccess}
      />
      <FeatureToggle
        label="¿Ofrece lavado de autos?"
        value={hasCarWash}
        onValueChange={setHasCarWash}
      />
      <FeatureToggle
        label="¿Tiene baños disponibles?"
        value={hasRestrooms}
        onValueChange={setHasRestrooms}
      />
      <FeatureToggle
        label="¿Ofrece asistencia para averías?"
        value={hasBreakdownAssistance}
        onValueChange={setHasBreakdownAssistance}
      />
      <FeatureToggle
        label="¿Cuenta con cobertura WiFi gratuita?"
        value={hasFreeWiFi}
        onValueChange={setHasFreeWiFi}
      />
    </View>
  );
};

const FeatureToggle = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

export default CharacteristicsForm;
