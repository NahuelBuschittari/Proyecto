import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

// Sample data for demonstration (reemplaza con tus datos reales)
const parkingData = {
  capacityVsUsage: [
    { name: 'Parking A', capacity: 200, actualUsage: 150 },
    { name: 'Parking B', capacity: 150, actualUsage: 100 },
    { name: 'Parking C', capacity: 300, actualUsage: 250 }
  ],
  hourlyDemand: [
    { hour: '00:00', vehicles: 10 },
    { hour: '06:00', vehicles: 30 },
    { hour: '12:00', vehicles: 80 },
    { hour: '18:00', vehicles: 120 },
    { hour: '23:59', vehicles: 40 }
  ],
  vehicleTypes: [
    { type: 'Car', percentage: 70 },
    { type: 'Motorcycle', percentage: 20 },
    { type: 'Bicycle', percentage: 10 }
  ],
  monthlyTrends: [
    { month: 'Jan', vehicles: 3000 },
    { month: 'Feb', vehicles: 3500 },
    { month: 'Mar', vehicles: 4000 },
    { month: 'Apr', vehicles: 4200 },
    { month: 'May', vehicles: 4500 }
  ]
};

const DataAnalysis = () => {
  const [selectedChart, setSelectedChart] = useState('capacity');

  const plotlyHtml = (chartType) => {
    let plotConfig;
    switch (chartType) {
      case 'capacity':
        plotConfig = {
          data: [{
            x: parkingData.capacityVsUsage.map(p => p.name),
            y: parkingData.capacityVsUsage.map(p => p.actualUsage),
            name: 'Uso Actual',
            type: 'bar',
            marker: { color: theme.colors.primary }
          }, {
            x: parkingData.capacityVsUsage.map(p => p.name),
            y: parkingData.capacityVsUsage.map(p => p.capacity),
            name: 'Capacidad Total',
            type: 'bar',
            marker: { color: theme.colors.secondary }
          }],
          layout: {
            title: 'Capacidad vs. Uso de Estacionamientos',
            barmode: 'group',
            xaxis: { title: 'Ubicación de Estacionamiento' },
            yaxis: { title: 'Número de Vehículos' }
          }
        };
        break;
      case 'hourly':
        plotConfig = {
          data: [{
            x: parkingData.hourlyDemand.map(h => h.hour),
            y: parkingData.hourlyDemand.map(h => h.vehicles),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: theme.colors.primary }
          }],
          layout: {
            title: 'Demanda Horaria de Vehículos',
            xaxis: { title: 'Hora del Día' },
            yaxis: { title: 'Número de Vehículos' }
          }
        };
        break;
      case 'vehicle-types':
        plotConfig = {
          data: [{
            labels: parkingData.vehicleTypes.map(v => v.type),
            values: parkingData.vehicleTypes.map(v => v.percentage),
            type: 'pie',
            marker: { colors: [theme.colors.primary, theme.colors.secondary, '#8bc34a'] }
          }],
          layout: {
            title: 'Distribución de Tipos de Vehículos'
          }
        };
        break;
      case 'monthly':
        plotConfig = {
          data: [{
            x: parkingData.monthlyTrends.map(m => m.month),
            y: parkingData.monthlyTrends.map(m => m.vehicles),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: theme.colors.primary }
          }],
          layout: {
            title: 'Tendencia Mensual de Vehículos',
            xaxis: { title: 'Mes' },
            yaxis: { title: 'Número de Vehículos' }
          }
        };
        break;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
      </head>
      <body style="margin: 0; padding: 0;">
        <div id="plotly-chart" style="width: 100%; height: 100%;"></div>
        <script>
          Plotly.newPlot('plotly-chart', ${JSON.stringify(plotConfig.data)}, ${JSON.stringify(plotConfig.layout)}, {responsive: true});
        </script>
      </body>
      </html>
    `;
  };

  const chartOptions = [
    { key: 'capacity', label: 'Capacidad vs. Uso' },
    { key: 'hourly', label: 'Demanda Horaria' },
    { key: 'vehicle-types', label: 'Tipos de Vehículos' },
    { key: 'monthly', label: 'Tendencia Mensual' }
  ];

  return (
    <ScrollView style={styles.fullScreenContainer}>
      <View style={[styles.container, { paddingTop: 20 }]}>
        <Text style={styles.title}>Análisis de Datos de Estacionamientos</Text>
        
        <View style={[styles.horizontalContainer, { flexWrap: 'wrap', justifyContent: 'center' }]}>
          {chartOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              onPress={() => setSelectedChart(option.key)}
              style={[
                styles.navigationButton,
                {
                  width: '45%', 
                  margin: 5,
                  backgroundColor: selectedChart === option.key 
                    ? theme.colors.primary 
                    : theme.colors.secondary
                }
              ]}
            >
              <Text 
                style={[
                  styles.navigationButtonText,
                  { 
                    color: selectedChart === option.key 
                      ? 'white' 
                      : theme.colors.text 
                  }
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ 
          width: '100%', 
          height: Dimensions.get('window').height * 0.6, 
          marginTop: 20,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden'
        }}>
          <WebView
            source={{ html: plotlyHtml(selectedChart) }}
            style={{ flex: 1 }}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DataAnalysis;