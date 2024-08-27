import React, { useState } from 'react';
import { TextInput, View, FlatList, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { getLocationSuggestions } from '../components/getLocationSuggestions';
import MapComponent from '../components/MapComponent';

const SearchParking = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleInputChange = async (text) => {
        setQuery(text);

        if (text.length > 2) {
            const results = await getLocationSuggestions(text);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (location) => {
        setSelectedLocation(location);
        setSuggestions([]);
        setQuery(location.display_name);
    };

    const handleNext = () => {
        if (selectedLocation) {
            navigation.navigate('ParkingDetails', { location: selectedLocation });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <TextInput 
                    value={query} 
                    onChangeText={handleInputChange} 
                    placeholder="Buscar ubicación..." 
                    style={styles.input}
                />
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionClick(item)}>
                            <Text style={styles.suggestion}>{item.display_name}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Button title="Siguiente" onPress={handleNext} disabled={!selectedLocation} />
            </View>
            <MapComponent location={selectedLocation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 1,  // Asegura que el buscador esté por encima del mapa
        backgroundColor: 'white',  // Fondo blanco para que las sugerencias sean visibles
        borderRadius: 5,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Sombra en Android
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
    },
    suggestion: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default SearchParking;
