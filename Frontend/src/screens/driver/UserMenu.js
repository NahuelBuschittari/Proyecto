import React,{useState,useEffect,useLayoutEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import {useAuth} from '../../context/AuthContext';
const DriverMenu = ({ navigation }) => {
  const [hasPendingReviews, setHasPendingReviews] = useState(true);
  const [showingReviewAlert, setShowingReviewAlert] = useState(false);
  const { logout } = useAuth();
  useEffect(() => {
    // Verificar si hay reseñas pendientes
    // setHasPendingReviews(true); // Simulación de reseñas pendientes
    if (hasPendingReviews && !showingReviewAlert) {
      showReviewAlert();
    }
  }, [hasPendingReviews]);
  useLayoutEffect(() => {
    navigation.setOptions({
        headerLeft: () => null,
        headerLeftContainerStyle: { width: 0 }
    });
}, [navigation]);

const handleLogout = async () => {
  try {
    await logout();
    // No necesitas hacer navigate ya que el AuthContext se encargará de mostrar 
    // la pantalla de login cuando user sea null
  } catch (error) {
    Alert.alert(
      'Error',
      'Hubo un problema al cerrar sesión. Por favor intente nuevamente.'
    );
  }
};
const showReviewAlert = () => {
    setShowingReviewAlert(true);
    Alert.alert(
      "¿Estacionaste en este parking?",
      "Deja una reseña para ayudar a otros usuarios a encontrar el mejor lugar para estacionar.",
      [
      {
        text: "No",
        onPress: () => {
        setShowingReviewAlert(false);
        setHasPendingReviews(false);
        // Llamada a la API para marcar la reseña como no aplicable
        },
        style: "cancel"
      },
      {
        text: "Realizar Review",
        onPress: () => {
        setShowingReviewAlert(false);
        navigation.navigate('Review'); // Navegar a la pantalla de reseñas
        }
      }
      ],
      { cancelable: false }
    );
  };
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
          title="Búsqueda inmediata desde el mapa" 
          onPress={() => navigation.navigate('Navigation')}
        />
        <MenuButton 
          title="Búsqueda personalizada" 
          onPress={() => navigation.navigate('NewDrive')}
        />
        <MenuButton 
          title="Mi perfil" 
          onPress={() => navigation.navigate('DriverProfile')}
        />
        <MenuButton 
          title="Cerrar sesión" 
          onPress={handleLogout}
        />
      </ScrollView>
    </View>
  );
};

export default DriverMenu;