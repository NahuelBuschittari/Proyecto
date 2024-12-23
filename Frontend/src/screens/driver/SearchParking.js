import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getLocationSuggestions } from '../../components/getLocationSuggestions';
import MapComponent from '../../components/MapComponent';
import { theme } from '../../styles/theme';
import { styles } from '../../styles/SharedStyles';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const SearchParking = ({ route,navigation }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const {vehicle}=route.params;
    const handleInputChange = async (text) => {
        setQuery(text);

        if (text.length > 8) {
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
            navigation.navigate('ParkingFinder', { location: selectedLocation, vehicle:vehicle });
        }
    };

    return (
        <View style={styles2.container}>
            <View style={styles2.searchBox}>
                <View style={[{flexDirection:'row'}]}>
                    <CustomInput
                        value={query}
                        setValue={handleInputChange}
                        placeholder="Buscar ubicación..."
                        style={styles2.input}
                    />
                    <CustomButton
                        style={styles2.addButton}
                        textStyle={styles.navigationButtonText}
                        onPress={handleNext}
                        text="Ir"
                    />
                </View>
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSuggestionClick(item)}>
                            <Text style={styles2.suggestion}>
                            {item.address.name !== item.address.road ? `${item.address.name}, ` : ''}
                            {item.address.road} {item.address.house_number}, {item.address.city}, {item.address.state}, {item.address.country}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <MapComponent location={selectedLocation} />
        </View>
    );
};

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        alignSelf: 'center',
        marginVertical: theme.spacing.sm,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        zIndex: 1,
        elevation: 5,
        width: '70%',
    },
    input: {
        height: 40,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
    },
    suggestion: {
        padding: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        color: theme.colors.text,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        width:'20%'
    },
});

export default SearchParking;
