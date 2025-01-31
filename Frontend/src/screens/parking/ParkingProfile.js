import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';

const ParkingProfile = () => {
  const { user, authTokens } = useAuth();
  const [parkingInfo, setParkingInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    loadParkingInfo();
    loadReviews();
  }, []);

  const loadParkingInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/parking/${user.id}/details`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar la información');
      }

      const data = await response.json();
      setParkingInfo(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo cargar la información del estacionamiento');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/parking/${user.id}/reviews`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const renderSchedule = (schedule) => {
    const days = {
      lunes: 'Lunes',
      martes: 'Martes',
      miercoles: 'Miércoles',
      jueves: 'Jueves',
      viernes: 'Viernes',
      sabado: 'Sábado',
      domingo: 'Domingo',
      feriados: 'Feriados'
    };

    return Object.entries(days).map(([key, label]) => (
      <View key={key} style={styles.scheduleRow}>
        <Text style={styles.dayLabel}>{label}</Text>
        <Text style={styles.scheduleText}>
          {schedule[key].open ? `${schedule[key].open} - ${schedule[key].close}` : 'Cerrado'}
        </Text>
      </View>
    ));
  };

  const getFeatureLabel = (key) => {
    const featureLabels = {
      'isCovered': '¿Está techado?',
      'has24hSecurity': '¿Tiene seguridad 24 horas?',
      'hasCCTV': '¿Cuenta con cámaras de vigilancia?',
      'hasValetService': '¿Ofrece servicio de valet?',
      'hasDisabledParking': '¿Estacionamiento para discapacitados?',
      'hasEVChargers': '¿Cargadores para vehículos eléctricos?',
      'hasAutoPayment': '¿Ofrece sistema de pago automático?',
      'hasCardAccess': '¿Tiene acceso con tarjeta/ticket?',
      'hasCarWash': '¿Ofrece lavado de autos?',
      'hasRestrooms': '¿Tiene baños disponibles?',
      'hasBreakdownAssistance': '¿Ofrece asistencia para averías?',
      'hasFreeWiFi': '¿Cuenta con cobertura WiFi gratuita?'
    };
  
    return featureLabels[key] || key.replace(/has|is/g, '').replace(/([A-Z])/g, ' $1').trim();
  };

  const renderPriceSection = (title, prices) => (
    <View style={styles.priceSection}>
      <Text style={styles.priceTitle}>{title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Fracción</Text>
        <Text style={styles.priceValue}>${prices.fraccion}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Hora</Text>
        <Text style={styles.priceValue}>${prices.hora}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Medio Día</Text>
        <Text style={styles.priceValue}>${prices.medio_dia}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Día Completo</Text>
        <Text style={styles.priceValue}>${prices.dia_completo}</Text>
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.infoCard}>
      <Text style={styles.sectionTitle}>Reseñas</Text>
      {reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>No hay reseñas disponibles</Text>
      ) : (
        reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewerName}>{review.Usuario}</Text>
            <Text style={styles.reviewComment}>{review.Comentario}</Text>
            <View style={styles.ratingsContainer}>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Seguridad</Text>
                <Text style={styles.ratingValue}>{review.Seguridad}/5</Text>
              </View>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Limpieza</Text>
                <Text style={styles.ratingValue}>{review.Limpieza}/5</Text>
              </View>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Iluminación</Text>
                <Text style={styles.ratingValue}>{review.Iluminación}/5</Text>
              </View>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Accesibilidad</Text>
                <Text style={styles.ratingValue}>{review.Accesibilidad}/5</Text>
              </View>
              <View style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>Servicio</Text>
                <Text style={styles.ratingValue}>{review.Servicio}/5</Text>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !parkingInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { maxHeight: screenHeight * 0.9 }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>{parkingInfo.name}</Text>
          <Text style={styles.subtitle}>{parkingInfo.address}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Capacidad</Text>
          <View style={styles.capacityContainer}>
            <View style={styles.capacityItem}>
              <Text style={styles.capacityValue}>{parkingInfo.carCapacity}</Text>
              <Text style={styles.capacityLabel}>Autos</Text>
            </View>
            <View style={styles.capacityItem}>
              <Text style={styles.capacityValue}>{parkingInfo.motoCapacity}</Text>
              <Text style={styles.capacityLabel}>Motos</Text>
            </View>
            <View style={styles.capacityItem}>
              <Text style={styles.capacityValue}>{parkingInfo.bikeCapacity}</Text>
              <Text style={styles.capacityLabel}>Bicicletas</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Horarios</Text>
          {parkingInfo.schedule && renderSchedule(parkingInfo.schedule)}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Características</Text>
          {Object.entries(parkingInfo.features || {}).map(([key, value]) => (
            <View key={key} style={styles.featureRow}>
              <Text style={styles.featureLabel}>
                {getFeatureLabel(key)}
              </Text>
              <Text style={[styles.featureValue, { color: value ? theme.colors.success : theme.colors.error }]}>
                {value ? 'Sí' : 'No'}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Tarifas</Text>
          {renderPriceSection('Automóviles', {
            fraccion: parkingInfo.prices.auto_fraccion,
            hora: parkingInfo.prices.auto_hora,
            medio_dia: parkingInfo.prices.auto_medio_dia,
            dia_completo: parkingInfo.prices.auto_dia_completo
          })}
          {renderPriceSection('Camionetas', {
            fraccion: parkingInfo.prices.camioneta_fraccion,
            hora: parkingInfo.prices.camioneta_hora,
            medio_dia: parkingInfo.prices.camioneta_medio_dia,
            dia_completo: parkingInfo.prices.camioneta_dia_completo
          })}
          {renderPriceSection('Motos', {
            fraccion: parkingInfo.prices.moto_fraccion,
            hora: parkingInfo.prices.moto_hora,
            medio_dia: parkingInfo.prices.moto_medio_dia,
            dia_completo: parkingInfo.prices.moto_dia_completo
          })}
          {renderPriceSection('Bicicletas', {
            fraccion: parkingInfo.prices.bici_fraccion,
            hora: parkingInfo.prices.bici_hora,
            medio_dia: parkingInfo.prices.bici_medio_dia,
            dia_completo: parkingInfo.prices.bici_dia_completo
          })}
        </View>

        {renderReviews()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F6F8',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
  },
  headerCard: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  capacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  capacityItem: {
    alignItems: 'center',
  },
  capacityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  capacityLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  dayLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  scheduleText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  featureLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  priceSection: {
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  reviewCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ratingItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  noReviewsText: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});

export default ParkingProfile;