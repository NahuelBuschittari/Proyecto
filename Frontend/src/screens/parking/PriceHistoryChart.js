// import React, { useState, useEffect } from 'react';
// import { View, Dimensions, Text, StyleSheet, ScrollView } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import { Picker } from '@react-native-picker/picker';
// import { Button, Card, Title, Divider } from 'react-native-paper';

// const PriceHistoryChart = ({ priceHistory, onInfoPress }) => {
//   const [selectedTimeType, setSelectedTimeType] = useState('fraccion');
//   const timeTypeOptions = ['fraccion', 'hora', 'medio_dia', 'dia_completo'];
//   const vehicleTypes = ['auto', 'camioneta', 'moto', 'bici'];
//   const colorMap = {
//     auto: '#297BF6',      // azul
//     camioneta: '#50C878', // verde
//     moto: '#FFD700',      // dorado
//     bici: '#FF6B6B',      // rojo
//   };
  
//   // Función para generar fechas diarias en un rango
//   const generateDailyDates = (startDate, endDate) => {
//     const dates = [];
//     const currentDate = new Date(startDate);
//     const lastDate = new Date(endDate);
    
//     while (currentDate <= lastDate) {
//       dates.push(new Date(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     return dates;
//   };

//   // Función para formatear fecha para etiqueta
//   const formatDateLabel = (date) => {
//     return `${date.getDate()}/${date.getMonth() + 1}`;
//   };

//   // Función para formatear fecha para cambio de mes
//   const formatMonthLabel = (date) => {
//     return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
//   };

//   // Función para obtener fechas rellenas para cada vehículo y tipo de tiempo
//   const processDataForChart = () => {
//     const datasets = [];
//     const priceChanges = {};
//     let earliestDate = null;
//     let latestDate = new Date(); // Fecha actual
    
//     // Mapeo para rastrear cambios de precio por fecha
//     const allPriceChanges = new Set();

//     // Encontrar la fecha más antigua en todos los datos
//     vehicleTypes.forEach(vehicle => {
//       const dataKey = `${vehicle}_${selectedTimeType}`;
//       const priceData = priceHistory[dataKey] || [];
      
//       if (priceData.length > 0) {
//         const firstDate = new Date(priceData[0].fecha);
//         if (earliestDate === null || firstDate < earliestDate) {
//           earliestDate = firstDate;
//         }
        
//         // Guardar cambios de precio para la sección inferior
//         priceChanges[vehicle] = priceData.map(item => ({
//           fecha: item.fecha,
//           precio: item.precio
//         }));
        
//         // Registrar todas las fechas de cambio de precio
//         priceData.forEach(item => {
//           const dateStr = new Date(item.fecha).toISOString().split('T')[0];
//           allPriceChanges.add(dateStr);
//         });
//       }
//     });

//     // Si no hay datos, retornar
//     if (earliestDate === null) {
//       return { datasets: [], labels: [], priceChanges: {} };
//     }

//     // Generar fechas diarias desde la primera fecha hasta hoy
//     const dailyDates = generateDailyDates(earliestDate, latestDate);
    
//     // Mapeo para identificar fechas especiales (cambios de precio o primer día del mes)
//     const specialDates = new Map();
    
//     dailyDates.forEach((date, index) => {
//       const dateStr = date.toISOString().split('T')[0];
//       const isFirstDayOfMonth = date.getDate() === 1;
//       const hasPriceChange = allPriceChanges.has(dateStr);
      
//       if (isFirstDayOfMonth || hasPriceChange) {
//         specialDates.set(index, {
//           isFirstDayOfMonth,
//           hasPriceChange,
//           date
//         });
//       }
//     });
    
//     // Generar etiquetas
//     const labels = dailyDates.map((date, index) => {
//       const specialDate = specialDates.get(index);
      
//       if (specialDate) {
//         if (specialDate.isFirstDayOfMonth) {
//           return formatMonthLabel(date);
//         }
//         if (specialDate.hasPriceChange) {
//           return formatDateLabel(date);
//         }
//       }
      
//       return '';
//     });

