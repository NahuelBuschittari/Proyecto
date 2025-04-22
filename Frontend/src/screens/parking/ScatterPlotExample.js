import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Circle, Text as SvgText, Line } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';

const ScatterPlotExample = ({ scatterData }) => {
  // Estado para seleccionar el tipo de precio a mostrar
  const [priceType, setPriceType] = useState('hora'); // opciones: fraccion, hora, medio_dia, dia_completo
  const [vehicleType, setVehicleType] = useState('auto'); // opciones: auto, camioneta

  // Filtrar datos para ignorar estacionamientos con precio 0
  const filteredData = scatterData.filter(item => 
    item.precios.auto[priceType] > 0
  );
  const vehicleTypes = {
    auto: 'Auto',
    camioneta: 'Camioneta'};

  // Dimensiones del gráfico
  const width = Dimensions.get('window').width - 40;
  const height = 400;
  const padding = 60; // Aumentado para dar espacio a las etiquetas de los ejes
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Valores máximos y mínimos para escalar
  const maxServices = 100;
  const minServices = 0; 
  const maxPrice = Math.max(...filteredData.map(item => item.precios[vehicleType][priceType]));
  const minPrice = 0;

  // Redondear los valores máximos y mínimos para los ejes
  const roundedMaxPrice = Math.ceil(maxPrice / 100) * 100;
  const roundedMinPrice = Math.floor(minPrice / 100) * 100;
  const roundedMaxServices = Math.ceil(maxServices / 10) * 10;
  const roundedMinServices = Math.floor(minServices / 10) * 10;

  // Calcular promedio para líneas de referencia
  const avgServices = filteredData.reduce((sum, item) => sum + item.puntaje_servicios, 0) / filteredData.length;
  const avgPrice = filteredData.reduce((sum, item) => sum + item.precios[vehicleType][priceType], 0) / filteredData.length;

  // Funciones para escalar los valores
  const scaleX = (value) => {
    return ((value - minServices) / (maxServices - minServices)) * chartWidth + padding;
  };
  
  const scaleY = (value) => {
    return height - (((value - minPrice) / (maxPrice - minPrice)) * chartHeight + padding);
  };

  // Posición de las líneas de promedio
  const avgServiceX = scaleX(avgServices);
  const avgPriceY = scaleY(avgPrice);

  // Generar marcas para los ejes
  const generateAxisMarks = (min, max, axis, count = 5) => {
    const step = Math.round((max - min) / (count - 1));
    return Array.from({ length: count }, (_, i) => {
      const value = min + step * i;
      if (axis === 'x') {
        const x = scaleX(value);
        return { value, position: x };
      } else {
        const y = scaleY(value);
        return { value, position: y };
      }
    });
  };

  const xAxisMarks = generateAxisMarks(roundedMinServices, roundedMaxServices, 'x', 5);
  const yAxisMarks = generateAxisMarks(roundedMinPrice, roundedMaxPrice, 'y', 6);

  // Mapeo de nombres de tipos de precio para mostrar
  const priceTypeNames = {
    'fraccion': 'Fracción',
    'hora': 'Hora',
    'medio_dia': 'Medio Día',
    'dia_completo': 'Día Completo'
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={vehicleType}
          onValueChange={(itemValue) => setVehicleType(itemValue)}
          style={styles.picker}
        >
          {Object.entries(vehicleTypes).map(([value, label]) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>   
        <Picker
                  selectedValue={priceType}
                  onValueChange={(itemValue) => setPriceType(itemValue)}
                  style={styles.picker}
                >
                  {Object.entries(priceTypeNames).map(([value, label]) => (
                    <Picker.Item key={value} label={label} value={value} />
                  ))}
        </Picker>
      </View> 
      <Svg width={width} height={height}>
        {/* Líneas de promedio */}
        <Line 
          x1={avgServiceX} 
          y1={padding} 
          x2={avgServiceX} 
          y2={height - padding} 
          stroke="gray" 
          strokeWidth="1" 
          strokeDasharray="5,5" 
        />
        
        <Line 
          x1={padding} 
          y1={avgPriceY} 
          x2={width - padding} 
          y2={avgPriceY} 
          stroke="gray" 
          strokeWidth="1" 
          strokeDasharray="5,5" 
        />
        
        {/* Eje X y marcas */}
        <Line 
          x1={padding} 
          y1={height - padding} 
          x2={width - padding} 
          y2={height - padding} 
          stroke="black" 
          strokeWidth="1" 
        />
        
        {xAxisMarks.map((mark, index) => (
          <React.Fragment key={`x-${index}`}>
            <Line 
              x1={mark.position} 
              y1={height - padding} 
              x2={mark.position} 
              y2={height - padding + 5} 
              stroke="black" 
              strokeWidth="1" 
            />
            <SvgText 
              x={mark.position} 
              y={height - padding + 15} 
              fontSize="10" 
              textAnchor="middle" 
              fill="#333"
            >
              {mark.value}
            </SvgText>
          </React.Fragment>
        ))}
        
        {/* Eje Y y marcas */}
        <Line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={height - padding} 
          stroke="black" 
          strokeWidth="1" 
        />
        
        {yAxisMarks.map((mark, index) => (
          <React.Fragment key={`y-${index}`}>
            <Line 
              x1={padding - 5} 
              y1={mark.position} 
              x2={padding} 
              y2={mark.position} 
              stroke="black" 
              strokeWidth="1" 
            />
            <SvgText 
              x={padding - 8} 
              y={mark.position + 3} 
              fontSize="10" 
              textAnchor="end" 
              fill="#333"
            >
              {mark.value}
            </SvgText>
          </React.Fragment>
        ))}
        
        {/* Etiquetas de los ejes */}
        <SvgText 
          x={width / 2} 
          y={height - 5} 
          fontSize="12" 
          textAnchor="middle"
        >
          Puntaje de Servicios
        </SvgText>
        
        <SvgText 
          x={10} 
          y={height / 2} 
          fontSize="12" 
          textAnchor="middle" 
          rotation="-90"
          originX={10}
          originY={height / 2}
        >
          Precio por {priceTypeNames[priceType]} ($)
        </SvgText>
        
        {/* Puntos de los datos */}
        {filteredData.map((item) => (
          <Circle
            key={item.id}
            cx={scaleX(item.puntaje_servicios)}
            cy={scaleY(item.precios[vehicleType][priceType])}
            r={item.es_usuario ? 8 : 6}
            fill={item.es_usuario ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.5)'}
            stroke={item.es_usuario ? '#ff6384' : '#36a2eb'}
            strokeWidth={item.es_usuario ? 2 : 1}
          />
        ))}
        
        {/* Indicadores de cuadrantes */}
        <SvgText x={padding + 10} y={padding + 15} fontSize="10" fill="#666">
          Alto Precio / Bajo Servicio
        </SvgText>
        
        <SvgText x={width - padding - 10} y={padding + 15} fontSize="10" textAnchor="end" fill="#666">
          Alto Precio / Alto Servicio
        </SvgText>
        
        <SvgText x={padding + 10} y={height - padding - 10} fontSize="10" fill="#666">
          Bajo Precio / Bajo Servicio
        </SvgText>
        
        <SvgText x={width - padding - 10} y={height - padding - 10} fontSize="10" textAnchor="end" fill="#666">
          Bajo Precio / Alto Servicio
        </SvgText>
      </Svg>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(54, 162, 235, 0.5)' }]} />
          <Text>Competidores</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 99, 132, 0.7)' }]} />
          <Text>Mi Estacionamiento</Text>
        </View>
      </View>
      
      <Text style={styles.insight}>
        {filteredData.filter(item => item.es_usuario).length > 0 ? 
          `Tu estacionamiento tiene un precio ${
            filteredData.find(item => item.es_usuario).precios[vehicleType][priceType] > avgPrice ? 'superior' : 'inferior'
          } al promedio y un nivel de servicios ${
            filteredData.find(item => item.es_usuario).puntaje_servicios > avgServices ? 'superior' : 'inferior'
          } al promedio.` : 
          'No se ha identificado tu estacionamiento en los datos.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  buttonActive: {
    backgroundColor: '#36a2eb',
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
  },
  buttonTextActive: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 5,
  },
  insight: {
    marginTop: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
  },
});

export default ScatterPlotExample;