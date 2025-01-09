import React,{useState,useEffect,useLayoutEffect} from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const DriverMenu = ({ navigation }) => {
  const [hasPendingReviews, setHasPendingReviews] = useState(true);
  const [showingReviewAlert, setShowingReviewAlert] = useState(false);
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
      </ScrollView>
    </View>
  );
};

export default DriverMenu;