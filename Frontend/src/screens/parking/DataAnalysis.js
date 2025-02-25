
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { Card,Modal} from 'react-native-paper';
import CustomButton from '../../components/CustomButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';
import { theme } from '../../styles/theme';

const DataAnalysis = () => {
  const [visible, setVisible] = useState(false);
  const { user, authTokens } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedChart, setSelectedChart] = useState('price');
  const [selectedOccupancy, setSelectedOccupancy] = useState('car_occupied');
  const [selectedPriceType, setSelectedPriceType] = useState('fraccion');
  const [averageRatings, setAverageRatings] = useState({
    Seguridad: 0,
    Limpieza: 0,
    Iluminación: 0,
    Acces: 0,
    Servicio: 0
  });
  const priceTypes = {
    fraccion: 'Fracción',
    hora: 'Por Hora',
    medio_dia: 'Medio Día',
    dia_completo: 'Día Completo'
  };

  const chartDescriptions = {
    price: "Este gráfico muestra la evolución de los precios a lo largo del tiempo para diferentes tipos de vehículos (auto, camioneta, moto, bicicleta). El eje horizontal representa los períodos de tiempo, mientras que el eje vertical muestra los precios. Puedes seleccionar el tipo de tarifa específica (fracción, hora, medio día o día completo) para visualizar cómo han cambiado estos precios en el tiempo y comparar tendencias entre diferentes categorías de vehículos.",
    occupancy: "Este gráfico presenta el promedio de ocupación por mes para el tipo de vehículo seleccionado. El eje horizontal muestra los períodos de tiempo, mientras que el eje vertical representa el promedio de ocupación. Al seleccionar un tipo específico de vehículo (auto, moto o bicicleta), podras analizar tendencias y variaciones en la demanda de espacios para el tipo de vehiculo en distintos períodos",
    ratings: "Este gráfico muestra las calificaciones promedio que recibe el estacionamiento en cinco categorías clave. El eje horizontal presenta las diferentes categorías evaluadas (seguridad, limpieza, iluminación, accesibilidad y servicio), mientras que el eje vertical muestra la puntuación promedio para cada una. Te permite identificar rápidamente las áreas donde el servicio destaca y aquellas que podrían requerir mejoras para aumentar la satisfacción del cliente.",
    priceVsOccupancy: "Este gráfico de dispersión muestra la relación entre precio y ocupación diaria para cada tipo de vehículo. Cada punto representa un día específico. La línea roja muestra la tendencia general y el punto naranja indica el precio óptimo estimado que maximizaría los ingresos. Analizando estos datos diarios, puedes identificar patrones específicos por día de la semana y temporadas, permitiéndote ajustar precios de forma más precisa para diferentes situaciones."
  };

  const getPriceDataByType = (data, type) => {
    const groupedData = data.reduce((acc, item) => {
      const month = item.fecha.substring(0, 7); // Extraer "YYYY-MM"
      if (!acc[month]) {
        acc[month] = { count: 0, auto: 0, camioneta: 0, moto: 0, bici: 0 };
      }
      acc[month].count += 1;
      acc[month].auto += item[`auto_${type}`] || 0;
      acc[month].camioneta += item[`camioneta_${type}`] || 0;
      acc[month].moto += item[`moto_${type}`] || 0;
      acc[month].bici += item[`bici_${type}`] || 0;
      return acc;
    }, {});
  
    const months = Object.keys(groupedData).sort();
    const monthLabels = months.map(formatMonth);
    const averagedData = months.map(month => ({
      auto: groupedData[month].auto / groupedData[month].count,
      camioneta: groupedData[month].camioneta / groupedData[month].count,
      moto: groupedData[month].moto / groupedData[month].count,
      bici: groupedData[month].bici / groupedData[month].count,
    }));
  
    return {
      labels: monthLabels,
      datasets: [
        { data: averagedData.map(d => d.auto), color: () => vehicleColors.auto },
        { data: averagedData.map(d => d.camioneta), color: () => vehicleColors.camioneta },
        { data: averagedData.map(d => d.moto), color: () => vehicleColors.moto },
        { data: averagedData.map(d => d.bici), color: () => vehicleColors.bici }
      ],
      legend: ['Auto', 'Camioneta', 'Moto', 'Bicicleta']
    };
  };

