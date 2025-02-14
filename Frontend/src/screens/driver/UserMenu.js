import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert,StyleSheet} from 'react-native';
import { theme } from '../../styles/theme';
// import {styles} from '../../styles/SharedStyles';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const DriverMenu = ({ navigation }) => {
  const [hasPendingReviews, setHasPendingReviews] = useState(true);
  const [showingReviewAlert, setShowingReviewAlert] = useState(false);
  const { logout, user, authTokens } = useAuth();

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

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/reviews/getOpen?driver_id=${user.id}`, {
            headers: {
              'Authorization': `Bearer ${authTokens.access}`
            },
          });

        if (response.data) {
          setHasPendingReviews(true);
          showReviewAlert(response.data);
        }
      } catch (error) {
        console.log("Error al obtener reseñas abiertas:", error);
      }
    };

    fetchPendingReviews();
  }, []);

  const handleNoReview = async (reviewId) => {
    setHasPendingReviews(false);
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}/discard`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        },
      });
    } catch (error) {
      console.error("Error al descartar la reseña:", error);
    }
  };

  const showReviewAlert = (review) => {
    setShowingReviewAlert(true);
    Alert.alert(
      `¿Estacionaste en ${review.parking.nombre}?`,
      "Deja una reseña para ayudar a otros usuarios a encontrar el mejor lugar para estacionar.",
      [
        {
          text: "No",
          onPress: () => {
            setShowingReviewAlert(false);
            handleNoReview(review.id);
          },
          style: "cancel"
        },
        {
          text: "Realizar Review",
          onPress: () => {
            setShowingReviewAlert(false);
            navigation.navigate('Review', { reviewId: review.id });
          }
        }
      ],
      { cancelable: false }
    );
  };

  const MenuButton = ({ title, onPress, iconName }) => (
    <TouchableOpacity 
      style={[styles.navigationButton, {
        backgroundColor: theme.colors.secondary,
        height: 250,
        width: '45%',
      }]}
      onPress={onPress}
    >
      <Icon 
        name={iconName} 
        size={40} 
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
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Principal</Text>
      
      <View style={styles.gridContainer}>
        <View style={styles.row}> 
          <MenuButton 
            title="Estacionar ahora" 
            iconName="map-search"
            onPress={() => navigation.navigate('Navigation')}
          />
          <MenuButton 
            title="Búsqueda personalizada" 
            iconName="magnify-plus"
            onPress={() => navigation.navigate('NewDrive')}
          />
        </View>
        <View style={styles.row}>
          <MenuButton 
            title="Mi perfil" 
            iconName="account"
            onPress={() => navigation.navigate('DriverProfile')}
          />
          <MenuButton 
            title="Cerrar sesión" 
            iconName="logout"
            onPress={handleLogout}
          />
        </View>
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
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
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
    padding: theme.spacing.md,
  },
  navigationButtonText: {
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.sm,
  },
  icon: {
    marginBottom: theme.spacing.sm,
  }
});

export default DriverMenu;