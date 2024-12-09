import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MapView, { Callout, Marker,} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_KEY} from '@env';
import { Linking } from 'react-native';
import CustomButton from '../../components/CustomButton';
import getLocation from '../../components/getLocation'; //La gracia es usar este para todos
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { dummyParkingData } from './DUMMY_PARKINGS';
import getAvailableParkings from '../../components/getAvailableParkings';
const Navigation = () => {
    useEffect(() => {
        const fetchLocation = async () => {
          const location = await getLocation();
          if (location) {
            setOrigin({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        };
        fetchLocation();
      }, []);

    const[origin,setOrigin]=useState({
        latitude:-32.925191,
        longitude:-60.661168,
        
    });
    const [selectedVehicle, handleVehicleSelect] = useState('car-side');
    const [vehicle, setVehicle] = useState('driving');
    
    // Estado para almacenar los estacionamientos disponibles
    const [parkingsDisponibles, setParkingsDisponibles] = useState([]);

    // Efecto para obtener la ubicación inicial
    useEffect(() => {
        const fetchLocation = async () => {
            const location = await getLocation();
            if (location) {
                setOrigin({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        };
        fetchLocation();
    }, []); //ver forma de ir actualizando ubicacion

    // Efecto para actualizar los estacionamientos cuando cambia el tipo de vehículo
    useEffect(() => {
        const fetchAvailableParkings = async () => {
            try {
                const availableParkings = await getAvailableParkings(dummyParkingData, selectedVehicle);
                setParkingsDisponibles(availableParkings);
            } catch (error) {
                console.error('Error al obtener estacionamientos:', error);
            }
        };

        fetchAvailableParkings();
    }, [selectedVehicle]); // Se ejecuta cada vez que cambia el tipo de vehículo


    function openGoogleMaps() {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=${vehicle}`;
        Linking.openURL(url);
      };
    

    return(
        <View style={styles2.container}>
            <CustomButton
            text='Abrir desde Google Maps'
            onPress={openGoogleMaps}/>
            <MapView
            style={styles2.map}
            initialRegion={{
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,

            }}>
            <Marker coordinate={origin}><MaterialIcons name="radio-button-checked" size={30} color={theme.colors.primary} /></Marker>
            
            {parkingsDisponibles.map((parking) => (
                    <Marker
                    style={{backgroundColor:theme.colors.primary}}
                        key={parking.userData.id}
                        coordinate={{
                            latitude: parking.userData.address.latitude,
                            longitude: parking.userData.address.longitude,
                        }}
                    >
                        <MaterialIcons name="local-parking" size={24} color="white" />
                        <Callout >
                            <View style={styles2.callout}>
                                <Text style={styles2.calloutTitle}>{parking.userData.name}</Text>
                                <Text style={styles2.calloutText}>Capacidad de autos: {parking.capacities.carCapacity}</Text>
                                <Text style={styles2.calloutText}>Dirección: {parking.userData.address.street} {parking.userData.address.number}</Text>
                                <CustomButton
                                style={styles.navigationButton}
                                textStyle={styles2.calloutText}
                                    text="Ir"
                                />
                            </View>
                        </Callout>                        
                    </Marker>
                ))}
            </MapView>
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
    height: '80%',
  },
  vehicleIcon: {
    padding: 10,
    borderRadius: 10,
    verticalAlign:'center',
  },callout: {
    height:120,
    width:130,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding:10,
},
calloutTitle: {
    fontSize:theme.typography.fontSize.xsmall,
    fontWeight: 'bold',
    marginBottom: 5,
},
calloutText: {
    fontSize:theme.typography.fontSize.xsmall,
    marginBottom: 5,
},
});
export default Navigation;

