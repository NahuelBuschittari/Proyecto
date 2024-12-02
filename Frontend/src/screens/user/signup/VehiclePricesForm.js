import React from 'react';
import { View, Text } from 'react-native';
import CustomInput from '../../../components/CustomInput';
import { styles } from '../../../styles/SharedStyles.js';

const VehiclePricesForm = ({ vehiculo, periodos, handlePriceChange, prices }) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.subtitle}>Establecer Precios para: {vehiculo}</Text>
      {periodos.map((periodo) => (
        <CustomInput
          key={`${vehiculo}-${periodo}`}
          placeholder={`Precio (${periodo})`}
          value={prices[periodo] || ''}
          setValue={(value) => {
            // Validar solo números
            const numericValue = value.replace(/[^0-9.]/g, '');
            handlePriceChange(vehiculo, periodo, numericValue);
          }}
          keyboardType="numeric"
          style={styles.priceInput}
        />
      ))}
    </View>
  );
};

export default VehiclePricesForm;
