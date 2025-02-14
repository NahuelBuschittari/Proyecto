// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, ScrollView, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
// import { BarChart, LineChart } from 'react-native-chart-kit';
// import { Picker } from '@react-native-picker/picker';
// import { Card } from '@rneui/themed';
// import { useAuth } from '../../context/AuthContext';
// import { API_URL } from '../../context/constants';

// const DataAnalysis = () => {
//   const { user, authTokens } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [priceHistory, setPriceHistory] = useState([]);
//   const [occupancyData, setOccupancyData] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [selectedChart, setSelectedChart] = useState('price');
//   const [selectedOccupancy, setSelectedOccupancy] = useState('car_occupied');
//   const [selectedPriceType, setSelectedPriceType] = useState('fraccion');
//   const [averageRatings, setAverageRatings] = useState({
//     Seguridad: 0,
//     Limpieza: 0,
//     Iluminación: 0,
//     Acces: 0,
//     Servicio: 0
//   });
//   const priceTypes = {
//     fraccion: 'Fracción',
//     hora: 'Por Hora',
//     medio_dia: 'Medio Día',
//     dia_completo: 'Día Completo'
//   };

//   const getPriceDataByType = (data, type) => {
//     return {
//       labels: data.map(item => item.fecha),
//       datasets: [
//         {
//           data: data.map(item => item[`auto_${type}`]),
//           color: () => vehicleColors.auto,
//         },
//         {
//           data: data.map(item => item[`camioneta_${type}`]),
//           color: () => vehicleColors.camioneta,
//         },
//         {
//           data: data.map(item => item[`moto_${type}`]),
//           color: () => vehicleColors.moto,
//         },
//         {
//           data: data.map(item => item[`bici_${type}`]),
//           color: () => vehicleColors.bici,
//         }
//       ],
//       legend: ['Auto', 'Camioneta', 'Moto', 'Bicicleta']
//     };
//   };

//   const screenWidth = Dimensions.get('window').width;

//   const loadAnalysisData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(`${API_URL}/parking/${user.id}/data`, {
//         headers: {
//           'Authorization': `Bearer ${authTokens.access}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Error al cargar los datos de análisis');
//       }

//       const data = await response.json();

//       if (data.price_history && Array.isArray(data.price_history)) {
//         setPriceHistory(data.price_history);
//       }

//       if (data.space_history && Array.isArray(data.space_history)) {
//         setOccupancyData(data.space_history);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       setError('No se pudieron cargar los datos de análisis');
//     }
//   };

//   const loadReviews = async () => {
//     try {
//       const response = await fetch(`${API_URL}/parking/${user.id}/reviews`, {
//         headers: {
//           'Authorization': `Bearer ${authTokens.access}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Error al cargar las reseñas');
//       }

//       const data = await response.json();
//       if (Array.isArray(data)) {
//         setReviews(data);

//         const ratings = data.reduce((acc, review) => {
//           const keys = ['Seguridad', 'Limpieza', 'Iluminación', 'Acces', 'Servicio'];
//           keys.forEach(key => {
//             if (!acc[key]) acc[key] = [];
//             if (review[key] !== undefined) {
//               acc[key].push(review[key]);
//             }
//           });
//           return acc;
//         }, {});

//         const averages = Object.entries(ratings).reduce((acc, [key, values]) => {
//           acc[key] = values.length > 0
//             ? values.reduce((sum, val) => sum + val, 0) / values.length
//             : 0;
//           return acc;
//         }, {});

//         setAverageRatings(averages);
//       }
//     } catch (error) {
//       console.error('Error loading reviews:', error);
//       setError('Error al cargar las reseñas');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAnalysisData();
//     loadReviews();
//   }, []);

//   const chartConfig = {
//     backgroundColor: '#ffffff',
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientTo: '#ffffff',
//     decimalPlaces: 2,
//     color: (opacity = 1) => `rgba(57, 76, 116, ${opacity})`,
//     labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//     style: {
//       borderRadius: 16,
//     },
//     propsForLabels: {
//       fontSize: 12,
//     },
//   };

//   const vehicleColors = {
//     auto: '#4CAF50',      // Verde
//     camioneta: '#2196F3', // Azul
//     moto: '#FFC107',      // Amarillo
//     bici: '#F44336'       // Rojo
//   };

