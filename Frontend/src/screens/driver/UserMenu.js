import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Button, Modal } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';
import axios from 'axios';


const DriverMenu = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
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
          `${API_URL}/reviews/getOpen?driver_id=${user.id}`,{
          headers: {
            'Authorization': `Bearer ${authTokens.access}`
          },
        });

        if (response.data) {
          setHasPendingReviews(true);
          // Guardar detalles de la reseña para usar después
          const reviewData = response.data;
          showReviewAlert(reviewData);
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
      // Realizar una solicitud a la API para marcar la reseña como no aplicable
      await axios.delete(`${API_URL}/reviews/${reviewId}/discard`,{
        headers: {
          'Authorization': `Bearer ${authTokens.access}`
        },
      });
    } catch (error) {
      console.error("Error al descartar la reseña:", error);
    }
  };

  // const showReviewAlert = (review) => {
  //   setCurrentReview(review);
  //   setModalVisible(true);
  // };

  

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
{/* Para probar desde la pc
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>{`¿Estacionaste en ${currentReview?.parking.nombre}?`}</Text>
            <Text>Deja una reseña para ayudar a otros usuarios.</Text>

            <Button title="No" onPress={() => {
              setModalVisible(false);
              handleNoReview(currentReview.id);
            }} />

            <Button title="Realizar Review" onPress={() => {
              setModalVisible(false);
              navigation.navigate('Review', { reviewId: currentReview.id });
            }} />
          </View>
        </View>
      </Modal> */}

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