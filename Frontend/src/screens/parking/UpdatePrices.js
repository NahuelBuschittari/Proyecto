// import React, { useState } from 'react';
// import { View, Text, FlatList, TextInput, TouchableOpacity, Alert,} from 'react-native';
// import { styles } from '../../styles/SharedStyles'; 
// import { theme } from '../../styles/theme';
// import {Picker} from '@react-native-picker/picker';
// import { useAuth } from '../../context/AuthContext';
// import { API_URL } from '../../context/constants';

// const UpdatePrices = () => {
//   const vehicles = {
//     Auto: ['Fracción Auto', 'Hora Auto', 'Medio día Auto', 'Día Auto'],
//     Camioneta: ['Fracción Camioneta', 'Hora Camioneta', 'Medio día Camioneta', 'Día Camioneta'],
//     Moto: ['Fracción Moto', 'Hora Moto', 'Medio día Moto', 'Día Moto'],
//     Bicicleta: ['Fracción Bicicleta', 'Hora Bicicleta', 'Medio día Bicicleta', 'Día Bicicleta'],
//   };
//   const { user, authTokens } = useAuth();
//   const [selectedVehicle, setSelectedVehicle] = useState('Auto');
//   const [prices, setPrices] = useState({
//     'Fracción Auto': 0,
//     'Hora Auto': 0,
//     'Medio día Auto': 0,
//     'Día Auto': 0,
//   });

//   const handlePriceChange = (key, value) => {
//     // Asegurarse de que solo se ingresen números
//     const numericValue = value.replace(/[^0-9]/g, '');
//     setPrices({ ...prices, [key]: numericValue });
//   };

//   const handleSave = async () => {
//     const invalidPrices = Object.entries(prices)
//       .filter(([_, value]) => parseFloat(value) <= 0);
  
//     if (invalidPrices.length > 0) {
//       Alert.alert(
//         'Error de Validación', 
//         'Todos los precios deben ser mayores a 0.',
//         [{ text: 'OK' }]
//       );
//       return;
//     }
  
//     try {
//       const response = await fetch(`${API_URL}/parking/${user.id}/prices`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authTokens.token}`,
//         },
//         body: JSON.stringify({
//           vehicleType: selectedVehicle,
//           prices,
//         }),
//       });
  
//       if (response.ok) {
//         Alert.alert(
//           'Precios Actualizados', 
//           `Precios para ${selectedVehicle} actualizados exitosamente.`, 
//           [{ text: 'OK' }]
//         );
//       } else {
//         Alert.alert(
//           'Error', 
//           'No se pudieron actualizar los precios. Intenta nuevamente.', 
//           [{ text: 'OK' }]
//         );
//       }
//     } catch (error) {
//       console.error('Error al actualizar precios:', error);
//       Alert.alert(
//         'Error', 
//         'Ocurrió un error inesperado. Intenta nuevamente.', 
//         [{ text: 'OK' }]
//       );
//     }
//   };
  

//   return (
//     <>
//       <View style={[styles.card, { width: '90%', alignSelf: 'center' }]}>
//         <Text style={[styles.title, { textAlign: 'center', marginBottom: theme.spacing.md }]}>
//           Actualizar Precios
//         </Text>

//         <Text style={[styles.label, { textAlign: 'center' }]}>
//           Selecciona el tipo de vehículo:
//         </Text>
//         <View style={{
//           borderWidth: 1,
//           borderColor: theme.colors.border,
//           borderRadius: theme.borderRadius.sm,
//           marginBottom: theme.spacing.md,
//           alignSelf: 'center',
//           width: '100%'
//         }}>
//           <Picker
//             selectedValue={selectedVehicle}
//             onValueChange={(itemValue) => {
//               setSelectedVehicle(itemValue);
//               setPrices(
//                 vehicles[itemValue].reduce((acc, item) => {
//                   acc[item] = prices[item] || 0; 
//                   return acc;
//                 }, {})
//               );
//             }}
//             style={{ 
//               height: 50, 
//               color: theme.colors.text 
//             }}
//           >
//             {Object.keys(vehicles).map((vehicle) => (
//               <Picker.Item 
//                 key={vehicle} 
//                 label={vehicle} 
//                 value={vehicle} 
//                 color={theme.colors.text}
//               />
//             ))}
//           </Picker>
//         </View>

//         <FlatList
//           data={vehicles[selectedVehicle]}
//           keyExtractor={(item) => item}
//           renderItem={({ item }) => (
//             <View style={[styles.horizontalContainer, { 
//               marginBottom: theme.spacing.sm, 
//               justifyContent: 'space-between' 
//             }]}>
//               <Text style={[styles.label, { flex: 1 }]}>{item}</Text>
//               <TextInput
//                 style={{
//                   borderColor: theme.colors.border,
//                   borderWidth: 1,
//                   borderRadius: theme.borderRadius.sm,
//                   padding: theme.spacing.sm,
//                   width: 100,
//                   textAlign: 'center',
//                   color: theme.colors.text,
//                 }}
//                 keyboardType="numeric"
//                 value={prices[item]?.toString()}
//                 onChangeText={(value) => handlePriceChange(item, value)}
//                 placeholder="Precio"
//               />
//             </View>
//           )}
//         />

//         <TouchableOpacity 
//           style={[
//             styles.navigationButton, 
//             { 
//               backgroundColor: theme.colors.primary, 
//               marginTop: theme.spacing.lg,
//               alignSelf: 'center',
//               width: '100%'
//             }
//           ]}
//           onPress={handleSave}
//         >
//           <Text style={styles.navigationButtonText}>Guardar</Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };

// export default UpdatePrices;

import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
const UpdatePrices = () => {
<Text> UpdatePrices </Text>
};
export default UpdatePrices;