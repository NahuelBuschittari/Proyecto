import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker,Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import {GOOGLE_MAPS_KEY} from '@env';
import { Linking } from 'react-native';
import CustomButton from '../../components/CustomButton';
import getLocation from '../../components/getLocation'; //La gracia es usar este para todos

const MapScreen = () => {
    useEffect(()=>{
        getLocationPermission();
    },[])
    const[origin,setOrigin]=useState({
        latitude:-32.925191,
        longitude:-60.661168,
        
    });
    async function getLocationPermission() {
        const {status}=await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            alert('Permiso de ubicacion denegado');
            return;
        }
        const location = await Location.getCurrentPositionAsync();
        const currentLocation={
            latitude:location.coords.latitude,
            longitude:location.coords.longitude
        }
    setOrigin(currentLocation)
    }
    const [vehicle,setVehicle]=useState('driving'); // o bicycling
    const[destination,setDestination]=useState({
        latitude:-32.947383,
        longitude:-60.630565,
    });
    function openGoogleMaps() {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=${vehicle}`;
        Linking.openURL(url);
      };

    return(
        <View style={styles.container}>
            <MapView
            style={styles.map}
            initialRegion={{
                latitude: origin.latitude,
                longitude: origin.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,

            }}>
                <Marker coordinate={origin}/>

                <Marker coordinate={destination}/>
             {/* <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_KEY}/>     */}
                <Polyline 
                coordinates={[origin,destination]}
                />
            </MapView>
            <CustomButton
            text='Abrir desde Google Maps'
            onPress={openGoogleMaps}/>
        </View>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%',
  },
});
export default MapScreen;
