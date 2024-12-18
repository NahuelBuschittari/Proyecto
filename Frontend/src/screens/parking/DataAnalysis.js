import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, PieChart, StackedBarChart } from 'react-native-chart-kit';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const parkingData = {
  priceEvolution: [
    { week: 'Ene', price: 10 },
    { week: 'Feb', price: 12 },
    { week: 'Mar', price: 15 },
    { week: 'Abr', price: 18 },
    { week: 'May', price:  20 },
    { week: 'Jun', price: 28 },
    { week: 'Jul', price: 22 },
    { week: 'Ago', price: 29 },
    { week: 'Sep', price: 35 },
    { week: 'Oct', price: 37 },
    { week: 'Nov', price: 40 },
    { week: 'Dic', price: 42 },
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
