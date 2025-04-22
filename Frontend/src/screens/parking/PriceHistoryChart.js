import React, { useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { Button, Card, Title, Divider } from 'react-native-paper';

const tiposHorario = ['fraccion', 'hora', 'medio_dia', 'dia_completo'];
const vehiculos = ['auto', 'camioneta', 'moto', 'bici'];
const colores = ['#007bff', '#28a745', '#ffc107', '#dc3545']; // azul, verde, amarillo, rojo

const PriceHistoryChart = ({ priceHistory, onInfoPress }) => {
  const [tipoHorario, setTipoHorario] = useState('fraccion');
  const [dataChart, setDataChart] = useState(null);
  const [cambiosPrecio, setCambiosPrecio] = useState({});
  
  useEffect(() => {
    if (priceHistory) {
      procesarDatos();
    }
  }, [priceHistory, tipoHorario]);

  const procesarDatos = () => {
    // Recopila todas las fechas con cambios de precio
    const cambiosFechas = {};
    const todosCambios = {};
    
    // Procesar los datos de cambios de precio por vehículo
    vehiculos.forEach((vehiculo) => {
      const campo = `${vehiculo}_${tipoHorario}`;
      const cambios = priceHistory[campo] || [];
      todosCambios[vehiculo] = [];
      
      let precioAnterior = null;
      
      cambios.forEach(({ fecha, precio }) => {
        // Solo registrar cuando hay un cambio de precio real
        if (precioAnterior !== precio) {
          const fechaObj = new Date(fecha);
          const mes = `${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${fechaObj.getFullYear()}`;
          const dia = fechaObj.getDate();
          
          if (!cambiosFechas[mes]) {
            cambiosFechas[mes] = new Set();
          }
          cambiosFechas[mes].add(dia);
          
          todosCambios[vehiculo].push({
            fecha,
            fechaFormateada: `${dia}/${mes}`,
            mes,
            dia,
            precio,
            precioAnterior
          });
        }
        
        precioAnterior = precio;
      });
    });
    
    // Convertir Sets a Arrays y ordenar
    const mesesConCambios = Object.keys(cambiosFechas).sort((a, b) => {
      const [mesA, anioA] = a.split('/');
      const [mesB, anioB] = b.split('/');
      return new Date(anioA, mesA - 1) - new Date(anioB, mesB - 1);
    });
    
    // Crear estructura de datos para el gráfico
    const etiquetas = [];
    const fechasReales = [];
    const puntosEspeciales = {};
    
    vehiculos.forEach(vehiculo => {
      puntosEspeciales[vehiculo] = [];
    });
    
    // Crear etiquetas para cada mes, incluyendo días con cambios
    mesesConCambios.forEach(mes => {
      // Añadir etiqueta de mes en negrita
      etiquetas.push({ valor: mes, tipo: 'mes' });
      fechasReales.push(mes);
      
      // Añadir etiquetas para días con cambios en este mes
      const diasConCambios = Array.from(cambiosFechas[mes]).sort((a, b) => a - b);
      
      diasConCambios.forEach(dia => {
        const etiquetaDia = `${dia}`;
        etiquetas.push({ valor: etiquetaDia, tipo: 'dia' });
        fechasReales.push(`${mes}-${dia}`);
        
        // Registrar puntos especiales para cada vehículo si hay cambio este día
        vehiculos.forEach(vehiculo => {
          const cambio = todosCambios[vehiculo].find(c => 
            c.mes === mes && c.dia === parseInt(dia)
          );
          
          if (cambio) {
            puntosEspeciales[vehiculo].push({
              indice: fechasReales.length - 1,
              precio: cambio.precio,
              precioAnterior: cambio.precioAnterior
            });
          }
        });
      });
    });
    
    // Generar datasets para cada vehículo
    const datasets = vehiculos.map((vehiculo, index) => {
      // Crear array de valores para cada punto en el eje X
      const valores = Array(fechasReales.length).fill(0);
      let precioActual = 0;
      
      // Llenar con los valores de precio actuales en cada punto
      todosCambios[vehiculo].forEach(cambio => {
        const fechaKey = cambio.mes;
        const fechaDiaKey = `${cambio.mes}-${cambio.dia}`;
        
        // Actualizar precio actual cuando encontramos un cambio
        precioActual = cambio.precio;
        
        // Aplicar este precio a todas las fechas posteriores hasta el siguiente cambio
        for (let i = 0; i < fechasReales.length; i++) {
          if (fechasReales[i] === fechaKey || fechasReales[i] === fechaDiaKey) {
            valores[i] = precioActual;
          } else if (i > 0 && valores[i] === 0) {
            valores[i] = valores[i-1]; // Mantener el precio anterior
          }
        }
      });
      
      return {
        data: valores,
        color: () => colores[index],
        strokeWidth: 2,
        withDots: false, // No mostrar puntos en todos lados
        puntosEspeciales: puntosEspeciales[vehiculo] // Puntos donde hay cambios
      };
    });
    
    // Guardar datos procesados
    setDataChart({
      labels: etiquetas,
      datasets: datasets,
      fechasReales: fechasReales
    });
    
    // Guardar cambios de precio para el panel informativo
    setCambiosPrecio(todosCambios);
  };

  const screenWidth = Dimensions.get('window').width;
  
  // Personalización de la visualización de etiquetas
  const renderLabel = (etiqueta, index) => {
    if (etiqueta.tipo === 'mes') {
      return <Text style={styles.labelMes}>{etiqueta.valor}</Text>;
    } else {
      return <Text style={styles.labelDia}>{etiqueta.valor}</Text>;
    }
  };
  
  // Formatear valores para el eje Y (precios)
  const formatYLabel = (valor) => {
    return `$${valor}`;
  };
  
  // Renderizar el gráfico con ajustes personalizados
  const renderChart = () => {
    if (!dataChart) return null;
    
    // Preparar datos para el gráfico
    const chartData = {
      labels: dataChart.labels.map(l => l.valor),
      datasets: dataChart.datasets,
      // No usamos leyenda integrada
    };
    
    return (
      <Card style={styles.chartCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <LineChart
            data={chartData}
            width={Math.max(screenWidth - 40, dataChart.labels.length * 50)} // Ancho dinámico según cantidad de etiquetas
            height={280}
            fromZero
            withInnerLines={true}
            withShadow={false}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
              },
              propsForLabels: {
                fontSize: 10,
                fontWeight: (value, index) => {
                  return dataChart.labels[index]?.tipo === 'mes' ? 'bold' : 'normal';
                },
              },
              propsForBackgroundLines: {
                stroke: '#eee',
                strokeDasharray: '5, 5',
              },
              formatYLabel: formatYLabel,
              // Personalización de puntos especiales
              renderDotContent: ({x, y, index, indexData, dataset}) => {
                const vehiculoIndex = dataChart.datasets.indexOf(dataset);
                const vehiculo = vehiculos[vehiculoIndex];
                const puntosEspeciales = dataset.puntosEspeciales || [];
                
                // Buscar si este punto es especial (tiene cambio de precio)
                const esPuntoEspecial = puntosEspeciales.some(p => p.indice === index);
                
                if (esPuntoEspecial) {
                  const punto = puntosEspeciales.find(p => p.indice === index);
                  return (
                    <View key={`dot-${vehiculo}-${index}`} style={[
                      styles.puntoCambio,
                      { left: x - 6, top: y - 6, backgroundColor: colores[vehiculoIndex] }
                    ]}>
                      <Text style={styles.precioTooltip}>
                        ${punto.precio}
                      </Text>
                    </View>
                  );
                }
                return null;
              }
            }}
            style={styles.chart}
            // Personalización adicional para destacar cambios
            decorator={() => {
              return dataChart.datasets.flatMap((dataset, datasetIndex) => {
                const puntosEspeciales = dataset.puntosEspeciales || [];
                return puntosEspeciales.map((punto, i) => {
                  // Esta función podría usarse para añadir elementos decorativos adicionales
                  return null; // De momento no añadimos decoraciones adicionales
                });
              }).filter(Boolean);
            }}
          />
        </ScrollView>
      </Card>
    );
  };

  // Panel informativo de cambios de precio
  const renderCambiosPanel = () => {
    return (
      <Card style={styles.cambiosCard}>
        <Card.Title title="Cambios de Precio" />
        <Card.Content>
          {vehiculos.map((vehiculo, vIndex) => {
            const cambios = cambiosPrecio[vehiculo] || [];
            if (!cambios.length) return null;
            
            return (
              <View key={vehiculo} style={styles.vehiculoCambios}>
                <View style={styles.vehiculoHeader}>
                  <View style={[styles.colorDot, {backgroundColor: colores[vIndex]}]} />
                  <Text style={styles.vehiculoNombre}>{vehiculo}</Text>
                </View>
                
                {cambios.filter(c => c.precioAnterior !== null).map((cambio, cIndex) => (
                  <View key={`${vehiculo}-${cIndex}`} style={styles.cambioPrecio}>
                    <Text style={styles.cambioFecha}>{cambio.fechaFormateada}</Text>
                    <Text>
                      <Text style={styles.precioCambio}>${cambio.precioAnterior || 0}</Text>
                      <Text> → </Text>
                      <Text style={styles.precioCambio}>${cambio.precio}</Text>
                      <Text style={[
                        styles.diferenciaPrecio, 
                        cambio.precio > (cambio.precioAnterior || 0) ? 
                          styles.aumentoPrecio : styles.disminucionPrecio
                      ]}>
                        {" "}({(cambio.precio > (cambio.precioAnterior || 0)) ? "+" : ""}
                        ${Math.abs(cambio.precio - (cambio.precioAnterior || 0))})
                      </Text>
                    </Text>
                  </View>
                ))}
                
                <Divider style={styles.divider} />
              </View>
            );
          })}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Historial de Precios</Title>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Tipo de Horario:</Text>
        <Picker
          selectedValue={tipoHorario}
          onValueChange={(itemValue) => setTipoHorario(itemValue)}
          style={styles.picker}
        >
          {tiposHorario.map((tipo) => (
            <Picker.Item 
              label={tipo.replace('_', ' ')} 
              value={tipo} 
              key={tipo}
            />
          ))}
        </Picker>
      </View>
      
      <View style={styles.legendContainer}>
        {vehiculos.map((vehiculo, index) => (
          <View key={vehiculo} style={styles.legendItem}>
            <View style={[styles.colorDot, {backgroundColor: colores[index]}]} />
            <Text>{vehiculo}</Text>
          </View>
        ))}
      </View>
      
      {renderChart()}
      {renderCambiosPanel()}
      
      {onInfoPress && (
        <Button 
          icon="information-outline" 
          onPress={onInfoPress} 
          mode="outlined" 
          style={styles.infoButton}
        >
          Info
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  chartCard: {
    marginBottom: 16,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  chart: {
    borderRadius: 8,
    paddingRight: 20,
  },
  labelMes: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  labelDia: {
    fontSize: 10,
  },
  puntoCambio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    position: 'absolute',
    zIndex: 100,
  },
  precioTooltip: {
    position: 'absolute',
    top: -22,
    left: -15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    width: 'auto',
  },
  cambiosCard: {
    marginBottom: 16,
  },
  vehiculoCambios: {
    marginBottom: 12,
  },
  vehiculoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehiculoNombre: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cambioPrecio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginBottom: 6,
  },
  cambioFecha: {
    fontWeight: '500',
  },
  precioCambio: {
    fontWeight: '500',
  },
  diferenciaPrecio: {
    fontSize: 13,
  },
  aumentoPrecio: {
    color: '#28a745',
  },
  disminucionPrecio: {
    color: '#dc3545',
  },
  divider: {
    marginVertical: 10,
  },
  infoButton: {
    alignSelf: 'center',
  }
});

export default PriceHistoryChart;