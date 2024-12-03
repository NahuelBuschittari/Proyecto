import React from 'react';
import { View,StyleSheet} from 'react-native';
import { styles } from '../../../styles/SharedStyles.js';
import MapComponent from '../../../components/MapComponent.js';
import CustomInput from '../../../components/CustomInput.js';
const AddressForm = ({ address, setAddress }) => (
  <>
    <CustomInput
      style={styles.input}
      placeholder="Dirección"
      value={address}
      setValue={setAddress}
    />
  
  </>
);

export default AddressForm;
