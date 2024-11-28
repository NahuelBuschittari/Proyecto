import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';

const CapacityForm = ({ carCapacity, motoCapacity, bikeCapacity, setCarCapacity, setMotoCapacity, setBikeCapacity }) => (
  <>
    <Text style={styles.cardTitle}>Capacidades</Text>
    
    <View style={styles.grid}>
      <View style={styles.priceInputContainer}>
        <Text style={styles.label}>Cantidad de lugares para autos y camionetas</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          value={carCapacity}
          onChangeText={(text) => setCarCapacity(text)}
        />
      </View>

      <View style={styles.priceInputContainer}>
        <Text style={styles.label}>Cantidad de lugares para motos</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          value={motoCapacity}
          onChangeText={(text) => setMotoCapacity(text)}
        />
      </View>

      <View style={styles.priceInputContainer}>
        <Text style={styles.label}>Cantidad de lugares para bicicletas</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="0"
          value={bikeCapacity}
          onChangeText={(text) => setBikeCapacity(text)}
        />
      </View>
    </View>
  </>
);

export default CapacityForm;
