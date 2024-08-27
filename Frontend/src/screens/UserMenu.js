import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const UserMenu = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Llegaste al user UserMenu</Text>
      <Button
        title="Busqueda"
      onPress={() => navigation.navigate('SearchParking')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default UserMenu;