//   const filteredReviews = reviews.filter((review) => {
//     const averageRating = (
//       (Number(review.Seguridad || 0) +
//         Number(review.Limpieza || 0) +
//         Number(review.Iluminación || 0) +
//         Number(review.Acces || 0) +
//         Number(review.Servicio || 0)) / 5
//     ).toFixed(1);
//     return averageRating > 0;
//   });

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#394c74" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView 
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={true}
//       >
//         <Card containerStyle={styles.card}>
//           <Text style={styles.cardTitle}>Análisis de Datos</Text>
          
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedChart}
//               onValueChange={(itemValue) => setSelectedChart(itemValue)}
//               style={styles.picker}
//             >
//               <Picker.Item label="Historial de Precios" value="price" />
//               <Picker.Item label="Ocupación" value="occupancy" />
//               <Picker.Item label="Calificaciones" value="ratings" />
//             </Picker>
//           </View>

//           {selectedChart === 'price' && (
//             <View style={styles.chartWrapper}>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={selectedPriceType}
//                   onValueChange={(itemValue) => setSelectedPriceType(itemValue)}
//                   style={styles.picker}
//                 >
//                   {Object.entries(priceTypes).map(([value, label]) => (
//                     <Picker.Item key={value} label={label} value={value} />
//                   ))}
//                 </Picker>
//               </View>

//               {priceHistory.length > 0 ? (
//                 <View style={styles.chartContainer}>
//                   <LineChart
//                     data={getPriceDataByType(priceHistory, selectedPriceType)}
//                     width={screenWidth - 40}
//                     height={220}
//                     chartConfig={chartConfig}
//                     bezier
//                     style={styles.chart}
//                     yAxisLabel="$"
//                     legend
//                   />
//                 </View>
//               ) : (
//                 <Text style={styles.noDataText}>No hay datos de precios disponibles</Text>
//               )}
//             </View>
//           )}

//           {selectedChart === 'occupancy' && (
//             <View style={styles.chartWrapper}>
//               <Picker
//                 selectedValue={selectedOccupancy}
//                 onValueChange={(itemValue) => setSelectedOccupancy(itemValue)}
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Ocupación de Autos" value="car_occupied" />
//                 <Picker.Item label="Ocupación de Motos" value="moto_occupied" />
//                 <Picker.Item label="Ocupación de Bicicletas" value="bike_occupied" />
//               </Picker>

//               {occupancyData.length > 0 ? (
//                 <View style={styles.chartContainer}>
//                   <LineChart
//                     data={{
//                       labels: occupancyData.map(item => item.fecha),
//                       datasets: [{
//                         data: occupancyData.map(item => item[selectedOccupancy]),
//                         color: () => '#394c74',
//                       }],
//                     }}
//                     width={screenWidth - 40}
//                     height={220}
//                     chartConfig={chartConfig}
//                     bezier
//                     style={styles.chart}
//                     yAxisLabel=" "
//                   />
//                 </View>
//               ) : (
//                 <Text style={styles.noDataText}>No hay datos de ocupación disponibles</Text>
//               )}
//             </View>
//           )}

