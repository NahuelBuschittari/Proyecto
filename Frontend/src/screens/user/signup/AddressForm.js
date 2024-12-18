import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getLocationSuggestions } from '../../../components/getLocationSuggestions';
import MapComponent from '../../../components/MapComponent';
import { theme } from '../../../styles/theme';
import { styles } from '../../../styles/SharedStyles';
import CustomInput from '../../../components/CustomInput';

const AddressForm = ({ address, setAddress, navigation }) => {
    const [query, setQuery] = useState(address || '');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleInputChange = async (text) => {
        setQuery(text);
        setAddress(text);

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
        setAddress(location.display_name);
    };

    return (
        <>
            <View style={styles2.searchBox}>
                <CustomInput
                    value={query}
                    setValue={handleInputChange}
                    placeholder="Buscar ubicación..."
                    style={styles2.input}
                    onSubmitEditing={() => {
                        if (selectedLocation) {
                            navigation.navigate('NextScreen', { location: selectedLocation });
                        }
                    }}
                    keyboardType="default"
                />
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
        </>
    );
};

const styles2 = StyleSheet.create({
   
    searchBox: {
        
        alignSelf: 'center',
        marginVertical: theme.spacing.sm,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        zIndex: 1,
        //elevation: 5,
        width: '80%',
    },
     input: {
         alignSelf:'center',
         height: 40,
         width:'100%',
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
});

export default AddressForm;
