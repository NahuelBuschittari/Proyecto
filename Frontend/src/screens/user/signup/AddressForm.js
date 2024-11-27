import React from 'react';
import { TextInput, View,StyleSheet} from 'react-native';
import { styles } from './SharedStyles.js';
import MapComponent from '../../../components/MapComponent.js';
const AddressForm = ({ address, setAddress }) => (
  <View style={styles2.container}>
    <TextInput
      style={styles.input}
      placeholder="Dirección"
      value={address}
      onChangeText={setAddress}
    />
    <MapComponent />
  </View>
);

const styles2 = StyleSheet.create({
    container: {
        flex: 8,
    },
});
export default AddressForm;
