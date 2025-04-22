import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card, Modal } from 'react-native-paper';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';
import { theme } from '../../styles/theme';

// Importar los componentes de gráficos
import PriceHistoryChart from './PriceHistoryChart';
import ScatterPlotExample from './ScatterPlotExample';
import RatingsChart from './RatingsChart';

const DataAnalysis = () => {
  const [visible, setVisible] = useState(false);
  const { user, authTokens } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedChart, setSelectedChart] = useState('price');
  const [scatterData, setScatterData] = useState([]);
  const [averageRatings, setAverageRatings] = useState({
    Seguridad: 0,
    Limpieza: 0,
    Iluminación: 0,
    Acces: 0,
    Servicio: 0
  });

  const chartDescriptions = {
    price: "Este gráfico muestra la evolución de los precios a lo largo del tiempo para diferentes tipos de vehículos (auto, camioneta, moto, bicicleta). El eje horizontal representa los períodos de tiempo, mientras que el eje vertical muestra los precios. Puedes seleccionar el tipo de tarifa específica (fracción, hora, medio día o día completo) para visualizar cómo han cambiado estos precios en el tiempo y comparar tendencias entre diferentes categorías de vehículos.",
    scatter: "Este gráfico de dispersión muestra la relación entre dos variables. Cada punto representa una observación individual donde podemos ver cómo se correlacionan ambas medidas. Este tipo de visualización es útil para identificar patrones, tendencias o anomalías en los datos, así como para detectar posibles relaciones causales entre las variables analizadas.",
    ratings: "Este gráfico muestra las calificaciones promedio que recibe el estacionamiento en cinco categorías clave. El eje horizontal presenta las diferentes categorías evaluadas (seguridad, limpieza, iluminación, accesibilidad y servicio), mientras que el eje vertical muestra la puntuación promedio para cada una. Te permite identificar rápidamente las áreas donde el servicio destaca y aquellas que podrían requerir mejoras para aumentar la satisfacción del cliente."
  };

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/parking/${user.id}/data`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos de análisis');
      }

      const data = await response.json();
      setPriceHistory(data);

    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los datos de análisis');
    }
  };

  const loadScatterData = async () => {
    try {
      const response = await fetch(`${API_URL}/parking/scatter`, {
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los datos de dispersión');
      } 

      const data = await response.json();
      console.log('Scatter data:', data);
      setScatterData(data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los datos de análisis');
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

      if (!response.ok) {
        throw new Error('Error al cargar las reseñas');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setReviews(data);

        const ratings = data.reduce((acc, review) => {
          const keys = ['Seguridad', 'Limpieza', 'Iluminación', 'Acces', 'Servicio'];
          keys.forEach(key => {
            if (!acc[key]) acc[key] = [];
            if (review[key] !== undefined) {
              acc[key].push(review[key]);
            }
          });
          return acc;
        }, {});

        const averages = Object.entries(ratings).reduce((acc, [key, values]) => {
          acc[key] = values.length > 0
            ? values.reduce((sum, val) => sum + val, 0) / values.length
            : 0;
          return acc;
        }, {});

        setAverageRatings(averages);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysisData();
    loadScatterData();
    loadReviews();
  }, []);

  const handleInfoPress = () => {
    setVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#394c74" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={[styles.reviewsContainer, {alignItems:'center', paddingTop:20}]}>
          <Text style={styles.cardTitle}>Análisis de Datos</Text>
        </View>
        <Card containerStyle={styles.card}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedChart}
              onValueChange={(itemValue) => setSelectedChart(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Historial de Precios" value="price" />
              <Picker.Item label="Relación entre Servicios y Precios" value="scatter" />
              <Picker.Item label="Calificaciones" value="ratings" />
            </Picker>
          </View>
          
          {selectedChart === 'price' && (
            <PriceHistoryChart 
              priceHistory={priceHistory} 
              onInfoPress={handleInfoPress} 
            />
          )}

          {selectedChart === 'scatter' && (
            <ScatterPlotExample
              scatterData={scatterData}
              onInfoPress={handleInfoPress}
            />
          )}

          {selectedChart === 'ratings' && (
            <RatingsChart 
              averageRatings={averageRatings} 
              onInfoPress={handleInfoPress}
            />
          )}
        </Card>
        {visible && (
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{width:'90%', alignSelf:'center'}}> 
            <Card>
              <Card.Content>
                <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf:'center' }}>Información del gráfico</Text>
                <Text style={styles.chartExplanation}>
                  {chartDescriptions[selectedChart]}
                </Text>
              </Card.Content>
              <Card.Actions style={{alignSelf:'center'}}>
                <CustomButton
                  text="Cerrar"
                  onPress={() => setVisible(false)}
                  style={{
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    width: '40%',
                    alignItems: 'center',
                    marginBottom: theme.spacing.sm
                  }}
                  textStyle={{
                    fontSize: theme.typography.fontSize.small,
                    fontWeight: theme.typography.fontWeight.bold
                  }}
                />
              </Card.Actions>
            </Card>
          </Modal>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  reviewsContainer: {
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#394c74',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
  },
  picker: {
    height: 50,
  },
  chartExplanation: {
    marginTop: 15,
    lineHeight: 22,
    textAlign: 'justify',
  },
});

export default DataAnalysis;