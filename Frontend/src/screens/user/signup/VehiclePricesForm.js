import React from 'react';
import { View, Text } from 'react-native';
import CustomInput from '../../../components/CustomInput';
import { styles } from '../../../styles/SharedStyles.js';

const VehiclePricesForm = ({ vehiculo, periodos, handlePriceChange, prices }) => {
  return (
    <>
      <Text style={styles.cardTitle}>Establecer Precios para: {vehiculo}</Text>
      {periodos.map((periodo) => (
        <>
        <Text style={styles.upperInputText}>Precio {periodo}</Text>
        <View style={{flexDirection: 'row', alignSelf: 'center', width:'100%', justifyContent:'center'}}>
          <Text style={[styles.label,{verticalAlign:'bottom'}]}>$</Text>
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
        </View>
        </>
      ))}
    </>
  );
};

export default VehiclePricesForm;