//     // Para cada tipo de vehículo, generar la serie de datos y puntos destacados
//     vehicleTypes.forEach(vehicle => {
//       const dataKey = `${vehicle}_${selectedTimeType}`;
//       const priceData = priceHistory[dataKey] || [];
      
//       if (priceData.length === 0) return;

//       const chartData = [];
//       let currentPriceIndex = 0;
//       let currentPrice = priceData[0].precio;
      
//       // Para cada día en nuestro rango
//       dailyDates.forEach((date, dateIndex) => {
//         // Buscar si hay un cambio de precio que aplique para este día
//         while (
//           currentPriceIndex < priceData.length - 1 && 
//           new Date(priceData[currentPriceIndex + 1].fecha) <= date
//         ) {
//           currentPriceIndex++;
//           currentPrice = priceData[currentPriceIndex].precio;
//         }
        
//         chartData.push(currentPrice);
//       });
      
//       datasets.push({
//         data: chartData,
//         color: () => colorMap[vehicle],
//         label: vehicle,
//         // Configurar puntos especiales
//         withDots: false,
//         // Personalizar puntos para mostrarlos solo en fechas especiales
//         customDataPoints: dailyDates.map((date, index) => {
//           const dateStr = date.toISOString().split('T')[0];
//           const vehiclePriceChanges = priceChanges[vehicle] || [];
//           const hasPriceChangeForVehicle = vehiclePriceChanges.some(change => 
//             new Date(change.fecha).toISOString().split('T')[0] === dateStr
//           );
          
//           // Mostrar punto en cambios de precio específicos para este vehículo
//           return hasPriceChangeForVehicle;
//         })
//       });
//     });

//     return { datasets, labels, priceChanges, dailyDates, specialDates };
//   };

//   const { datasets, labels, priceChanges, dailyDates, specialDates } = processDataForChart();

//   // Calcular el ancho de la gráfica basado en el número de puntos de datos
//   const screenWidth = Dimensions.get('window').width - 20;
  
//   // Definir un ancho mínimo para el gráfico, considerando el espacio para las etiquetas
//   // Asignar más espacio horizontal para cada punto de datos
//   const pointWidth = 20; // Anchura necesaria para cada punto
//   const calculatedWidth = Math.max(screenWidth, (labels.length * pointWidth));
  
//   // Asegurar que haya suficiente espacio para el yAxisLabelWidth
//   const yAxisLabelWidth = 60; // Espacio para etiquetas del eje Y

//   return (
//     <ScrollView style={styles.container}>
//           <View style={styles.pickerContainer}>
//             <Text style={styles.pickerLabel}>Tipo de Período:</Text>
//             <Picker
//               selectedValue={selectedTimeType}
//               style={styles.picker}
//               onValueChange={(itemValue) => setSelectedTimeType(itemValue)}
//             >
//               <Picker.Item label="Fracción" value="fraccion" />
//               <Picker.Item label="Hora" value="hora" />
//               <Picker.Item label="Medio Día" value="medio_dia" />
//               <Picker.Item label="Día Completo" value="dia_completo" />
//             </Picker>
//           </View>
          
//           <View style={styles.legendContainer}>
//             {vehicleTypes.map(vehicle => (
//               <View key={vehicle} style={styles.legendItem}>
//                 <View style={[styles.legendColor, { backgroundColor: colorMap[vehicle] }]} />
//                 <Text style={styles.legendText}>
//                   {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
//                 </Text>
//               </View>
//             ))}
//           </View>
          
//           <ScrollView horizontal={true} style={styles.chartContainer}>
//             {datasets.length > 0 ? (
//               <LineChart
//                 data={{
//                   labels,
//                   datasets
//                 }}
//                 width={calculatedWidth + yAxisLabelWidth} // Agregar espacio para etiquetas del eje Y
//                 height={280} // Aumentar altura para mejor visualización
//                 yAxisLabel="$"
//                 yAxisSuffix=""
//                 yAxisInterval={1} // Intervalos de 1 para mostrar todos los valores
//                 chartConfig={{
//                   backgroundColor: '#f0f0f0',
//                   backgroundGradientFrom: '#ffffff',
//                   backgroundGradientTo: '#f8f8f8',
//                   decimalPlaces: 0,
//                   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                   style: { borderRadius: 16 },
//                   propsForDots: {
//                     r: '6',
//                     strokeWidth: '2',
//                   },
//                   // Asegurar suficiente espacio para las etiquetas del eje Y
//                   yAxisLabelWidth: yAxisLabelWidth,
//                   // Formatear las etiquetas para resaltar los cambios de mes
//                   formatXLabel: (label, index) => {
//                     if (!label) return '';
                    
