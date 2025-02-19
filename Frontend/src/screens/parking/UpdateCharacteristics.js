import React, { useState, useEffect } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';

const UpdateCharacteristics = ({ parkingId }) => {
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
  const { user, authTokens } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const response = await fetch(`${API_URL}/parking/${user.id}/characteristics/get`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        const data = await response.json();

        setIsCovered(data.isCovered);
        setHas24hSecurity(data.has24hSecurity);
        setHasCCTV(data.hasCCTV);
        setHasValetService(data.hasValetService);
        setHasDisabledParking(data.hasDisabledParking);
        setHasEVChargers(data.hasEVChargers);
        setHasAutoPayment(data.hasAutoPayment);
        setHasCardAccess(data.hasCardAccess);
        setHasCarWash(data.hasCarWash);
        setHasRestrooms(data.hasRestrooms);
        setHasBreakdownAssistance(data.hasBreakdownAssistance);
        setHasFreeWiFi(data.hasFreeWiFi);
      } catch (error) {
        setSuccessMessage('Error al cargar las características.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCharacteristics();
  }, [parkingId]);

  const handleUpdate = async () => {
    setIsLoading(true);
    setSuccessMessage('');

    const updatedCharacteristics = {
      isCovered,
      has24hSecurity,
      hasCCTV,
      hasValetService,
      hasDisabledParking,
      hasEVChargers,
      hasAutoPayment,
      hasCardAccess,
      hasCarWash,
      hasRestrooms,
      hasBreakdownAssistance,
      hasFreeWiFi,
    };

    try {
      const response = await fetch(`${API_URL}/parking/${user.id}/characteristics/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(updatedCharacteristics),
      });

      if (response.ok) {
        setSuccessMessage('¡Cambios guardados con éxito!');
      } else {
        setSuccessMessage('Error al guardar los cambios.');
      }
    } catch (error) {
      setSuccessMessage('No se pudo conectar con el servidor.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 5000); // Elimina el mensaje después de 3 segundos
    }
  };

  const features = [
    { label: '¿Está techado?', state: isCovered, setState: setIsCovered },
    { label: '¿Tiene seguridad 24 horas?', state: has24hSecurity, setState: setHas24hSecurity },
    { label: '¿Cuenta con cámaras de vigilancia?', state: hasCCTV, setState: setHasCCTV },
    { label: '¿Ofrece servicio de valet?', state: hasValetService, setState: setHasValetService },
    { label: '¿Estacionamiento para discapacitados?', state: hasDisabledParking, setState: setHasDisabledParking },
    { label: '¿Cargadores para vehículos eléctricos?', state: hasEVChargers, setState: setHasEVChargers },
    { label: '¿Ofrece sistema de pago automático?', state: hasAutoPayment, setState: setHasAutoPayment },
    { label: '¿Tiene acceso con tarjeta/ticket?', state: hasCardAccess, setState: setHasCardAccess },
    { label: '¿Ofrece lavado de autos?', state: hasCarWash, setState: setHasCarWash },
    { label: '¿Tiene baños disponibles?', state: hasRestrooms, setState: setHasRestrooms },
    { label: '¿Ofrece asistencia para averías?', state: hasBreakdownAssistance, setState: setHasBreakdownAssistance },
    { label: '¿Cuenta con cobertura WiFi gratuita?', state: hasFreeWiFi, setState: setHasFreeWiFi },
  ];

  const screenHeight = Dimensions.get('window').height;

  if (isLoading) {
    return (
      <View style={[styles.container,{alignItems: 'center', justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          maxHeight: screenHeight * 0.9,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.primary,
            marginBottom: theme.spacing.lg,
          },
        ]}
      >
        Actualizar Características del Estacionamiento
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingBottom: theme.spacing.lg,
        }}
      >
        {features.map((feature, index) => (
          <FeatureToggle key={index} label={feature.label} value={feature.state} onValueChange={feature.setState} />
        ))}
      </ScrollView>

      {successMessage !== '' && (
        <Text
          style={{
            textAlign: 'center',
            color: theme.colors.success,
            marginBottom: theme.spacing.md,
          }}
        >
          {successMessage}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.navigationButton,
          {
            backgroundColor: isLoading ? theme.colors.disabled : theme.colors.primary,
            marginTop: theme.spacing,
            width: '100%',
          },
        ]}
        onPress={handleUpdate}
        disabled={isLoading}
      >
        <Text
          style={[
            styles.navigationButtonText,
            {
              color: 'white',
            },
          ]}
        >
          Guardar Cambios
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const FeatureToggle = ({ label, value, onValueChange }) => {
  return (
    <View
      style={[
        styles.switchContainer,
        {
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          paddingVertical: theme.spacing.sm,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            flex: 1,
            color: theme.colors.text,
            flexWrap: 'wrap',
            marginRight: theme.spacing.sm,
          },
        ]}
      >
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: theme.colors.secondary,
          true: theme.colors.primary,
        }}
      />
    </View>
  );
};

export default UpdateCharacteristics;
