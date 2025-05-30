import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, Modal, ActivityIndicator } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { FontAwesome5} from '@expo/vector-icons';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import * as Location from 'expo-location';
import getDay from '../../components/getDay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../context/constants';
import { setupNotifications,checkParkingAvailability } from '../../components/Notifications';
import { user,useAuth } from '../../context/AuthContext';
import axios from 'axios';
import createReview from '../../components/createReview'; 
const Navigation = ({ navigation, route }) => {
    const [currentDay, setCurrentDay] = useState(null);
    const [origin, setOrigin] = useState(null);
    const [selectedVehicle, handleVehicleSelect] = useState('car-side');
    const [vehicle, setVehicle] = useState('driving');
    const [parkingsDisponibles, setParkingsDisponibles] = useState([]);
    const [loading, setLoading] = useState(true); 
    const { user, authTokens } = useAuth();
    const [selectedParking, setSelectedParking] = useState(null);
    const [mapRegion, setMapRegion] = useState({
        latitude: -32.9479,
        longitude: -60.6304,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    console.log("token:",authTokens.access);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity 
                    style={[styles2.vehicleButton, { marginLeft: 10 }]}  
                    onPress={() => navigation.navigate('UserMenu')}
                >
                    <Text style={styles2.buttonText}>Atrás</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

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
        setupNotifications();
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
                console.log("token:", authTokens.access);
                
                const day = await getDay(); // Usa tu función existente
                console.log(day);
                console.log(selectedVehicle);
                setCurrentDay(day);
                const response = await axios.get(`${API_URL}/driver/navigation`, {
                    params: {
                        vehicle_type: selectedVehicle,
                        day: day, // Envía el día (L, Ma, Mi, etc.)
                    },
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    },
                });
    
                setParkingsDisponibles(response.data);
                console.log("parkings:",response.data);
                setLoading(false);
            } catch (error) {
                console.log('Error al obtener estacionamientos:', error.response || error.message);
                setLoading(false);
            }
        };
    
        fetchAvailableParkings();
    }, [selectedVehicle]);
    useEffect(() => {
        if (route.params?.selectedParking) {
            setSelectedParking(route.params.selectedParking);
            handleVehicleSelect(route.params.selectedVehicle);
        }
    }, [route.params?.selectedParking, route.params?.selectedVehicle]);



    async function openGoogleMaps(origin, latitude, longitude, vehicle) {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${latitude},${longitude}&travelmode=${vehicle}`;
        const space=await checkParkingAvailability(selectedParking, selectedVehicle);
        console.log("space",space)
        if(space){
            createReview(selectedParking.id, user.id, authTokens.access);
        }
        Linking.openURL(url);
    };

    //Mapeo de dia de la semana
    day_map = {
        'L': 'lunes',
        'Ma': 'martes',
        'Mi': 'miercoles',
        'J': 'jueves',
        'V': 'viernes',
        'S': 'sabado',
        'D': 'domingo',
        'F': 'feriados'
    }
    const scheduleDay = day_map[currentDay];
    console.log("currentDay",currentDay);
    console.log("scheduleDay",scheduleDay);
    if (loading || !origin) {
        return (
            <View style={styles2.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text>Cargando mapa...</Text>
            </View>
        );
    }
    return (
        <View style={styles2.container}>
            <MapView
                style={styles2.map}
                initialRegion={mapRegion}
                onRegionChangeComplete={(region) => setMapRegion(region)}>
                {/* Marcador para la ubicación actual */}
                <Marker coordinate={origin}>
                    <Image source={require("../../../assets/radio-button-checked.png")} style={{ width: 25, height: 25 }} />
                </Marker>

                {/* Marcadores de estacionamientos disponibles */}
                {parkingsDisponibles.map((parking) => (
                    <Marker
                        style={{ backgroundColor: theme.colors.primary }}
                        key={parking.id}
                        coordinate={{
                            latitude: parseFloat(parking.latitude),
                            longitude: parseFloat(parking.longitude),
                        }}
                        onPress={() => setSelectedParking(parking)}
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
                        <TouchableOpacity
                            onPress={() => setSelectedParking(null)}
                            style={styles2.closeButton}
                        >
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>

                        <Text style={styles2.modalTitle}>{selectedParking?.nombre}</Text>
                        <Text style={styles.label}>
                            Quedan{' '}
                            {selectedVehicle === 'car-side' || selectedVehicle === 'truck-pickup'
                                ? selectedParking?.carCapacity
                                : selectedVehicle === 'motorcycle'
                                ? selectedParking?.motoCapacity
                                : selectedParking?.bikeCapacity}{' '}
                            lugares disponibles
                        </Text>
                        <Text style={styles.label}>
                            Cierra a las {' '}
                            {selectedParking?.schedule[`${scheduleDay}_close`] || 'Horario no disponible'}
                        </Text>
                        {selectedParking?.prices && (
                            <View style={styles.card}>
                                <Text style={styles.label}>Tarifa de precios</Text>
                                {selectedVehicle === 'car-side' ? (
                                    <>
                                        <Text>Fracción: ${selectedParking.prices.auto_fraccion}</Text>
                                        <Text>Hora: ${selectedParking.prices.auto_hora}</Text>
                                        <Text>Medio día: ${selectedParking.prices.auto_medio_dia}</Text>
                                        <Text>Día completo: ${selectedParking.prices.auto_dia_completo}</Text>
                                    </>
                                ) : selectedVehicle === 'truck-pickup' ? (
                                    <>
                                        <Text>Fracción: ${selectedParking.prices.camioneta_fraccion}</Text>
                                        <Text>Hora: ${selectedParking.prices.camioneta_hora}</Text>
                                        <Text>Medio día: ${selectedParking.prices.camioneta_medio_dia}</Text>
                                        <Text>Día completo: ${selectedParking.prices.camioneta_dia_completo}</Text>
                                    </>
                                ) : selectedVehicle === 'motorcycle' ? (
                                    <>
                                        <Text>Fracción: ${selectedParking.prices.moto_fraccion}</Text>
                                        <Text>Hora: ${selectedParking.prices.moto_hora}</Text>
                                        <Text>Medio día: ${selectedParking.prices.moto_medio_dia}</Text>
                                        <Text>Día completo: ${selectedParking.prices.moto_dia_completo}</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text>Fracción: ${selectedParking.prices.bici_fraccion}</Text>
                                        <Text>Hora: ${selectedParking.prices.bici_hora}</Text>
                                        <Text>Medio día: ${selectedParking.prices.bici_medio_dia}</Text>
                                        <Text>Día completo: ${selectedParking.prices.bici_dia_completo}</Text>
                                    </>
                                )}
                            </View>
                        )}

                        <View style={styles2.modalButtonContainer}>
                            <CustomButton
                                style={styles.navigationButton}
                                textStyle={styles.navigationButtonText}
                                text='Ir con Maps'
                                onPress={() => {
                                    openGoogleMaps(
                                        origin,
                                        selectedParking.latitude,
                                        selectedParking.longitude,
                                        vehicle
                                    );
                                    setSelectedParking(null);
                                }}
                            />
                            <CustomButton
                                style={[styles.navigationButton, { width: 150 }]}
                                textStyle={styles.navigationButtonText}
                                text='Ver características'
                                onPress={() => {
                                    navigation.navigate('SpecificParkingDetails', {
                                        parkingData: selectedParking,
                                        selectedVehicle: selectedVehicle,
                                    });
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
        backgroundColor: theme.colors.background
    },
    map: {
        width: '100%',
        height: '90%',
    },
    vehicleIcon: {
        padding: 10,
        borderRadius: 10,
        verticalAlign: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 10,
        marginRight: 10,
        textAlign: 'center',
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
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        padding: 5,
    },

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: theme.spacing.lg,
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