//                     const specialDate = specialDates.get(index);
//                     if (!specialDate) return '';
                    
//                     if (specialDate.isFirstDayOfMonth) {
//                       // Mostrar mes/año en negrita
//                       return label;
//                     }
                    
//                     // Mostrar solo día para cambios de precio
//                     if (specialDate.hasPriceChange) {
//                       return specialDate.date.getDate().toString();
//                     }
                    
//                     return '';
//                   },
//                   // Dar suficiente espacio para que sean visibles todas las etiquetas verticales
//                   propsForVerticalLabels: {
//                     fontSize: 12,
//                     rotation: 0,
//                   },
//                   propsForHorizontalLabels: {
//                     fontSize: 11,
//                   }
//                 }}
//                 bezier
//                 style={styles.chart}
//                 // Asegurar que se muestren todas las etiquetas Y
//                 fromZero={true}
//                 withInnerLines={true}
//                 withOuterLines={true}
//                 withVerticalLines={true}
//                 withHorizontalLines={true}
//                 // Mostrar puntos solo donde se indique
//                 renderDotContent={({ x, y, index, indexData }) => {
//                   const specialDate = specialDates.get(index);
//                   if (!specialDate || (!specialDate.isFirstDayOfMonth && !specialDate.hasPriceChange)) {
//                     return null;
//                   }
                  
//                   return (
//                     <View
//                       key={index}
//                       style={[
//                         styles.dotPoint,
//                         {
//                           left: x - 4,
//                           top: y - 4,
//                           backgroundColor: specialDate.isFirstDayOfMonth ? '#000' : '#666'
//                         }
//                       ]}
//                     />
//                   );
//                 }}
//               />
//             ) : (
//               <Text style={styles.noDataText}>No hay datos disponibles para este período</Text>
//             )}
//           </ScrollView>
          
//           <Divider style={styles.divider} />
          
//           <Title style={styles.title}>Cambios de Precio</Title>
          
//           {vehicleTypes.map(vehicle => {
//             const changes = priceChanges[vehicle] || [];
//             if (changes.length === 0) return null;
            
//             return (
//               <View key={vehicle} style={styles.priceChangesContainer}>
//                 <View style={styles.vehicleHeader}>
//                   <View style={[styles.legendColor, { backgroundColor: colorMap[vehicle] }]} />
//                   <Text style={styles.vehicleName}>
//                     {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
//                   </Text>
//                 </View>
                
//                 {changes.map((change, index) => {
//                   const date = new Date(change.fecha);
//                   const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  
//                   // Calcular la diferencia con el precio anterior
//                   let priceDiff = null;
//                   if (index > 0) {
//                     priceDiff = change.precio - changes[index - 1].precio;
//                   }
                  
//                   return (
//                     <View key={index} style={styles.priceChange}>
//                       <Text style={styles.priceChangeDate}>{formattedDate}</Text>
//                       <View style={styles.priceValues}>
//                         <Text style={styles.priceAmount}>${change.precio}</Text>
//                         {priceDiff !== null && (
//                           <Text style={[
//                             styles.priceDiff,
//                             priceDiff > 0 ? styles.priceIncrease : priceDiff < 0 ? styles.priceDecrease : null
//                           ]}>
//                             {priceDiff > 0 ? '+' : ''}{priceDiff}
//                           </Text>
//                         )}
//                       </View>
//                     </View>
//                   );
//                 })}
//               </View>
//             );
//           })}
          