// Función para formatear los meses de manera más amigable
const formatMonth = (yearMonth) => {
  const [year, month] = yearMonth.split('-');
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

// Función para agrupar datos de ocupación por mes
const getOccupancyDataByMonth = (data, occupancyField) => {
  const groupedData = data.reduce((acc, item) => {
    if (!item.fecha) return acc;
    
    const month = item.fecha.substring(0, 7); // "YYYY-MM"
    if (!acc[month]) {
      acc[month] = { count: 0, total: 0 };
    }
    
    acc[month].count += 1;
    acc[month].total += Number(item[occupancyField] || 0);
    
    return acc;
  }, {});

  const months = Object.keys(groupedData).sort();
  const monthLabels = months.map(formatMonth);
  const averagedData = months.map(month => 
    groupedData[month].count > 0 
      ? groupedData[month].total / groupedData[month].count 
      : 0
  );

  return {
    labels: monthLabels,
    datasets: [{
      data: averagedData,
      color: () => '#394c74',
    }],
  };
};
const [selectedVehicleType, setSelectedVehicleType] = useState('auto');

// Modificación de la función para obtener datos de precio vs. ocupación por día en lugar de por mes
const getPriceVsOccupancyData = (vehicleType) => {
  // Verificar que tengamos suficientes datos
  if (!priceHistory.length || !occupancyData.length) {
    return null;
  }

  // Mapeo de tipos de vehículos a sus campos correspondientes
  const vehicleMapping = {
    auto: { price: 'auto_fraccion', occupied: 'car_occupied' },
    camioneta: { price: 'camioneta_fraccion', occupied: 'car_occupied' },
    moto: { price: 'moto_fraccion', occupied: 'moto_occupied' },
    bici: { price: 'bici_fraccion', occupied: 'bike_occupied' }
  };
  
  const priceField = vehicleMapping[vehicleType]?.price;
  const occupiedField = vehicleMapping[vehicleType]?.occupied;
  
  if (!priceField || !occupiedField) return null;

  // Mapa de fechas a precios (usando fechas completas, no solo meses)
  const priceMap = {};
  priceHistory.forEach(item => {
    if (item.fecha && item[priceField] !== undefined) {
      const date = item.fecha.substring(0, 10); // Formato YYYY-MM-DD
      priceMap[date] = item[priceField];
    }
  });

  // Mapa de fechas a ocupación (usando fechas completas)
  const occupancyMap = {};
  occupancyData.forEach(item => {
    if (item.fecha && item[occupiedField] !== undefined) {
      const date = item.fecha.substring(0, 10); // Formato YYYY-MM-DD
      occupancyMap[date] = item[occupiedField];
    }
  });

  // Encontrar fechas que tienen tanto datos de precio como de ocupación
  const commonDates = Object.keys(priceMap).filter(date => occupancyMap[date] !== undefined);
  
  if (commonDates.length < 5) { // Requerimos al menos 5 días para un análisis significativo
    return null;
  }

  // Formatear fecha para mostrarla de manera más amigable
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}`;
  };

  // Crear puntos de datos para el gráfico de dispersión
  const scatterData = commonDates.map(date => {
    return {
      date: formatDate(date),
      fullDate: date,
      price: priceMap[date],
      occupancy: occupancyMap[date]
    };
  });

  // Calcular línea de tendencia
  const n = scatterData.length;
  
  // Calcular coeficientes para la línea de tendencia
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  scatterData.forEach(point => {
    sumX += point.price;
    sumY += point.occupancy;
    sumXY += point.price * point.occupancy;
    sumXX += point.price * point.price;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Encontrar precio óptimo (punto donde el ingreso se maximiza)
  // Ingreso = Precio * Ocupación
  // Para cada precio, estimar la ocupación usando la línea de tendencia
  const priceRange = scatterData.map(d => d.price);
  const minPrice = Math.min(...priceRange);
  const maxPrice = Math.max(...priceRange);
  
  let optimalPrice = minPrice;
  let maxRevenue = 0;
  
  // Intentar diferentes precios para encontrar el óptimo
  for (let price = minPrice; price <= maxPrice; price += (maxPrice - minPrice) / 50) {
    const predictedOccupancy = slope * price + intercept;
    const revenue = price * predictedOccupancy;
    
    if (revenue > maxRevenue) {
      maxRevenue = revenue;
      optimalPrice = price;
    }
  }
  
  const optimalOccupancy = slope * optimalPrice + intercept;
  
  // Ordenar datos para el eje X
  scatterData.sort((a, b) => a.price - b.price);
  
  // Crear puntos para la línea de tendencia
  const trendLinePoints = [];
  const xValues = scatterData.map(d => d.price);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  
  // Generar puntos para la línea de tendencia
  for (let x = minX; x <= maxX; x += (maxX - minX) / 10) {
    trendLinePoints.push({
      price: x,
      occupancy: slope * x + intercept
    });
  }
  
  // Agrupar datos por rango de precios para identificar los días más rentables
  const priceGroups = {};
  const priceStep = (maxPrice - minPrice) / 5; // Dividir en 5 grupos
  
  scatterData.forEach(item => {
    const groupIndex = Math.min(4, Math.floor((item.price - minPrice) / priceStep));
    const groupKey = `grupo_${groupIndex}`;
    if (!priceGroups[groupKey]) {
      priceGroups[groupKey] = [];
    }
    priceGroups[groupKey].push({
      ...item,
      revenue: item.price * item.occupancy
    });
  });
  
  // Encontrar los días más rentables
  let bestDays = [];
  let highestRevenue = 0;
  
  Object.values(priceGroups).forEach(group => {
    group.forEach(day => {
      if (day.revenue > highestRevenue) {
        highestRevenue = day.revenue;
        bestDays = [day];
      } else if (day.revenue === highestRevenue) {
        bestDays.push(day);
      }
    });
  });
  
  // Formatear datos para el gráfico de dispersión
  return {
    labels: scatterData.map(d => `$${Math.round(d.price)}`),
    datasets: [
      {
        // Puntos de datos reales
        data: scatterData.map(d => d.occupancy),
        color: () => '#394c74',
      },
      {
        // Línea de tendencia
        data: trendLinePoints.map(d => d.occupancy),
        color: () => 'rgba(255, 99, 132, 0.7)',
        withDots: false,
        withLines: true,
      },
      {
        // Punto óptimo
        data: [optimalOccupancy],
        color: () => '#FF5722',
        withDots: true,
        pointRadius: 8,
      }
    ],
    // Metadatos adicionales
    prices: scatterData.map(d => d.price),
    dates: scatterData.map(d => d.date),
    fullDates: scatterData.map(d => d.fullDate),
    optimalPoint: {
      price: optimalPrice,
      occupancy: optimalOccupancy,
      revenue: optimalPrice * optimalOccupancy
    },
    bestDay: bestDays.length > 0 ? bestDays[0] : null,
    dataPoints: scatterData
  };
};

  const screenWidth = Dimensions.get('window').width;

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

      if (data.price_history && Array.isArray(data.price_history)) {
        setPriceHistory(data.price_history);
      }

      if (data.space_history && Array.isArray(data.space_history)) {
        setOccupancyData(data.space_history);
      }
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
    loadReviews();
  }, []);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(57, 76, 116, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const vehicleColors = {
    auto: '#4CAF50',      // Verde
    camioneta: '#2196F3', // Azul
    moto: '#FFC107',      // Amarillo
    bici: '#F44336'       // Rojo
  };

  const filteredReviews = reviews.filter((review) => {
    const averageRating = (
      (Number(review.Seguridad || 0) +
        Number(review.Limpieza || 0) +
        Number(review.Iluminación || 0) +
        Number(review.Acces || 0) +
        Number(review.Servicio || 0)) / 5
    ).toFixed(1);
    return averageRating > 0;
  });

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
      <View style={[styles.reviewsContainer,{alignItems:'center',paddingTop:20}]}>
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
            <Picker.Item label="Ocupación" value="occupancy" />
            <Picker.Item label="Calificaciones" value="ratings" />
            {/* <Picker.Item label="Precio vs. Ocupación" value="priceVsOccupancy" /> */}
          </Picker>
          </View>
          
          {selectedChart === 'price' && (
            <View style={styles.chartWrapper}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedPriceType}
                  onValueChange={(itemValue) => setSelectedPriceType(itemValue)}
                  style={styles.picker}
                >
                  {Object.entries(priceTypes).map(([value, label]) => (
                    <Picker.Item key={value} label={label} value={value} />
                  ))}
                </Picker>
              </View>
              
              {priceHistory.length > 0 ? (
                <View style={styles.chartContainer}>
                    <MaterialCommunityIcons
                              name="information-outline"
                              size={17}
                              onPress={() => setVisible(true)}
                              style={{ position: 'absolute',  right: 10,top:8}}
                    />
                  <LineChart
                    data={getPriceDataByType(priceHistory, selectedPriceType)}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    yAxisLabel="$"
                    legend
                  />
                </View>
              ) : (
                <Text style={styles.noDataText}>No hay datos de precios disponibles</Text>
              )}
            </View>
          )}

          {selectedChart === 'occupancy' && (
            <View style={styles.chartWrapper}>
              <Picker
                selectedValue={selectedOccupancy}
                onValueChange={(itemValue) => setSelectedOccupancy(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Ocupación de Autos" value="car_occupied" />
                <Picker.Item label="Ocupación de Motos" value="moto_occupied" />
                <Picker.Item label="Ocupación de Bicicletas" value="bike_occupied" />
              </Picker>

              {occupancyData.length > 0 ? (
                <View style={styles.chartContainer}>
                  <MaterialCommunityIcons
                              name="information-outline"
                              size={17}
                              onPress={() => setVisible(true)}
                              style={{ position: 'absolute',  right: 10,top:8}}
                    />
                  <LineChart
                    data={getOccupancyDataByMonth(occupancyData, selectedOccupancy)}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    yAxisLabel=" "
                  />
                </View>
              ) : (
                <Text style={styles.noDataText}>No hay datos de ocupación disponibles</Text>
              )}
            </View>
          )}

          {selectedChart === 'ratings' && (
            <View style={styles.chartWrapper}>
              {Object.keys(averageRatings).length > 0 ? (
                <View style={styles.chartContainer}>
                  <MaterialCommunityIcons
                              name="information-outline"
                              size={17}
                              onPress={() => setVisible(true)}
                              style={{ position: 'absolute',  right: 10,top:8}}
                    />
                  <BarChart
                    data={{
                      labels: Object.keys(averageRatings),
                      datasets: [{
                        data: Object.values(averageRatings).map(rating => parseFloat(rating.toFixed(1)))
                      }]
                    }}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                      labelSize: 8,
                      verticalLabelRotation: 30,
                      horizontalLabelRotation: 30,
                      xAxisInterval: 1
                    }}
                    style={styles.chart}
                    showValuesOnTopOfBars
                    yAxisLabel=""
                    yAxisSuffix=""
                    fromZero={true}
                    withHorizontalLabels={true}
                    withVerticalLabels={true} 
                  />
                </View>
              ) : (
                <Text style={styles.noDataText}>No hay datos de calificaciones disponibles</Text>
              )}
            </View>
          )}
{selectedChart === 'priceVsOccupancy' && (
  <View style={styles.chartWrapper}>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedVehicleType}
        onValueChange={(itemValue) => setSelectedVehicleType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Autos" value="auto" />
        <Picker.Item label="Camionetas" value="camioneta" />
        <Picker.Item label="Motos" value="moto" />
        <Picker.Item label="Bicicletas" value="bici" />
      </Picker>
    </View>
    
    {(() => {
      const chartData = getPriceVsOccupancyData(selectedVehicleType);
      
      if (!chartData) {
        return <Text style={styles.noDataText}>No hay suficientes datos diarios para mostrar la correlación</Text>;
      }
      
      // Función para obtener el nombre del vehículo en español
      const getVehicleName = (type) => {
        const names = {
          auto: 'Autos',
          camioneta: 'Camionetas',
          moto: 'Motos',
          bici: 'Bicicletas'
        };
        return names[type] || type;
      };
      
      // Calcular estadísticas de los datos
      const dataPoints = chartData.dataPoints;
      const totalDays = dataPoints.length;
      const avgPrice = dataPoints.reduce((sum, item) => sum + item.price, 0) / totalDays;
      const avgOccupancy = dataPoints.reduce((sum, item) => sum + item.occupancy, 0) / totalDays;
      
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.chartSubtitle}>
            Precio vs. Ocupación Diaria ({getVehicleName(selectedVehicleType)})
          </Text>
          <MaterialCommunityIcons
            name="information-outline"
            size={17}
            onPress={() => setVisible(true)}
            style={{ position: 'absolute', right: 10, top: 8 }}
          />
          
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              ...chartConfig,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(57, 76, 116, ${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier={false}
            style={styles.chart}
            fromZero
            xAxisLabel="$"
            yAxisLabel="%"
            yAxisSuffix=""
            // Añadir etiquetas a los puntos
            renderDotContent={({ x, y, index, indexData }) => {
              // Solo mostramos etiquetas para algunos puntos para evitar saturación
              if (index % Math.ceil(chartData.dates.length / 8) === 0) {
                return (
                  <View style={{ position: 'absolute', top: y - 16, left: x - 16, width: 32, height: 16 }}>
                    <Text style={{ fontSize: 8, textAlign: 'center' }}>{chartData.dates[index]}</Text>
                  </View>
                );
              }
              return null;
            }}
          />
          
          {/* Información del punto óptimo */}
          {chartData.optimalPoint && (
            <View style={styles.optimalPointInfo}>
              <Text style={styles.optimalPointText}>
                Precio óptimo estimado: ${Math.round(chartData.optimalPoint.price)} • {Math.round(chartData.optimalPoint.occupancy)}% ocupación
              </Text>
              <Text style={[styles.optimalPointText, {fontSize: 9}]}>
                Ingreso potencial: ${Math.round(chartData.optimalPoint.revenue)} por vehículo/día
              </Text>
            </View>
          )}
          
          {/* Estadísticas adicionales */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Datos analizados</Text>
              <Text style={styles.statValue}>{totalDays} días</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Precio promedio</Text>
              <Text style={styles.statValue}>${Math.round(avgPrice)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ocupación promedio</Text>
              <Text style={styles.statValue}>{Math.round(avgOccupancy)}%</Text>
            </View>
          </View>
          
          {/* Información sobre el mejor día */}
          {chartData.bestDay && (
            <View style={styles.bestDayContainer}>
              <Text style={styles.bestDayTitle}>Día más rentable:</Text>
              <Text style={styles.bestDayValue}>
                {chartData.bestDay.date} • ${Math.round(chartData.bestDay.price)} • {Math.round(chartData.bestDay.occupancy)}% ocupación
              </Text>
              <Text style={styles.bestDayRevenue}>
                Ingreso: ${Math.round(chartData.bestDay.price * chartData.bestDay.occupancy)}
              </Text>
            </View>
          )}
          
          <Text style={styles.chartHint}>
            Los puntos azules muestran datos diarios. La línea roja muestra la tendencia.
            El punto naranja indica el precio óptimo estimado para maximizar ingresos.
          </Text>
        </View>
      );
    })()}
  </View>
)}
        </Card>
        {visible && (
    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={{width:'90%', alignSelf:'center'}}> 
            <Card>
              <Card.Content>
                <Text style={{ fontSize: 18, fontWeight: "bold",alignSelf:'center' }}>Información del gráfico</Text>
                <Text style={styles.chartExplanation}>
                  {chartDescriptions[selectedChart]}
                </Text>
              </Card.Content>
              <Card.Actions style={{alignSelf:'center'}}>
                <CustomButton
                  text="Cerrar"
                  onPress={() => setVisible(false)}
                  style={{padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    width: '40%',
                    alignItems: 'center',
                    marginBottom: theme.spacing.sm}}
                  textStyle={{fontSize: theme.typography.fontSize.small,
                    fontWeight: theme.typography.fontWeight.bold}}
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
    backgroundColor: '#F5F6F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, 
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
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#394c74',
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 16,
    zIndex: 1,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chartWrapper: {
    marginTop: 8,
  },
  chartContainer: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  reviewsContainer: {
    maxHeight: 400, 
    width: '100%',

  },
  reviewsContentContainer: {
    flexGrow: 1,
    paddingBottom: 20, 
  },
  reviewCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  reviewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#394c74',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#394c74',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 8,
    textAlign: 'center',
  },
  chartHint: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888888',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  customChartContainer: {
    height: 220,
    flexDirection: 'row',
    marginTop: 20,
  },
  chartArea: {
    flex: 1,
    height: '100%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
    position: 'relative',
  },
  yAxisLabels: {
    width: 40,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: '#666666',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dataPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    marginLeft: -5,
    marginTop: -5,
  },
  pointLabel: {
    position: 'absolute',
    top: -18,
    left: -15,
    fontSize: 8,
    color: '#333333',
    width: 40,
    textAlign: 'center',
  },
  xAxisContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 5,
  },
  xAxisTitle: {
    fontSize: 12,
    color: '#666666',
  },
  xAxisLabel: {
    fontSize: 10,
    color: '#666666',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#394c74',
    textAlign: 'center',
    marginBottom: 5,
  },
  chartExplanation: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
    lineHeight: 18,
  },
  optimalPointInfo: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 5,
    borderRadius: 4,
  },
  optimalPointText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#FF5722',
  },
  chartExplanation: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#394c74',
  },
  bestDayContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 20,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  bestDayTitle: {
    fontSize: 10,
    color: '#666666',
  },
  bestDayValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bestDayRevenue: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#4CAF50',
  },
  optimalPointInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FF5722',
    marginHorizontal: 20,
  },
  optimalPointText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#FF5722',
    fontWeight: 'bold',
  },
  chartHint: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888888',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});

export default DataAnalysis;