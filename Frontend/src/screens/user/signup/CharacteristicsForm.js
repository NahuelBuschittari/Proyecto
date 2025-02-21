import React from 'react';
import { View, Text, Switch } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js'; // Asegúrate de que la ruta sea correcta

const CharacteristicsForm = ({ features, updateFeature }) => {
  const characteristics = [
    { label: 'Techado', key: 'isCovered' },
    { label: 'Seguridad 24h', key: 'has24hSecurity' },
    { label: 'Cámaras de Seguridad', key: 'hasCCTV' },
    { label: 'Servicio de Valet', key: 'hasValetService' },
    { label: 'Estacionamiento para Discapacitados', key: 'hasDisabledParking' },
    { label: 'Cargadores para Vehículos Eléctricos', key: 'hasEVChargers' },
    { label: 'Pago Automático', key: 'hasAutoPayment' },
    { label: 'Acceso con Tarjeta', key: 'hasCardAccess' },
    { label: 'Lavado de Autos', key: 'hasCarWash' },
    { label: 'Baños', key: 'hasRestrooms' },
    { label: 'Asistencia para averías', key: 'hasBreakdownAssistance' },
    { label: 'WiFi Gratuito', key: 'hasFreeWiFi' },
  ];

  return (
    <>
      {characteristics.map(({ label, key }) => (
        <View key={key} style={styles.switchContainer}>
          <Text style={styles.label}>{label}</Text>
          <Switch
            value={features[key]}
            onValueChange={(value) => updateFeature(key, value)}
          />
        </View>
      ))}
    </>
  );
};

export default CharacteristicsForm;
