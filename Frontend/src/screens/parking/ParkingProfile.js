import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const ParkingProfile = ({ parkingId }) => {
  const [parkingInfo, setParkingInfo] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingInfo = async () => {
      try {
        // datos de la bd
        const response = await fetch(`https://mi-api.com/parking/${parkingId}/details`);
        const data = await response.json();

        setParkingInfo(data);
        setReviews(data.reviews || []);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del estacionamiento.');
      } finally {
        setLoading(false);
      }
    };

    fetchParkingInfo();
  }, [parkingId]);

  const renderPriceItem = ({ item }) => (
    <View style={[styles.horizontalContainer, { paddingVertical: theme.spacing.sm }]}>
      <Text style={styles.label}>{item.type}</Text>
      <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>${item.price}</Text>
    </View>
  );

  const renderReviewItem = (review, index) => (
    <View key={index} style={styles.card}>
      <Text style={styles.cardTitle}>{review.user}</Text>
      <Text style={[styles.label, { marginBottom: theme.spacing.sm }]}>{review.comment}</Text>
      <Text style={[styles.linkText, { color: theme.colors.secondary }]}>Rating: {review.rating}/5</Text>
    </View>
  );

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container, 
        { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg }
      ]}
    >
      
      <Text style={styles.title}>{parkingInfo.name || "Nombre del Estacionamiento"}</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles del Estacionamiento</Text>
        <Text style={styles.label}>Dirección: {parkingInfo.address || "No disponible"}</Text>
        <Text style={styles.label}>Horario: {parkingInfo.hours || "No disponible"}</Text>
        <Text style={styles.label}>Capacidad: {parkingInfo.capacity || "No disponible"} espacios</Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Precios</Text>
        {parkingInfo.prices ? (
          <FlatList
            data={parkingInfo.prices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPriceItem}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.errorText}>No hay información de precios disponible.</Text>
        )}
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Disponibilidad</Text>
        <Text style={styles.label}>
          Espacios disponibles: {parkingInfo.availability || "Datos no disponibles"}
        </Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Características</Text>
        {parkingInfo.features ? (
          parkingInfo.features.map((feature, index) => (
            <Text key={index} style={styles.label}>• {feature}</Text>
          ))
        ) : (
          <Text style={styles.errorText}>No hay características disponibles.</Text>
        )}
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reseñas</Text>
        {reviews.length > 0 ? (
          reviews.map(renderReviewItem)
        ) : (
          <Text style={styles.errorText}>Aún no hay reseñas para este estacionamiento.</Text>
        )}
      </View>

      
      </ScrollView>
  );
};

export default ParkingProfile;