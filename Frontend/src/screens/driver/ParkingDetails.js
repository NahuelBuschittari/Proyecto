import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { getNearbyParkings } from '../../components/getNearbyParkings';

const ParkingDetails = ({ route }) => {
    const { location } = route.params;
    const [maxDistance, setMaxDistance] = useState(1); // Por defecto 1 cuadra
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearchParkings = async () => {
        setLoading(true);
        const results = await getNearbyParkings(location, maxDistance);
        setParkings(results);
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ubicación Seleccionada:</Text>
            <Text>{location.display_name}</Text>
            <View style={styles.distanceControls}>
                <Button title="-" onPress={() => setMaxDistance(Math.max(0, maxDistance - 1))} />
                <Text style={styles.distanceText}>{Math.round(maxDistance)} cuadras</Text>
                <Button title="+" onPress={() => setMaxDistance(maxDistance + 1)} />
            </View>
            <Button title="Buscar Estacionamientos" onPress={handleSearchParkings} disabled={loading} />
            {loading ? <Text>Cargando...</Text> : null}
            <FlatList
                data={parkings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.parkingItem}>
                        <Text style={styles.parkingName}>{item.name}</Text>
                        <Text>{item.address}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text>No se encontraron estacionamientos.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    slider: {
        width: '100%',
        height: 40,
        marginVertical: 20,
    },
    parkingItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    parkingName: {
        fontWeight: 'bold',
    },
});

export default ParkingDetails;

