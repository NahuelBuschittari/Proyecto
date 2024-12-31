import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

// Constantes para la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://mi-api.com';
const API_ENDPOINTS = {
  parkingDetails: (id) => `/parking/${id}/details`,
};

const ParkingProfile = ({ parkingId }) => {
  const [parkingInfo, setParkingInfo] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchParkingInfo = useCallback(async (showFullLoading = true) => {
    try {
      if (showFullLoading) setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.parkingDetails(parkingId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Aquí puedes agregar headers adicionales como tokens de autenticación
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setParkingInfo(data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching parking data:', error);
      
      if (error.message.includes('Network') && retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      } else {
        setError('No se pudo cargar la información del estacionamiento');
        Alert.alert(
          'Error',
          'No se pudo cargar la información del estacionamiento.',
          [
            {
              text: 'Reintentar',
              onPress: () => {
                setRetryCount(0);
                fetchParkingInfo();
              }
            }
          ]
        );
      }
    } finally {
      if (showFullLoading) setLoading(false);
    }
  }, [parkingId, retryCount]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchParkingInfo(false);
    setRefreshing(false);
  }, [fetchParkingInfo]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchParkingInfo();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchParkingInfo]);

  const renderPriceItem = ({ item }) => (
    <View style={[styles.horizontalContainer, { paddingVertical: theme.spacing.sm }]}>
      <Text style={styles.label}>{item.type}</Text>
      <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>${item.price}</Text>
    </View>
  );

  const renderReviewItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.user || 'Usuario desconocido'}</Text>
      <Text style={[styles.label, { marginBottom: theme.spacing.sm }]}>{item.comment || 'Sin comentarios'}</Text>
      <Text style={[styles.linkText, { color: theme.colors.secondary }]}>Rating: {item.rating || 0}/5</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg, flexGrow: 1 }
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      <View style={[styles.container, { padding: theme.spacing.md }]}>
        <Text style={styles.title}>{parkingInfo.name}</Text>
        <Text style={styles.subtitle}>{parkingInfo.address}</Text>
        
        {/* Detalles del estacionamiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          <Text style={styles.text}>Horario: {parkingInfo.schedule}</Text>
          <Text style={styles.text}>Espacios: {parkingInfo.spaces}</Text>
          <Text style={styles.text}>Tipo: {parkingInfo.type}</Text>
        </View>

        {/* Precios */}
        {parkingInfo.prices && parkingInfo.prices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precios</Text>
            <FlatList
              data={parkingInfo.prices}
              renderItem={renderPriceItem}
              keyExtractor={(item, index) => `price-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Reseñas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item, index) => `review-${index}`}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay reseñas disponibles</Text>
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ParkingProfile;