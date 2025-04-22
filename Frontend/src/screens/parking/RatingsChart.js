import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const RatingsChart = ({ averageRatings, onInfoPress }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
    labelSize: 8,
    verticalLabelRotation: 30,
    horizontalLabelRotation: 30,
    xAxisInterval: 1
  };

  return (
    <View style={styles.chartWrapper}>
      {Object.keys(averageRatings).length > 0 ? (
        <View style={styles.chartContainer}>
          <MaterialCommunityIcons
            name="information-outline"
            size={17}
            onPress={onInfoPress}
            style={{ position: 'absolute', right: 10, top: 8 }}
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
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            yAxisLabel=""
            yAxisSuffix=""
            fromZero={true}
            withHorizontalLabels={true}
            withVerticalLabels={true} 
          />
          <Text style={styles.chartDescription}>
            Calificaciones promedio en cada categoría evaluada por los usuarios.
          </Text>
        </View>
      ) : (
        <Text style={styles.noDataText}>No hay datos de calificaciones disponibles</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    marginVertical: 10,
  },
  chartContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chart: {
    borderRadius: 10,
    padding: 10,
    paddingTop: 20,
  },
  chartDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    padding: 5,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
});

export default RatingsChart;