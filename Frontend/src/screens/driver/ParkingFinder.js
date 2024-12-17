import React, { useEffect,useState, useCallback } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  Switch, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Button, 
  ScrollView
} from 'react-native';
import { Drawer } from 'react-native-paper';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { dummyParkingData } from './DUMMY_PARKINGS';
import { Picker } from '@react-native-picker/picker';
import getDay from '../../components/getDay';

// Función para calcular distancia entre dos puntos geográficos
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convertir a metros
};

const ParkingFinder = ({ route, navigation }) => {
  const { location, vehicle } = route.params;
  const [parkings, setParkings] = useState(dummyParkingData);
  const [activeFilterCategory, setActiveFilterCategory] = useState('caracteristicas');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicle || 'Auto');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDay,setCurrentDay]=useState(null);

  useEffect(() => {
    const day = getDay();
    setCurrentDay(day);
    setFilters(prev => ({
      ...prev,
      selectedDay: day
    }));
  }, []);

  const [filters, setFilters] = useState({
    vehicleType: selectedVehicle,
    maxDistance: 2000, // 2 km por defecto
    isCovered: null,
    has24hSecurity: null,
    hasEVChargers: null,
    openNow: false,
    maxPrice: null,
    hasCCTV: null,
    hasValetService: null,
    hasDisabledParking: null,
    hasAutoPayment: null,
    hasCardAccess: null,
    hasCarWash: null,
    hasRestrooms: null,
    hasBreakdownAssistance: null,
    hasFreeWiFi: null,
    selectedDay: null,
    selectedStartTime: null,
    selectedEndTime: null
  });

  const [sortBy, setSortBy] = useState('price');
  const [sortDirection, setSortDirection] = useState('asc');

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const clearFilters = useCallback(() => {
    setFilters({
      vehicleType: selectedVehicle,
      maxDistance: 2000,
      isCovered: null,
      has24hSecurity: null,
      hasEVChargers: null,
      openNow: false,
      maxPrice: null,
      hasCCTV: null,
      hasValetService: null,
      hasDisabledParking: null,
      hasAutoPayment: null,
      hasCardAccess: null,
      hasCarWash: null,
      hasRestrooms: null,
      hasBreakdownAssistance: null,
      hasFreeWiFi: null,
      openNow:false,
      selectedDay: null,
      selectedStartTime: null,
      selectedEndTime: null
    });
  }, [selectedVehicle]);

  const filteredParkings = parkings
    .filter((parking) => {
      // Mapeo de capacidades según el tipo de vehículo
      const vehicleCapacityMap = {
        'Auto': 'carCapacity',
        'Camioneta': 'carCapacity', // Asumiendo que usa la misma capacidad que Auto
        'Moto': 'motoCapacity',
        'Bicicleta': 'bikeCapacity'
      };

      const vehicleCapacityKey = vehicleCapacityMap[selectedVehicle];

      // Filtro de capacidad
      if (parseInt(parking.capacities[vehicleCapacityKey]) === 0) return false;

      // Filtro de distancia
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        parking.userData.address.latitude,
        parking.userData.address.longitude
      );
      if (distance > filters.maxDistance) return false;

      // Filtros de características
      const featureFilters = [
        'isCovered', 'has24hSecurity', 'hasEVChargers', 
        'hasCCTV', 'hasValetService', 'hasDisabledParking', 
        'hasAutoPayment', 'hasCardAccess', 'hasCarWash', 
        'hasRestrooms', 'hasBreakdownAssistance', 'hasFreeWiFi'
      ];

      for (let feature of featureFilters) {
        if (filters[feature] !== null && parking.features[feature] !== filters[feature]) {
          return false;
        }
      }

       // Determinar qué día usar para la validación de horarios
    const dayToCheck = filters.openNow ? currentDay : filters.selectedDay;
    const scheduleForDay = parking.schedule[dayToCheck];

    if (!scheduleForDay) {
      console.warn(`Missing schedule for day: ${dayToCheck}`, parking.schedule);
      return false;
    }
    // Validación de horario
    if (filters.openNow) {
      const currentTime = new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      if (currentTime < scheduleForDay.openTime || 
          currentTime > scheduleForDay.closeTime) {
        return false;
      }
    }

    // Filtro de horario específico
    if (!filters.openNow && filters.selectedDay && 
        filters.selectedStartTime && filters.selectedEndTime) {
      if (filters.selectedStartTime < scheduleForDay.openTime || 
          filters.selectedEndTime > scheduleForDay.closeTime) {
        return false;
      }
    }

      // Filtro de precio máximo
      if (filters.maxPrice !== null) {
        const currentPrice = parseInt(parking.prices[selectedVehicle]['dia completo']);
        if (currentPrice > filters.maxPrice) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
    
      switch (sortBy) {
        case 'price':
          const priceA = parseInt(a.prices[selectedVehicle]['dia completo']);
          const priceB = parseInt(b.prices[selectedVehicle]['dia completo']);
          comparison = priceA - priceB;
          break;
    
        case 'distance':
          const distA = calculateDistance(
            location.latitude,
            location.longitude,
            a.userData.address.latitude,
            a.userData.address.longitude
          );
          const distB = calculateDistance(
            location.latitude,
            location.longitude,
            b.userData.address.latitude,
            b.userData.address.longitude
          );
          comparison = distA - distB;
          break;
    
        default:
          break;
      }
    
      // Aplicar dirección (ascendente o descendente)
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    

  return (
    <View style={styles2.container}>
      <Text style={styles2.title}>Encontrar Estacionamiento</Text>
        <Text>Ubicacion seleccionada:</Text>
        <Text>{location.address.name}</Text>
        <CustomButton
          onPress={toggleDrawer} 
          text='Más filtros' 
          style={styles.navigationButton}
          textStyle={styles.navigationButtonText}
        />
      

      {drawerOpen && (
        <Drawer.Section style={styles2.drawer}>
          <ScrollView>
            <Picker
              selectedValue={activeFilterCategory}
              onValueChange={(itemValue) => {
                setActiveFilterCategory(itemValue);
              }}
            >
              <Picker.Item 
                key={1} 
                label='Ubi y precio' 
                value='ubiPrecio' 
                color={theme.colors.text}
              />
              <Picker.Item 
                key={2} 
                label='Características' 
                value='caracteristicas' 
                color={theme.colors.text}
              />
              <Picker.Item 
                key={3} 
                label='Horarios' 
                value='horario' 
                color={theme.colors.text}
              />
              
            </Picker>

            {activeFilterCategory === 'ubiPrecio' && (
              <>
                <View style={[{flexDirection: 'row'}]}>
      <Text>Vehiculo seleccionado:</Text>
      <View style={[{width:'50%'}]}>
        <Picker pickerStyleType={[{fontSize:theme.typography.fontSize.small}]}
          selectedValue={selectedVehicle}
          onValueChange={(itemValue) => {
            setSelectedVehicle(itemValue);
            setFilters(prev => ({ ...prev, vehicleType: itemValue }));
          }}
        >
          {['Auto', 'Camioneta', 'Moto', 'Bicicleta'].map((vehicle, index) => (
            <Picker.Item 
              key={index} 
              label={vehicle} 
              value={vehicle} 
              color={theme.colors.text}
            />
          ))}
        </Picker> 
      </View>
      </View>

      <View style={styles2.row}>
        <Text>Distancia máxima:</Text>
        <CustomInput
          style={styles2.input}
          placeholder="Distancia en metros"
          keyboardType="numeric"
          value={filters.maxDistance.toString()}
          onChangeText={(text) => {
            const distance = parseInt(text) || 2000;
            setFilters({ ...filters, maxDistance: distance });
          }}
        />
      </View>
      <View style={styles2.row}>
        <Text>Precio máximo:</Text>
        <CustomInput
          style={styles2.input}
          placeholder="Precio máximo"
          keyboardType="numeric"
          value={filters.maxPrice ? filters.maxPrice.toString() : ''}
          onChangeText={(text) => {
            const price = parseInt(text) || null;
            setFilters({ ...filters, maxPrice: price });
          }}
        />
      </View>
              </>
            )}
            {activeFilterCategory === 'caracteristicas' && (
            <>
            <View style={styles2.row}>
                <Text>Techado</Text>
                <Switch
                    value={filters.isCovered}
                    onValueChange={(value) =>
                    setFilters({ ...filters, isCovered: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Seguridad 24h</Text>
                <Switch
                    value={filters.has24hSecurity}
                    onValueChange={(value) =>
                    setFilters({ ...filters, has24hSecurity: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>CCTV</Text>
                <Switch
                    value={filters.hasCCTV}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasCCTV: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Servicio de Valet</Text>
                <Switch
                    value={filters.hasValetService}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasValetService: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Cargadores Eléctricos</Text>
                <Switch
                    value={filters.hasEVChargers}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasEVChargers: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Lugar para discapacitados</Text>
                <Switch
                    value={filters.hasDisabledParking}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasDisabledParking: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Pago Automático</Text>
                <Switch
                    value={filters.hasAutoPayment}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasAutoPayment: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Acceso con Tarjeta</Text>
                <Switch
                    value={filters.hasCardAccess}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasCardAccess: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Lavado de Autos</Text>
                <Switch
                    value={filters.hasCarWash}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasCarWash: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Baños</Text>
                <Switch
                    value={filters.hasRestrooms}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasRestrooms: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>Asistencia en Carretera</Text>
                <Switch
                    value={filters.hasBreakdownAssistance}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasBreakdownAssistance: value })
                    }
                />
            </View>

            <View style={styles2.row}>
                <Text>WiFi Gratis</Text>
                <Switch
                    value={filters.hasFreeWiFi}
                    onValueChange={(value) =>
                    setFilters({ ...filters, hasFreeWiFi: value })
                    }
                />
            </View>
            </>)}
            {/* Filtro de horarios */}
            {activeFilterCategory === 'horario' && (
                <>
                  <Text>Seleccione un día</Text>
                  <Picker
                    selectedValue={filters.selectedDay}
                    onValueChange={(value) => setFilters({ ...filters, selectedDay: value })}
                  >
                    <Picker.Item label="Lunes" value="L" />
                    <Picker.Item label="Martes" value="Ma" />
                    <Picker.Item label="Miércoles" value="Mi" />
                    <Picker.Item label="Jueves" value="J" />
                    <Picker.Item label="Viernes" value="V" />
                    <Picker.Item label="Sábado" value="S" />
                    <Picker.Item label="Domingo" value="D" />
                    <Picker.Item label="Feriado" value="F" />
                  </Picker>
                
                  <TextInput
                    style={[styles2.input,{width:'100%'}]}
                    placeholder="Hora desde (HH:MM)"
                    value={filters.selectedStartTime || ''}
                    onChangeText={(text) => 
                      setFilters({ ...filters, selectedStartTime: text })
                    }
                  />
                  <TextInput
                    style={styles2.input}
                    placeholder="Hora hasta (HH:MM)"
                    value={filters.selectedEndTime || ''}
                    onChangeText={(text) => 
                      setFilters({ ...filters, selectedEndTime: text })
                    }
                  />
                  <View style={styles2.row}>
                    <Text>Abierto ahora</Text>
                    <Switch
                      value={filters.openNow}
                      onValueChange={(value) =>
                        setFilters({ 
                          ...filters, 
                          openNow: value,
                          selectedDay: value ? getDay() : filters.selectedDay
                        })
                      }
                    />
                  </View>
                </>
              )}

            <View style={styles.horizontalContainer}>
              <CustomButton 
                text='Cerrar' 
                onPress={toggleDrawer} 
                style={styles.navigationButton} 
                textStyle={styles.navigationButtonText}
              />
              <CustomButton 
                text='Limpiar filtros' 
                onPress={clearFilters} 
                style={styles.navigationButton} 
                textStyle={styles.navigationButtonText}
              />
            </View>
          </ScrollView>
        </Drawer.Section>
      )}

      {/* Sección de ordenamiento */}
      <View style={styles.row}>
        <Text>Ordenar por:</Text>
        <Picker
          selectedValue={`${sortBy}-${sortDirection}`}
          onValueChange={(value) => {
            const [newSortBy, newSortDirection] = value.split('-');
            setSortBy(newSortBy);
            setSortDirection(newSortDirection);
          }}
          style={styles2.picker}
        >
          <Picker.Item label="Precio Ascendente" value="price-asc" />
          <Picker.Item label="Precio Descendente" value="price-desc" />
          <Picker.Item label="Distancia Ascendente" value="distance-asc" />
          <Picker.Item label="Distancia Descendente" value="distance-desc" />
        </Picker>
      </View>

      {/* Resultados */}
      {filteredParkings.length > 0 ? (
        <FlatList
        data={filteredParkings}
        keyExtractor={(item) => item.userData.id.toString()}
        renderItem={({ item }) => {
          const dayToShow = filters.openNow ? currentDay : filters.selectedDay;
          const schedule = item.schedule[dayToShow];

            return (
              <View style={styles.card}>
                <Text style={styles2.parkingTitle}>{item.userData.name}</Text>
                <Text>
                  {item.userData.address.street} {item.userData.address.number}
                </Text>
                <View style={styles.card}>
                <Text>Tarifas para {selectedVehicle}:</Text>
                <Text>Fracción: ${item.prices[selectedVehicle].fraccion}</Text>
                <Text>Hora: ${item.prices[selectedVehicle].hora}</Text>
                <Text>Medio día: ${item.prices[selectedVehicle]['medio dia']}</Text>
                <Text>Día completo: ${item.prices[selectedVehicle]['dia completo']}</Text>
                </View>
                <Text>Horarios ({dayToShow}): {schedule.openTime} - {schedule.closeTime}</Text>
                <View style={styles.buttonContainer}>
                  <CustomButton style={styles.navigationButton} textStyle={styles.navigationButtonText} text='Mas info'/>  
                  <CustomButton style={styles.navigationButton} textStyle={styles.navigationButtonText} text='Ir con Google Maps'/>      
                </View>      
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles2.noResults}>
          No se encontraron estacionamientos que coincidan con tus filtros.
        </Text>
      )}
    </View>
  );
};

const styles2 = StyleSheet.create({
  // Tus estilos originales más algunos nuevos
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.text
  },
      drawer: {
        position: 'absolute',
        width: '70%',
        height: '100%',
        backgroundColor: '#fff',
        elevation: 4,
        zIndex:1,
    },
      content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    width:'30%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  button: {
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  parkingItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
  },
  parkingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default ParkingFinder;
