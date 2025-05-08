import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';

// ID del usuario que debe ser bloqueado
const BLOCKED_USER_ID = 47; // Reemplaza esto con el ID específico

const MenuButton = ({ title, onPress, iconName, disabled }) => (
  <TouchableOpacity 
    style={[styles.navigationButton, {
      backgroundColor: disabled ? '#ccc' : theme.colors.secondary,
      height: 150,
      width: '45%',
    }]} 
    onPress={disabled ? () => {} : onPress}
    disabled={disabled}
  >
    <Icon 
      name={iconName} 
      size={35} 
      color={theme.colors.background}
      style={styles.icon}
    />
    <Text 
      style={[
        styles.navigationButtonText, 
        { 
          color: theme.colors.background, 
          fontSize: theme.typography.fontSize.normal,
          textAlign: 'center',
        }
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

const ParkingMenu = ({ navigation }) => {
  const { logout, user } = useAuth();
  const [bloqueado, setBloqueado] = useState(false);
  
  useEffect(() => {
    // Comprueba si el ID del usuario actual coincide con el ID bloqueado
    if (user && user.id === BLOCKED_USER_ID) {
      setBloqueado(true);
      Alert.alert(
        'Acceso restringido',
        'Para seguir usando la app, debe realizar el pago correspondiente.',
        [{ text: 'Aceptar' }]
      );
    }
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al cerrar sesión. Por favor intente nuevamente.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      
      <View style={styles.gridContainer}>
        <View style={styles.row}> 
          <MenuButton 
            title="Análisis de Datos" 
            iconName="chart-bar"
            onPress={() => navigation.navigate('DataAnalysis')}
            disabled={bloqueado}
          />
          <MenuButton 
            title="Actualizar Espacio" 
            iconName="parking"
            onPress={() => navigation.navigate('UpdateSpace')}
            disabled={bloqueado}
          />
        </View>
        <View style={styles.row}>
          <MenuButton 
            title="Actualizar Precios" 
            iconName="currency-usd"
            onPress={() => navigation.navigate('UpdatePrices')}
            disabled={bloqueado}
          />
          <MenuButton 
            title="Actualizar Características" 
            iconName="cog"
            onPress={() => navigation.navigate('UpdateCharacteristics')}
            disabled={bloqueado}
          />
        </View>
        <View style={styles.row}>
          <MenuButton 
            title="Información de Pago" 
            iconName="credit-card"
            onPress={() => navigation.navigate('Payment')}
          />
          <MenuButton 
            title="Perfil de Estacionamiento" 
            iconName="account"
            onPress={() => navigation.navigate('ParkingProfile')}
            disabled={bloqueado}
          />
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Icon 
            name="logout" 
            size={35} 
            color={theme.colors.background}
            style={styles.icon}
          />
          <Text 
            style={[
              styles.navigationButtonText, 
              { 
                color: theme.colors.background, 
                fontSize: theme.typography.fontSize.normal,
                textAlign: 'center',
              }
            ]}
          >
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xl,
    color: theme.colors.primary,
  },
  gridContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  navigationButton: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: theme.spacing.sm,
  },
  logoutButton: {
    backgroundColor: theme.colors.secondary,
    height: 130,
    width: '100%',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  navigationButtonText: {
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.sm,
  },
  icon: {
    marginBottom: theme.spacing.xs,
  }
});

export default ParkingMenu;