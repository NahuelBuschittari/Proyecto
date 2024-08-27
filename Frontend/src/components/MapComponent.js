import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

const MapComponent = ({ location }) => {
    const region = {
        latitude: location ? parseFloat(location.lat) : -32.9479,
        longitude: location ? parseFloat(location.lon) : -60.6304,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <View style={styles.container}>
            <MapView 
                style={styles.map} 
                initialRegion={region}
                region={region}
            >
                {location && (
                    <Marker 
                        coordinate={{ latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) }} 
                        title={location.display_name}
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapComponent;
