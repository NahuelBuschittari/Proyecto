// import React, { useState } from 'react';
// import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { getLocationSuggestions } from '../../../components/getLocationSuggestions';
// import MapComponent from '../../../components/MapComponent';
// import CustomInput from '../../../components/CustomInput';
// import { styles } from '../../../styles/SharedStyles';
// import { theme } from '../../../styles/theme';

// const AddressForm = ({ address, setAddress }) => {
//     const [suggestions, setSuggestions] = useState([]);
//     const [selectedLocation, setSelectedLocation] = useState(null);

//     const handleInputChange = async (text) => {
//         setAddress(text);

//         if (text.length > 8) {
//             const results = await getLocationSuggestions(text);
//             setSuggestions(results);
//         } else {
//             setSuggestions([]);
//         }
//     };

//     const handleSuggestionClick = (location) => {
//         setSelectedLocation(location);
//         setSuggestions([]);
//         setAddress(location.display_name);
//     };

//     return (
//         <>
//             <View style={styles2.searchBox}>
//                 <CustomInput
//                     value={address}
//                     setValue={handleInputChange}
//                     placeholder="Buscar ubicación..."
//                     style={styles.input}
//                 />
//                 <FlatList
//                     data={suggestions}
//                     keyExtractor={(item, index) => index.toString()}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity onPress={() => handleSuggestionClick(item)}>
//                             <Text style={styles2.suggestion}>{item.display_name}</Text>
//                         </TouchableOpacity>
//                     )}
//                 />
//             </View>
//             <View style={styles2.mapContainer}>
//                 <MapComponent location={selectedLocation}/>
//             </View>
//         </>
//     );
// };

// const styles2=StyleSheet.create({
// container: {
//     flex: 1,
// },
// FlatList: {
//     maxHeight: 150, // Limita la altura para que no ocupe toda la pantalla
//     overflow: 'scroll', // Permite desplazar las sugerencias
//     backgroundColor: theme.colors.background,
//     borderRadius: theme.borderRadius.sm,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
// },

// searchBox: {
//     alignSelf: 'center',
//     padding: theme.spacing.md,
//     borderRadius: theme.borderRadius.md,
//     backgroundColor: theme.colors.background,
//     zIndex: 1,
//     width: '80%',
//     alignItems:'center'
// },
// input: {
//     height: 80,
//     borderRadius: theme.borderRadius.md,
//     paddingHorizontal: theme.spacing.sm,
//     backgroundColor: theme.colors.inputBackground,
//     color: theme.colors.text,
// },
// suggestion: {
//     padding: theme.spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//     color: theme.colors.text,
// },
// mapContainer: {
//     width: '100%',
//     height: '80%',
//     overflow: 'hidden', // Asegura que el mapa no sobresalga
//   },
// map: {
//     flex: 1,
//   },
  

// });
// export default AddressForm;

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
                            <Text style={styles2.suggestion}>{item.display_name}</Text>
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
