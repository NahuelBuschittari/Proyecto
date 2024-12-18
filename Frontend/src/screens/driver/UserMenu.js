import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const DriverMenu = ({ navigation }) => {
  const MenuButton = ({ title, onPress }) => (
    <TouchableOpacity 
      style={[styles.navigationButton, {
        backgroundColor: theme.colors.secondary,
        marginVertical: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
        width: '90%', 
        alignSelf: 'center', 
      }]}
      onPress={onPress}
    >
      <Text 
        style={[
          styles.navigationButtonText, 
          { 
            color: theme.colors.text, 
            fontSize: theme.typography.fontSize.normal, 
            textAlign: 'center' 
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { justifyContent: 'flex-start' }]}>
      <Text style={styles.title}>Menú Principal</Text>
      
      <ScrollView 
        contentContainerStyle={{
          width: '100%',
          alignItems: 'center',
          paddingBottom: theme.spacing.lg
        }}
        showsVerticalScrollIndicator={false}
      >
        <MenuButton 
          title="Navegación" 
          onPress={() => navigation.navigate('Navigation')}
        />
        <MenuButton 
          title="Nuevo Viaje" 
          onPress={() => navigation.navigate('NewDrive')}
        />
        <MenuButton 
          title="Perfil" 
          onPress={() => navigation.navigate('DriverProfile')}
        />
      </ScrollView>
    </View>
  );
};

export default DriverMenu;