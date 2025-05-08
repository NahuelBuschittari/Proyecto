import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { Divider, Title, Button } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../styles/theme';

const PriceHistoryChart = ({ priceHistory, onInfoPress }) => {
  const [selectedTimeType, setSelectedTimeType] = useState('fraccion');
  const vehicleTypes = ['auto', 'camioneta', 'moto', 'bici'];
  const colorMap = {
    auto: '#297BF6',      // azul
    camioneta: '#50C878', // verde
    moto: '#FFD700',      // dorado
    bici: '#FF6B6B',      // rojo
  };
  
  // Estado para las fechas
  const [earliestDateAvailable, setEarliestDateAvailable] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  
  // Estados para controlar la visibilidad de los date pickers en Android
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  // Función para determinar la fecha más antigua disponible
  useEffect(() => {
    let earliestDate = null;
    
    vehicleTypes.forEach(vehicle => {
      Object.keys(priceHistory || {}).forEach(key => {
        if (key.startsWith(vehicle)) {
          const priceData = priceHistory[key] || [];
          if (priceData.length > 0) {
            const firstDate = new Date(priceData[0].fecha);
            if (earliestDate === null || firstDate < earliestDate) {
              earliestDate = firstDate;
            }
          }
        }
      });
    });
    
    if (earliestDate) {
      setEarliestDateAvailable(earliestDate);
      setStartDate(earliestDate);
    }
  }, [priceHistory]);

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
  
  // Función para formatear fecha completa para mostrar en UI
  const formatFullDate = (date) => {
    if (!date) return '';
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  // Manejadores para cambios de fecha
  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Asegurarse de que la fecha no sea menor que la fecha más antigua disponible
      const validStartDate = earliestDateAvailable && selectedDate < earliestDateAvailable ? 
        earliestDateAvailable : selectedDate;
        
      // Asegurarse de que la fecha no sea mayor que la fecha final
      const adjustedDate = validStartDate > endDate ? endDate : validStartDate;
      setStartDate(adjustedDate);
    }
  };
  
  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Asegurarse de que la fecha no sea mayor que hoy
      const today = new Date();
      const validEndDate = selectedDate > today ? today : selectedDate;
      
      // Asegurarse de que la fecha no sea menor que la fecha inicial
      const adjustedDate = validEndDate < startDate ? startDate : validEndDate;
      setEndDate(adjustedDate);
    }
  };

  // Función para obtener fechas rellenas para cada vehículo y tipo de tiempo
  const processDataForChart = () => {
    if (!startDate || !endDate) {
      return { datasets: [], labels: [], priceChanges: {} };
    }
    
    const datasets = [];
    const priceChanges = {};
    
    // Mapeo para rastrear cambios de precio por fecha
    const allPriceChanges = new Set();

    // Generar fechas diarias para el rango seleccionado
    const dailyDates = generateDailyDates(startDate, endDate);
    
    // Encontrar cambios de precio en el rango seleccionado
    vehicleTypes.forEach(vehicle => {
      const dataKey = `${vehicle}_${selectedTimeType}`;
      const priceData = priceHistory[dataKey] || [];
      
      if (priceData.length > 0) {
        // Filtrar los cambios de precio dentro del rango seleccionado
        const relevantPriceChanges = priceData.filter(item => {
          const changeDate = new Date(item.fecha);
          return changeDate >= startDate && changeDate <= endDate;
        });
        
        // Guardar cambios de precio para la sección inferior
        priceChanges[vehicle] = relevantPriceChanges.map(item => ({
          fecha: item.fecha,
          precio: item.precio
        }));
        
        // Registrar todas las fechas de cambio de precio
        relevantPriceChanges.forEach(item => {
          const dateStr = new Date(item.fecha).toISOString().split('T')[0];
          allPriceChanges.add(dateStr);
        });
      }
    });

    // Si no hay datos, retornar
    if (dailyDates.length === 0) {
      return { datasets: [], labels: [], priceChanges: {} };
    }

    // Asegurar que la fecha más reciente (límite superior) también se muestre
    allPriceChanges.add(endDate.toISOString().split('T')[0]);
    
    // Generar etiquetas
    const labels = dailyDates.map((date) => {
      return date.getDate() === 1 ? formatMonthLabel(date) : '';
    });

    // Para cada tipo de vehículo, generar la serie de datos y puntos destacados
    vehicleTypes.forEach(vehicle => {
      const dataKey = `${vehicle}_${selectedTimeType}`;
      const allPriceData = priceHistory[dataKey] || [];
      
      if (allPriceData.length === 0) return;

      const chartData = [];
      
      // Encontrar el precio inicial para la fecha de inicio
      // (el precio válido justo antes o en la fecha de inicio)
      let initialPrice = null;
      for (let i = allPriceData.length - 1; i >= 0; i--) {
        const priceDate = new Date(allPriceData[i].fecha);
        if (priceDate <= startDate) {
          initialPrice = allPriceData[i].precio;
          break;
        }
      }
      
      // Si no se encontró un precio inicial, usar el primer precio disponible
      if (initialPrice === null && allPriceData.length > 0) {
        initialPrice = allPriceData[0].precio;
      }
      
      let currentPrice = initialPrice;
      
      // Para cada día en nuestro rango
      dailyDates.forEach((date) => {
        // Buscar si hay un cambio de precio que aplique para este día
        for (let i = 0; i < allPriceData.length; i++) {
          const priceDate = new Date(allPriceData[i].fecha);
          if (priceDate <= date && priceDate >= startDate) {
            currentPrice = allPriceData[i].precio;
          }
        }
        
        chartData.push(currentPrice);
      });
      
      datasets.push({
        data: chartData,
        color: () => colorMap[vehicle],
        label: vehicle,
        withDots: false
      });
    });

    return { datasets, labels, priceChanges, dailyDates};
  };

  const { datasets, labels, priceChanges, dailyDates} = processDataForChart();

  // Calcular el ancho total requerido
  const screenWidth = Dimensions.get('window').width;
  const daysToShow = labels?.length || 0;
  const dataPointWidth = 2; // Ancho por punto de datos
  const calculatedWidth = Math.max(screenWidth, (daysToShow * dataPointWidth));

  // Encontrar el valor máximo para el eje Y
  const maxValue = datasets.length > 0 
    ? Math.max(...datasets.flatMap(dataset => dataset.data))
    : 100;
  
  // Calcular los segmentos del eje Y para asegurar divisiones precisas
  const yAxisSegments = 10;
  const yAxisMax = Math.ceil(maxValue / 100) * 100; // Redondear al siguiente cien
  
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
      
      <View style={styles.dateRangeContainer}>
        <View style={styles.datePickerWrapper}>
          <Text style={styles.datePickerLabel}>Desde:</Text>
          {Platform.OS === 'ios' ? (
            <DateTimePicker 
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={onStartDateChange}
              minimumDate={earliestDateAvailable}
              maximumDate={endDate}
              style={styles.datePicker}
            />
          ) : (
            <>
              <Button 
                mode="outlined" 
                onPress={() => setShowStartPicker(true)}
                style={styles.dateButton}
              >
                {startDate ? formatFullDate(startDate) : 'Seleccionar'}
              </Button>
              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                  minimumDate={earliestDateAvailable}
                  maximumDate={endDate}
                />
              )}
            </>
          )}
        </View>
        
        <View style={styles.datePickerWrapper}>
          <Text style={styles.datePickerLabel}>Hasta:</Text>
          {Platform.OS === 'ios' ? (
            <DateTimePicker 
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
              minimumDate={startDate}
              maximumDate={new Date()}
              style={styles.datePicker}
            />
          ) : (
            <>
              <Button 
                mode="outlined" 
                onPress={() => setShowEndPicker(true)}
                style={styles.dateButton}
              >
                {formatFullDate(endDate)}
              </Button>
              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                  minimumDate={startDate}
                  maximumDate={new Date()}
                />
              )}
            </>
          )}
        </View>
      </View>
      <View>
        <Divider style={styles.divider} />
      <MaterialCommunityIcons
                  name="information-outline"
                  size={17}
                  onPress={onInfoPress}
                  style={{ position: 'absolute', right: 1, top: 55,color:theme.colors.primary }}
      />
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
          <View style={{ paddingRight: 20 }}>
            <LineChart
              data={{
                labels,
                datasets,
              }}
              width={calculatedWidth}
              height={340}
              yAxisLabel="$"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: 'white',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                },
                propsForVerticalLabels: {
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                propsForHorizontalLabels: {
                  fontSize: 12,
                  fontWeight: 'bold',
                },
                formatXLabel: (label) => {
                  if (!label) return '';
                  return label;
                },
                formatYLabel: (value) => `${value}`,
                yAxisLabelWidth: 40,
              }}
              bezier
              style={styles.chart}
              fromZero={true}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withShadow={false}
              segments={yAxisSegments}
              yLabelsOffset={10}
              renderDotContent={({ x, y, index }) => {
                const date = dailyDates[index];
                const isFirstDayOfMonth = date.getDate() === 1;
                
                // Solo renderizar puntos en fechas con cambios de precio o primer día del mes
                if (isFirstDayOfMonth ) {
                  return (
                    <Svg>
                      <Circle
                        key={`dot-${index}`}
                        cx={x}
                        cy={y}
                        r={4}
                        fill="#000"
                      />
                    </Svg>
                  );
                }
                return null; // No renderizar nada en fechas que no son especiales
              }}
            />

          </View>
        ) : (
          <Text style={styles.noDataText}>No hay datos disponibles para este período</Text>
        )}
      </ScrollView>
    <View>
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
                priceDiff = parseFloat((change.precio - changes[index - 1].precio).toFixed(2));
                console.log("priceDiff",priceDiff)
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
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    
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
    fontSize: 12,
    
  },
  picker: {
    flex: 2,
    height: 60,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  datePickerWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  datePickerLabel: {
    fontSize: 8,
    marginRight: 5,
  },
  datePicker: {
    flex: 1,
  },
  dateButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    borderColor: theme.colors.primary,
    
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
    fontSize: 16,
    fontWeight:theme.typography.fontWeight.regular
  },
  chartContainer: {
    marginVertical: 10,
    minHeight: 300,
  },
  chart: {
    borderRadius: 16,
    paddingRight: 60, // Aumentar el padding para las etiquetas del eje Y
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
    fontWeight: theme.typography.fontWeight.bold,
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
    fontSize: 12,
  },
  priceValues: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 12,
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
});

export default PriceHistoryChart;