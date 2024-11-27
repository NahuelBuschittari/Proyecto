import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './SharedStyles.js';
const VehiclePricesForm = ({ vehiculo, periodos, handlePriceChange, prices }) => (
  
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{vehiculo}</Text>
    <View style={styles.grid}>
      {periodos.map((periodo) => (
        <View key={periodo} style={styles.priceInputContainer}>
          <Text style={styles.label}>{periodo}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="0.00"
            onChangeText={(value) => handlePriceChange(vehiculo, periodo, value)}
          />
        </View>
      ))}
    </View>
  </View>
);

export default VehiclePricesForm;
