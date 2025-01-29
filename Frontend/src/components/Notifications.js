// services/notificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Linking } from 'react-native';

export const setupNotifications = async () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

const requestNotificationPermissions = async () => {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      // Mostrar un diálogo explicativo antes de solicitar permisos
      const userResponse = await new Promise((resolve) => {
        Alert.alert(
          "Permitir notificaciones",
          "Necesitamos tu permiso para avisarte si el estacionamiento se queda sin lugares mientras te diriges hacia él.",
          [
            {
              text: "No permitir",
              onPress: () => resolve(false),
              style: "cancel"
            },
            {
              text: "Permitir",
              onPress: () => resolve(true)
            }
          ]
        );
      });

      if (!userResponse) {
        return false;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert(
        "Notificaciones desactivadas",
        "No podremos avisarte si el estacionamiento se queda sin lugares. ¿Deseas habilitarlas en la configuración?",
        [
          {
            text: "No por ahora",
            style: "cancel"
          },
          {
            text: "Ir a Configuración",
            onPress: () => Linking.openSettings()
          }
        ]
      );
      return false;
    }
    return true;
  }
  
  Alert.alert("Aviso", "Las notificaciones solo funcionan en dispositivos físicos");
  return false;
};

export const checkParkingAvailability = async (parkingId,capacities, vehicleType) => {
  try {
    // Primero verificar los permisos
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      // Si el usuario no dio permisos, igual permitimos continuar
      // pero no podremos enviar notificaciones
      return true;
    }

    // const response = await fetch(`https://mi-api.com/parking/${parkingId}/availability`);
    // const data = await response.json();
    let availableSpaces;
    switch (vehicleType) {
      case 'car-side': case 'Auto':
      case 'truck-pickup': case 'Camioneta':
        availableSpaces = capacities.carCapacity;
        break;
      case 'motorcycle' || 'Moto':
        availableSpaces = capacities.motoCapacity;
        break;
      case 'bicycle' || 'Bicicleta':
        availableSpaces = capacities.bikeCapacity;
        break;
      default:
        availableSpaces = 0;
    }

    if (availableSpaces <= 5) {
      // Generar un número aleatorio entre 1 y 6
      const randomNumber = 2;
      // Verificar si el número aleatorio es divisible por 3
      if (randomNumber % 3 === 0) {
        // Solo intentar enviar la notificación si tenemos permisos
        if (hasPermission) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: '¡Atención!',
              body: 'El estacionamiento se ha quedado sin lugares disponibles para tu vehículo.',
              sound: 'default',
            },
            trigger: new Date().getTime() + 10000, // 10 segundos
          });
        }
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error checking parking availability:', error);
    return false;
  }
};