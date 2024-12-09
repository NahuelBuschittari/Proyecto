import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Modal, ActivityIndicator} from 'react-native';
import MapView,{ Callout, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_KEY} from '@env';
import { Linking } from 'react-native';
import CustomButton from '../../components/CustomButton';
import getLocation from '../../components/getLocation';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { dummyParkingData } from './DUMMY_PARKINGS';
import getAvailableParkings from '../../components/getAvailableParkings';
import * as Location from 'expo-location';

const Navigation = () => {
    const [origin, setOrigin] = useState(null);
    const [selectedVehicle, handleVehicleSelect] = useState('car-side');
    const [vehicle, setVehicle] = useState('driving');
    const [parkingsDisponibles, setParkingsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true); // Nuevo estado de carga
    const [selectedParking, setSelectedParking] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: -32.9479,
        longitude: -60.6304,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    useEffect(() => {
        let subscription;

        const fetchLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permiso para acceder a la ubicacion denegado');
                setLoading(false);
                return;
            }

            // Monitorea la ubicación en tiempo real
            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10, // O cada 10 metros
                },
                (location) => {
                    setOrigin({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                }
            );
        };

        fetchLocation();

        // Limpia el monitoreo cuando el componente se desmonta
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    // Efecto para actualizar los estacionamientos cuando cambia el tipo de vehículo
    useEffect(() => {
        const fetchAvailableParkings = async () => {
            try {
                const availableParkings = await getAvailableParkings(dummyParkingData, selectedVehicle);
                setParkingsDisponibles(availableParkings);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener estacionamientos:', error);
                setLoading(false);
            }
        };

        fetchAvailableParkings();
    }, [selectedVehicle]); // Se ejecuta cada vez que cambia el tipo de vehículo


    function openGoogleMaps(origin,latitude,longitude,vehicle) {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${latitude},${longitude}&travelmode=${vehicle}`;
        Linking.openURL(url);
      };
    
    if (loading || !origin) {
        return (
            <View style={styles2.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text>Cargando mapa...</Text>
            </View>
        );
    }
    return(
        <View style={styles2.container}>
            <MapView
            style={styles2.map}
            initialRegion={mapRegion}
            onRegionChangeComplete={(region)=>setMapRegion(region)}>
                {/* Marcador para la ubicación actual */}
                <Marker coordinate={origin}>
                    <Image source={require("../../../assets/radio-button-checked.png")} style={{ width: 25, height: 25 }}/>
                </Marker>
                
                {/* Marcadores de estacionamientos disponibles */}
                {parkingsDisponibles.map((parking) => (
                    <Marker
                        style={{backgroundColor:theme.colors.primary}}
                        key={parking.userData.id}
                        coordinate={{
                            latitude: parking.userData.address.latitude,
                            longitude: parking.userData.address.longitude,
                        }}
                        onPress={()=>setSelectedParking(parking)}
                    >
                        <Image
                            source={require("../../../assets/Parking_icon.png")}
                            style={{ width: 25, height: 25 }}
                        />                    
                    </Marker>
                ))}
            </MapView>
             <Modal
                animationType="slide"
                transparent={true}
                visible={!!selectedParking}
                onRequestClose={() => setSelectedParking(null)}
            >
                <View style={styles2.modalBackground}>
                    <View style={styles2.modalContainer}>
                        <Text style={styles2.modalTitle}>{selectedParking?.userData.name}</Text>
                        <Text style={styles2.modalAddress}>
                            {selectedParking?.userData.address.street} {selectedParking?.userData.address.number}
                        </Text>
                        <Text>
                            Quedan{' '}
                            {selectedParking?.capacities
                                ? selectedVehicle === 'car-side' || selectedVehicle === 'truck-pickup'
                                    ? selectedParking.capacities.carCapacity
                                    : selectedVehicle === 'motorcycle'
                                    ? selectedParking.capacities.motoCapacity 
                                    : selectedParking.capacities.bikeCapacity 
                                : '0'}{' '}
                            lugares disponibles
                        </Text>


                        <View style={styles2.modalButtonContainer}>
                            <CustomButton 
                                style={styles.navigationButton} 
                                textStyle={styles.navigationButtonText}
                                onPress={() => setSelectedParking(null)}
                                text='Cerrar'/>
                            <CustomButton 
                                style={styles.navigationButton} 
                                textStyle={styles.navigationButtonText}
                                text='Ir con Maps'
                                onPress={() => {
                                    openGoogleMaps(
                                        origin,
                                        selectedParking.userData.address.latitude,
                                        selectedParking.userData.address.longitude,
                                        vehicle
                                    );
                                    setSelectedParking(null);
                                }}
                            />    
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Selector de tipo de vehículo */}
            <View style={[styles.footer, { width: '100%' }]}>
                {['car-side', 'truck-pickup', 'motorcycle', 'bicycle'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[styles2.vehicleIcon, selectedVehicle === type && styles2.selectedIcon]}
                        onPress={() => {
                            handleVehicleSelect(type);
                            setVehicle(type === 'bicycle' ? 'bicycling' : 'driving');
                        }}
                    >
                        <FontAwesome5
                            name={type}
                            size={24}
                            color={selectedVehicle === type ? theme.colors.primary : theme.colors.secondary}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:theme.colors.background
  },
  map: {
    width: '100%',
    height: '90%',
  },
  vehicleIcon: {
    padding: 10,
    borderRadius: 10,
    verticalAlign:'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  modalAddress: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSpaces: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  modalButtonNavigate: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonNavigateText: {
    color: 'white',
    fontWeight: 'bold',
  },

loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
},
modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
});
export default Navigation;

