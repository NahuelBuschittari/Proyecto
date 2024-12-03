import React from 'react';
import { Text, View} from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import CustomInput from '../../../components/CustomInput.js';
const CapacityForm = ({ capacities, setCapacities }) => {
  const handleInputChange = (key, value) => {
    setCapacities((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Text style={styles.upperInputText}>Capacidad para autos y camionetas</Text>
      <CustomInput
        placeholder="Capacidad para autos y camionetas"
        value={capacities.carCapacity}
        setValue={(value) => handleInputChange('carCapacity', value)}
        keyboardType="numeric"
      />
      <Text style={styles.upperInputText}>Capacidad para motos</Text>
      <CustomInput
        placeholder="Capacidad para motos"
        value={capacities.motoCapacity}
        setValue={(value) => handleInputChange('motoCapacity', value)}
        keyboardType="numeric"
      />
      <Text style={styles.upperInputText}>Capacidad para bicicletas</Text>
      <CustomInput
        placeholder="Capacidad para bicicletas"
        value={capacities.bikeCapacity}
        setValue={(value) => handleInputChange('bikeCapacity', value)}
        keyboardType="numeric"
      />
    </>
  );
};

export default CapacityForm;