//           {Object.keys(priceChanges).length === 0 && (
//             <Text style={styles.noDataText}>No hay cambios de precio registrados</Text>
//           )} 
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   card: {
//     margin: 10,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   pickerLabel: {
//     flex: 1,
//     fontSize: 16,
//   },
//   picker: {
//     flex: 2,
//     height: 80,
//   },
//   legendContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//     flexWrap: 'wrap',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//     marginBottom: 5,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 5,
//   },
//   legendText: {
//     fontSize: 12,
//   },
//   chartContainer: {
//     marginVertical: 10,
//     // Asegurar que el contenedor tenga suficiente altura
//     minHeight: 280,
//   },
//   chart: {
//     borderRadius: 16,
//     paddingRight: 15,
//     // Asegurar margen a la derecha para el último valor
//     marginRight: 5,
//     // Asegurar que el gráfico no se corte
//   },
//   divider: {
//     marginVertical: 15,
//   },
//   priceChangesContainer: {
//     marginBottom: 15,
//   },
//   vehicleHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   vehicleName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   priceChange: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   priceChangeDate: {
//     fontSize: 14,
//   },
//   priceValues: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   priceAmount: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginRight: 5,
//   },
//   priceDiff: {
//     fontSize: 12,
//   },
//   priceIncrease: {
//     color: 'green',
//   },
//   priceDecrease: {
//     color: 'red',
//   },
//   noDataText: {
//     textAlign: 'center',
//     marginVertical: 15,
//     fontStyle: 'italic',
//     color: '#777',
//   },
//   dotPoint: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     position: 'absolute',
//   },
// });

// export default PriceHistoryChart;

import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { Button, Card, Title, Divider } from 'react-native-paper';

const PriceHistoryChart = ({ priceHistory, onInfoPress }) => {
  const [selectedTimeType, setSelectedTimeType] = useState('fraccion');
  const timeTypeOptions = ['fraccion', 'hora', 'medio_dia', 'dia_completo'];
  const vehicleTypes = ['auto', 'camioneta', 'moto', 'bici'];
  const colorMap = {
    auto: '#297BF6',      // azul
    camioneta: '#50C878', // verde
    moto: '#FFD700',      // dorado
    bici: '#FF6B6B',      // rojo
  };

  // Función para generar fechas diarias en un rango
  const generateDailyDates = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Función para formatear fecha para etiqueta
  const formatDateLabel = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Función para formatear fecha para cambio de mes
  const formatMonthLabel = (date) => {
    return `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
  };

  // Función para obtener fechas rellenas para cada vehículo y tipo de tiempo
  const processDataForChart = () => {
    const datasets = [];
    const priceChanges = {};
    let earliestDate = null;
    let latestDate = new Date(); // Fecha actual
    
    // Mapeo para rastrear cambios de precio por fecha
    const allPriceChanges = new Set();

    // Encontrar la fecha más antigua en todos los datos
    vehicleTypes.forEach(vehicle => {
      const dataKey = `${vehicle}_${selectedTimeType}`;
      const priceData = priceHistory[dataKey] || [];
      
      if (priceData.length > 0) {
        const firstDate = new Date(priceData[0].fecha);
        if (earliestDate === null || firstDate < earliestDate) {
          earliestDate = firstDate;
        }
        
        // Guardar cambios de precio para la sección inferior
        priceChanges[vehicle] = priceData.map(item => ({
          fecha: item.fecha,
          precio: item.precio
        }));
        
        // Registrar todas las fechas de cambio de precio
        priceData.forEach(item => {
          const dateStr = new Date(item.fecha).toISOString().split('T')[0];
          allPriceChanges.add(dateStr);
        });
      }
    });

    // Si no hay datos, retornar
    if (earliestDate === null) {
      return { datasets: [], labels: [], priceChanges: {} };
    }

    // Generar fechas diarias desde la primera fecha hasta hoy
    const dailyDates = generateDailyDates(earliestDate, latestDate);
    
    // Mapeo para identificar fechas especiales (cambios de precio o primer día del mes)
    const specialDates = new Map();
    
    dailyDates.forEach((date, index) => {
      const dateStr = date.toISOString().split('T')[0];
      const isFirstDayOfMonth = date.getDate() === 1;
      const hasPriceChange = allPriceChanges.has(dateStr);
      
      if (isFirstDayOfMonth || hasPriceChange) {
        specialDates.set(index, {
          isFirstDayOfMonth,
          hasPriceChange,
          date
        });
      }
    });
    
    // Generar etiquetas
    const labels = dailyDates.map((date, index) => {
      const specialDate = specialDates.get(index);
      
      if (specialDate) {
        if (specialDate.isFirstDayOfMonth) {
          return formatMonthLabel(date);
        }
        if (specialDate.hasPriceChange) {
          return formatDateLabel(date);
        }
      }
      
      return '';
    });

    // Para cada tipo de vehículo, generar la serie de datos y puntos destacados
    vehicleTypes.forEach(vehicle => {
      const dataKey = `${vehicle}_${selectedTimeType}`;
      const priceData = priceHistory[dataKey] || [];
      
      if (priceData.length === 0) return;

      const chartData = [];
      let currentPriceIndex = 0;
      let currentPrice = priceData[0].precio;
      
      // Para cada día en nuestro rango
      dailyDates.forEach((date, dateIndex) => {
        // Buscar si hay un cambio de precio que aplique para este día
        while (
          currentPriceIndex < priceData.length - 1 && 
          new Date(priceData[currentPriceIndex + 1].fecha) <= date
        ) {
          currentPriceIndex++;
          currentPrice = priceData[currentPriceIndex].precio;
        }
        
        chartData.push(currentPrice);
      });
      
      datasets.push({
        data: chartData,
        color: () => colorMap[vehicle],
        label: vehicle,
        // Configurar puntos especiales
        withDots: false,
        // Personalizar puntos para mostrarlos solo en fechas especiales
        customDataPoints: dailyDates.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const vehiclePriceChanges = priceChanges[vehicle] || [];
          const hasPriceChangeForVehicle = vehiclePriceChanges.some(change => 
            new Date(change.fecha).toISOString().split('T')[0] === dateStr
          );
          
          // Mostrar punto en cambios de precio específicos para este vehículo
          return hasPriceChangeForVehicle;
        })
      });
    });

    return { datasets, labels, priceChanges, dailyDates, specialDates };
  };

  const { datasets, labels, priceChanges, dailyDates, specialDates } = processDataForChart();

  // Calcular ancho y espacio para etiquetas del eje Y
  const screenWidth = Dimensions.get('window').width ;
  
  // 1. Modifica estos valores para ajustar el espacio para etiquetas
  const rightExtraSpace = 0; // Espacio adicional a la derecha
  
  // 2. Calculamos cuántos elementos queremos mostrar en la gráfica
  const daysToShow = labels.length;
  
  // 3. Calcular el ancho total requerido
  const dataPointWidth = 12; // Ancho por punto de datos - ajusta según necesidad
  const calculatedWidth = Math.max(screenWidth, (daysToShow * dataPointWidth) + rightExtraSpace);
  
  // 4. Ancho total incluyendo etiquetas
  const totalWidth = calculatedWidth;

  return (
    <ScrollView style={styles.container}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Tipo de Período:</Text>
            <Picker
              selectedValue={selectedTimeType}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTimeType(itemValue)}
            >
              <Picker.Item label="Fracción" value="fraccion" />
              <Picker.Item label="Hora" value="hora" />
              <Picker.Item label="Medio Día" value="medio_dia" />
              <Picker.Item label="Día Completo" value="dia_completo" />
            </Picker>
          </View>
          
          <View style={styles.legendContainer}>
            {vehicleTypes.map(vehicle => (
              <View key={vehicle} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: colorMap[vehicle] }]} />
                <Text style={styles.legendText}>
                  {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                </Text>
              </View>
            ))}
          </View>
          
          <ScrollView horizontal={true} style={styles.chartContainer}>
            {datasets.length > 0 ? (
              <View style={{ paddingRight: rightExtraSpace }}>
                <LineChart
                  data={{
                    labels,
                    datasets
                  }}
                  width={totalWidth}
                  height={300} // Aumentar altura para mejor visualización
                  yAxisLabel="$"
                  yAxisSuffix=""
                  chartConfig={{
                    backgroundColor: '#f0f0f0',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#f8f8f8',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                    },
                    // 5. Configuración crítica para las etiquetas del eje Y
                    // Personalización para etiquetas más visibles
                    propsForVerticalLabels: {
                      fontSize: 13,
                      fontWeight: 'bold',
                    },
                    propsForHorizontalLabels: {
                      fontSize: 11,
                    },
                    // 6. Formatear las etiquetas para resaltar los cambios de mes
                    formatXLabel: (label, index) => {
                      if (!label) return '';
                      
                      const specialDate = specialDates.get(index);
                      if (!specialDate) return '';
                      
                      if (specialDate.isFirstDayOfMonth) {
                        // Mostrar mes/año en negrita
                        return label;
                      }
                      
                      // Mostrar solo día para cambios de precio
                      if (specialDate.hasPriceChange) {
                        return specialDate.date.getDate().toString();
                      }
                      
                      return '';
                    },
                  }}
                  bezier
                  style={styles.chart}
                  // 7. Forzar visualización de etiquetas
                  fromZero={true}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                  withShadow={false}
                  // Reducir número de segmentos para etiquetas más claras
                  segments={5}
                  // Mostrar puntos solo donde se indique
                  renderDotContent={({ x, y, index, indexData }) => {
                    const specialDate = specialDates.get(index);
                    if (!specialDate || (!specialDate.isFirstDayOfMonth && !specialDate.hasPriceChange)) {
                      return null;
                    }
                    
                    return (
                      <View
                        key={index}
                        style={[
                          styles.dotPoint,
                          {
                            left: x - 4,
                            top: y - 4,
                            backgroundColor: specialDate.isFirstDayOfMonth ? '#000' : '#666'
                          }
                        ]}
                      />
                    );
                  }}
                />
              </View>
            ) : (
              <Text style={styles.noDataText}>No hay datos disponibles para este período</Text>
            )}
          </ScrollView>
          
          <Divider style={styles.divider} />
          
          <Title style={styles.title}>Cambios de Precio</Title>
          
          {vehicleTypes.map(vehicle => {
            const changes = priceChanges[vehicle] || [];
            if (changes.length === 0) return null;
            
            return (
              <View key={vehicle} style={styles.priceChangesContainer}>
                <View style={styles.vehicleHeader}>
                  <View style={[styles.legendColor, { backgroundColor: colorMap[vehicle] }]} />
                  <Text style={styles.vehicleName}>
                    {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                  </Text>
                </View>
                
                {changes.map((change, index) => {
                  const date = new Date(change.fecha);
                  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                  
                  // Calcular la diferencia con el precio anterior
                  let priceDiff = null;
                  if (index > 0) {
                    priceDiff = change.precio - changes[index - 1].precio;
                  }
                  
                  return (
                    <View key={index} style={styles.priceChange}>
                      <Text style={styles.priceChangeDate}>{formattedDate}</Text>
                      <View style={styles.priceValues}>
                        <Text style={styles.priceAmount}>${change.precio}</Text>
                        {priceDiff !== null && (
                          <Text style={[
                            styles.priceDiff,
                            priceDiff > 0 ? styles.priceIncrease : priceDiff < 0 ? styles.priceDecrease : null
                          ]}>
                            {priceDiff > 0 ? '+' : ''}{priceDiff}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
          
          {Object.keys(priceChanges).length === 0 && (
            <Text style={styles.noDataText}>No hay cambios de precio registrados</Text>
          )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerLabel: {
    flex: 1,
    fontSize: 16,
  },
  picker: {
    flex: 2,
    height: 60,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  chartContainer: {
    marginVertical: 10,
    // Asegurar que el contenedor tenga suficiente altura
    minHeight: 300,
  },
  chart: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingRight: 20,
  },
  divider: {
    marginVertical: 15,
  },
  priceChangesContainer: {
    marginBottom: 15,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  priceChange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  priceChangeDate: {
    fontSize: 14,
  },
  priceValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  priceDiff: {
    fontSize: 12,
  },
  priceIncrease: {
    color: 'green',
  },
  priceDecrease: {
    color: 'red',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 15,
    fontStyle: 'italic',
    color: '#777',
  },
  dotPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
});

export default PriceHistoryChart;