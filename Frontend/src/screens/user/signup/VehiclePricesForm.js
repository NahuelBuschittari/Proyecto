import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomInput from '../../../components/CustomInput';
import { styles } from '../../../styles/SharedStyles.js';

const VehiclePricesForm = ({ vehiculo, periodos, handlePriceChange, prices }) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 15 }}>
      <Text style={styles.cardTitle}>Establecer Precios para: {vehiculo}</Text>
      {periodos.map((periodo) => (
        <View key={`${vehiculo}-${periodo}`}>
        <Text style={styles.upperInputText}>Precio {periodo}</Text>
        <View style={{flexDirection: 'row', alignSelf: 'center', width:'100%', justifyContent:'center'}}>
          <Text style={[styles.label,{verticalAlign:'middle', paddingRight:'1%'}]}>$</Text>
          <CustomInput
            
            placeholder={`Ingrese el precio en formato: 0.00`}
            value={prices[periodo] || ''}
            setValue={(value) => {
              // Validar solo números
              const numericValue = value.replace(/[^0-9.]/g, '');
              handlePriceChange(vehiculo, periodo, numericValue);
            }}
            keyboardType="numeric"
          />
        </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default VehiclePricesForm;
