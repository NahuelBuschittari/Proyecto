import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
import { LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

// Constantes para la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://tu-backend-api.com';
const API_ENDPOINTS = {
  data: '/api/data',
};

// Servicio para manejar las llamadas a la API
const fetchDataService = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.data}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Aquí puedes agregar headers adicionales como tokens de autenticación
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
};

const DataAnalysis = () => {
  const [selectedChart, setSelectedChart] = useState('price');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const screenWidth = Dimensions.get('window').width - 20;
  const screenHeight = Math.min(Dimensions.get('window').height * 0.45, 300);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 segundos

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    decimalPlaces: 1,
    color: (opacity = 1) => theme.colors.text,
    labelColor: () => theme.colors.text,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchDataService();
      
      // Validación básica de datos
      if (!result || !result.priceEvolution || !result.capacityUtilization || 
          !result.hourlyDemand || !result.vehicleTypeOccupancy) {
        throw new Error('Datos incompletos o en formato incorrecto');
      }
      
      setData(result);
    } catch (err) {
      console.error('Error loading data:', err);
      
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, RETRY_DELAY);
      } else {
        setError('No se pudieron cargar los datos. Por favor, intente más tarde.');
        Alert.alert(
          'Error de conexión',
          'No se pudieron cargar los datos. ¿Desea intentar nuevamente?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Reintentar',
              onPress: () => {
                setRetryCount(0);
              },
            },
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [retryCount]);

  const renderChart = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }
    if (error) {
      return <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>;
    }

    switch (selectedChart) {
      case 'price':
        return (
          <LineChart
            data={{
              labels: data.priceEvolution.map((p) => p.week),
              datasets: [
                {
                  data: data.priceEvolution.map((p) => p.price),
                  color: () => theme.colors.primary,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth}
            height={screenHeight}
            yAxisLabel="$"
            chartConfig={chartConfig}
            bezier
          />
        );
      case 'capacity':
        return (
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                <View style={{ width: 20, height: 20, backgroundColor: theme.colors.secondary }} />
                <Text style={{ marginLeft: 5 }}>Disponible</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, backgroundColor: theme.colors.primary }} />
                <Text style={{ marginLeft: 5 }}>Ocupado</Text>
              </View>
            </View>
            <StackedBarChart
              data={{
                labels: data.capacityUtilization.map((c) => c.month),
                legend: [],
                data: data.capacityUtilization.map((c) => [c.available, c.occupied]),
                barColors: [theme.colors.secondary, theme.colors.primary],
              }}
              width={screenWidth}
              height={screenHeight}
              chartConfig={{
                ...chartConfig,
                legendPosition: 'bottom',
                barPercentage: 0.5,
                decimalPlaces: 0,
              }}
              hideLegend={true}
              fromZero
            />
          </View>
        );
      case 'hourly':
        return (
          <LineChart
            data={{
              labels: data.hourlyDemand.map((h) => h.hour),
              datasets: [
                {
                  data: data.hourlyDemand.map((h) => h.vehicles),
                  color: () => theme.colors.primary,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth}
            height={screenHeight}
            yAxisLabel=""
            yAxisSuffix=" veh"
            chartConfig={chartConfig}
            bezier
          />
        );
      case 'vehicle-types':
        return (
          <PieChart
            data={data.vehicleTypeOccupancy.map((v) => ({
              name: v.type,
              population: v.percentage,
              color: v.color,
              legendFontColor: theme.colors.text,
              legendFontSize: 12,
            }))}
            width={screenWidth}
            height={screenHeight * 0.7}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[0, 0]}
            absolute
          />
        );
    }
  };

  const chartOptions = [
    { key: 'price', label: 'Evolución de Precios' },
    { key: 'capacity', label: 'Uso de Capacidad' },
    { key: 'hourly', label: 'Demanda Horaria' },
    { key: 'vehicle-types', label: 'Tipos de Vehículos' },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.fullScreenContainer,
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          paddingBottom: 20,
        },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadData}
          colors={[theme.colors.primary]}
        />
      }
    >
      <View
        style={[
          styles.container,
          {
            width: '100%',
            alignItems: 'center',
            paddingTop: 20,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              textAlign: 'center',
              marginBottom: 20,
            },
          ]}
        >
          Análisis de Datos
        </Text>
        <ScrollView
          horizontal
          contentContainerStyle={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          {chartOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSelectedChart(option.key)}
              style={[
                styles.navigationButton,
                {
                  margin: 5,
                  backgroundColor:
                    selectedChart === option.key
                      ? theme.colors.primary
                      : theme.colors.secondary,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <Text
                style={[
                  styles.navigationButtonText,
                  {
                    color: selectedChart === option.key ? 'white' : theme.colors.text,
                    textAlign: 'center',
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View
          style={{
            width: '100%',
            height: screenHeight,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderChart()}
        </View>
      </View>
    </ScrollView>
  );
};

export default DataAnalysis;