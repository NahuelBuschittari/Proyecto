import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const ParkingMenu = ({ navigation }) => {
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
          title="Análisis de Datos" 
          onPress={() => navigation.navigate('DataAnalysis')}
        />
        <MenuButton 
          title="Actualizar Espacio" 
          onPress={() => navigation.navigate('UpdateSpace')}
        />
        <MenuButton 
          title="Actualizar Precios" 
          onPress={() => navigation.navigate('UpdatePrices')}
        />
        <MenuButton 
          title="Actualizar Características" 
          onPress={() => navigation.navigate('UpdateCharacteristics')}
        />
        <MenuButton 
          title="Información de Pago" 
          onPress={() => navigation.navigate('Payment')}
        />
        <MenuButton 
          title="Perfil de Estacionamiento" 
          onPress={() => navigation.navigate('ParkingProfile')}
        />
        <MenuButton 
          title="Cerrar Sesión" 
          onPress={() => {
            // No action for now, as requested
            console.log('Logout button pressed');
          }}
        />
      </ScrollView>
    </View>
  );
};

export default ParkingMenu;