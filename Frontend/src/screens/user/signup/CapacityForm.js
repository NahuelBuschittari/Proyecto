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
      <Text style={styles.cardTitle}>Cantidad de espacios disponibles</Text>
      <Text style={styles.upperInputText}>Capacidad para autos y camionetas</Text>
      <CustomInput
        placeholder="Valor mínimo: 0. Ingrese 0 si no aplica"
        value={capacities.carCapacity}
        setValue={(value) => handleInputChange('carCapacity', value)}
        keyboardType="numeric"
      />
      <Text style={styles.upperInputText}>Capacidad para motos</Text>
      <CustomInput
        placeholder="Valor mínimo: 0. Ingrese 0 si no aplica"
        value={capacities.motoCapacity}
        setValue={(value) => handleInputChange('motoCapacity', value)}
        keyboardType="numeric"
      />
      <Text style={styles.upperInputText}>Capacidad para bicicletas</Text>
      <CustomInput
        placeholder="Valor mínimo: 0. Ingrese 0 si no aplica"
        value={capacities.bikeCapacity}
        setValue={(value) => handleInputChange('bikeCapacity', value)}
        keyboardType="numeric"
      />
    </>
  );
};

export default CapacityForm;

