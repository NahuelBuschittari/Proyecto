import React from 'react';
import { View,StyleSheet} from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import MapComponent from '../../../components/MapComponent.js';
import CustomInput from '../../../components/CustomInput.js';
const AddressForm = ({ address, setAddress }) => (
  <View style={styles.container}>
    <CustomInput
      style={styles.input}
      placeholder="Dirección"
      value={address}
      setValue={setAddress}
    />
  
  </View>
);

export default AddressForm;
