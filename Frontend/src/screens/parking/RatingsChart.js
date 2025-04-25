import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../styles/theme';
const RatingsChart = ({ averageRatings, onInfoPress }) => {
  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: 'white',
    backgroundGradientTo: 'white',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
    labelColor: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
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
    <>
      {Object.keys(averageRatings).length > 0 ? (
        <View style={styles.chartContainer}>
          <MaterialCommunityIcons
            name="information-outline"
            size={17}
            onPress={onInfoPress}
            style={{ position: 'absolute', right: 10, top: 8, paddingBottom:30,color: theme.colors.primary}}
          />
          <BarChart
            data={{
              labels: Object.keys(averageRatings),
              datasets: [{
                data: Object.values(averageRatings).map(rating => parseFloat(rating.toFixed(1)))
              }]
            }}
            width={screenWidth - 40} // Subtracting 30 for padding
            height={250}
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
    </>
  );
};

const styles = StyleSheet.create({
  chart: {
    borderRadius: 10,
    paddingTop: 30,

  },
  chartDescription: {
    fontSize: 12,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
    padding: 5,
  },
  noDataText: {
    textAlign: 'center',
    padding: 20,
    color: 'black',
  },
});

export default RatingsChart;