//           {selectedChart === 'ratings' && (
//             <View style={styles.chartWrapper}>
//               {Object.keys(averageRatings).length > 0 ? (
//                 <View style={styles.chartContainer}>
//                   <BarChart
//                     data={{
//                       labels: Object.keys(averageRatings),
//                       datasets: [{
//                         data: Object.values(averageRatings).map(rating => parseFloat(rating.toFixed(1)))
//                       }]
//                     }}
//                     width={screenWidth - 40}
//                     height={220}
//                     chartConfig={{
//                       ...chartConfig,
//                       color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
//                       labelSize: 8,
//                       verticalLabelRotation: 30,
//                       horizontalLabelRotation: 30,
//                       xAxisInterval: 1
//                     }}
//                     style={styles.chart}
//                     showValuesOnTopOfBars
//                     yAxisLabel=""
//                     yAxisSuffix=""
//                     fromZero={true}
//                     withHorizontalLabels={true}
//                     withVerticalLabels={true} 
//                   />
//                 </View>
//               ) : (
//                 <Text style={styles.noDataText}>No hay datos de calificaciones disponibles</Text>
//               )}
//             </View>
//           )}
//         </Card>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F6F8',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 80, // Increased bottom padding for better scrolling
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#F44336',
//     textAlign: 'center',
//   },
//   card: {
//     borderRadius: 12,
//     marginHorizontal: 16,
//     marginVertical: 8,
//     padding: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#394c74',
//     marginBottom: 16,
//   },
//   pickerContainer: {
//     backgroundColor: '#F8F9FA',
//     borderRadius: 8,
//     marginBottom: 16,
//     zIndex: 1,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   chartWrapper: {
//     marginTop: 8,
//   },
//   chartContainer: {
//     marginTop: 16,
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     padding: 8,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   noDataText: {
//     textAlign: 'center',
//     color: '#666666',
//     fontStyle: 'italic',
//     marginVertical: 20,
//   },
//   reviewsContainer: {
//     maxHeight: 400, 
//     width: '100%',
//   },
//   reviewsContentContainer: {
//     flexGrow: 1,
//     paddingBottom: 20, // Add some extra padding at the bottom
//   },
//   reviewCard: {
//     backgroundColor: '#F8F9FA',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 12,
//     width: '100%',
//   },
//   reviewName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#394c74',
//     marginBottom: 8,
//   },
//   reviewComment: {
//     fontSize: 14,
//     color: '#666666',
//     marginBottom: 8,
//     fontStyle: 'italic',
//   },
//   reviewRating: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#394c74',
//   },
// });

// export default DataAnalysis;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const parkingData = {
  priceEvolution: [
    { week: 'Ene', price: 1000 },
    { week: 'Feb', price: 1200 },
    { week: 'Mar', price: 1500 },
    { week: 'Abr', price: 1800 },
    { week: 'May', price:  2000 },
    { week: 'Jun', price: 2800 },
    { week: 'Jul', price: 2200 },
    { week: 'Ago', price: 2900 },
    { week: 'Sep', price: 3500 },
    { week: 'Oct', price: 3700 },
    { week: 'Nov', price: 4000 },
    { week: 'Dic', price: 4200 },
  ],
  capacityUtilization: [
    { month: 'Ene', available: 30, occupied: 70 },
    { month: 'Feb', available: 25, occupied: 75 },
    { month: 'Mar', available: 20, occupied: 80 },
    { month: 'Abr', available: 15, occupied: 85 },
    { month: 'May', available: 10, occupied: 90 },
    { month: 'Jun', available: 5, occupied: 95 },
    { month: 'Jul', available: 0, occupied: 100 },
    { month: 'Ago', available: 10, occupied: 90 },
    { month: 'Sep', available: 30, occupied: 70 },
    { month: 'Oct', available: 20, occupied: 80 },
    { month: 'Nov', available: 15, occupied: 85 },
    { month: 'Dic', available: 10, occupied: 90 },
  ],
  hourlyDemand: [
    { hour: '00:00', vehicles: 10 },
    { hour: '06:00', vehicles: 30 },
    { hour: '12:00', vehicles: 80 },
    { hour: '18:00', vehicles: 120 },
    { hour: '23:59', vehicles: 40 },
  ],
  vehicleTypeOccupancy: [
    { type: 'Auto/Camioneta', percentage: 70, color: theme.colors.primary },
    { type: 'Moto', percentage: 20, color: theme.colors.secondary },
    { type: 'Bicicleta', percentage: 10, color: '#8bc34a' },
  ],
};

const DataAnalysis = () => {
  const [selectedChart, setSelectedChart] = useState('price');
  const screenWidth = Dimensions.get('window').width - 20;
  const screenHeight = Math.min(Dimensions.get('window').height * 0.45, 300);

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

  const renderChart = () => {
    switch (selectedChart) {
      case 'price':
        return (
          <LineChart
            data={{
              labels: parkingData.priceEvolution.map((p) => p.week),
              datasets: [
                {
                  data: parkingData.priceEvolution.map((p) => p.price),
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
      {/* Leyenda encima del gráfico */}
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

      {/* Gráfico de barras apiladas */}
      <StackedBarChart
        data={{
          labels: parkingData.capacityUtilization.map((c) => c.month),
          legend: [], // Eliminamos la leyenda interna del gráfico
          data: parkingData.capacityUtilization.map((c) => [
            c.available,  // Datos de "Disponible"
            c.occupied,   // Datos de "Ocupado"
          ]),
          barColors: [theme.colors.secondary, theme.colors.primary], // Colores de las barras
        }}
        width={screenWidth}
        height={screenHeight}
        chartConfig={{
          ...chartConfig,
          legendPosition: 'bottom', // Leyenda en la parte inferior
          barPercentage: 0.5, // Barras más delgadas
          decimalPlaces: 0, // Redondear valores
        }}
        hideLegend={true}  // Ocultamos la leyenda interna
        fromZero
      />
    </View>
  );


          
      case 'hourly':
        return (
          <LineChart
            data={{
              labels: parkingData.hourlyDemand.map((h) => h.hour),
              datasets: [
                {
                  data: parkingData.hourlyDemand.map((h) => h.vehicles),
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
            data={parkingData.vehicleTypeOccupancy.map((v) => ({
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
              alignItems: 'center', // Centrado horizontal y vertical
            },
          ]}
        >
          <Text
            style={[
              styles.navigationButtonText,
              {
                color:
                  selectedChart === option.key
                    ? 'white'
                    : theme.colors.text,
                textAlign: 'center', // Asegura que el texto esté centrado
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