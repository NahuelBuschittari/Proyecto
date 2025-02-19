import React, { useEffect,useState, useCallback } from 'react';
import {
  View, 
  Text, 
  Switch, 
  FlatList, 
  StyleSheet, 
  ScrollView,
  Pressable,
  ActivityIndicator 
} from 'react-native';
import { Linking } from 'react-native';
import { Drawer } from 'react-native-paper';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { dummyParkingData } from './DUMMY_PARKINGS';
import { Picker } from '@react-native-picker/picker';
import getDay from '../../components/getDay';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { setupNotifications,checkParkingAvailability } from '../../components/Notifications';
import { API_URL } from '../../context/constants';
import axios from 'axios';
const ParkingFinder = ({ route, navigation }) => {

  useEffect(() => {
    const fetchDay = async () => {
      try {
        const day = await getDay();
        setCurrentDay(day);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching day:', error);
        setLoading(false); 
      }
    };
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    };
    setupNotifications();
    fetchDay();
    fetchLocation();
  }, []);
  const { location, vehicle } = route.params;
  const [parkings, setParkings] = useState(dummyParkingData);
  const [activeFilterCategory, setActiveFilterCategory] = useState('caracteristicas');
  const [selectedVehicle, setSelectedVehicle] = useState(vehicle || 'Auto');
  const [priceType, setPriceType] = useState('Hora');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentDay,setCurrentDay]=useState('');
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState(null);
 

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const onTimeChange = (event, selectedDate, isStartTime) => {
    const currentDate = selectedDate || pickerDate;
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    if (event.type === "set") {
      if (isStartTime) {
        setFilters({ ...filters, selectedStartTime: formattedTime });
        setShowStartTimePicker(false);
      } else {
        setFilters({ ...filters, selectedEndTime: formattedTime });
        setShowEndTimePicker(false);
      }
    } else {
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
    }
  };

  const [filters, setFilters] = useState({
    vehicleType: selectedVehicle,
    maxDistance: null,
    maxPrice: null,
    priceType: 'Hora',
    isCovered: null,
    has24hSecurity: null,
    hasEVChargers: null,
    hasCCTV: null,
    hasValetService: null,
    hasDisabledParking: null,
    hasAutoPayment: null,
    hasCardAccess: null,
    hasCarWash: null,
    hasRestrooms: null,
    hasBreakdownAssistance: null,
    hasFreeWiFi: null,    
    selectedDay:  null,
    selectedStartTime: null,
    selectedEndTime: null,
    openNow:false,
  });


  async function openGoogleMaps(origin, item, vehicle) {
    let travelmode= 'driving'
    if(vehicle==='Moto'){
      travelmode='two-wheeler';}
    else if(vehicle==='Bicicleta') {
      travelmode='bicycling';}
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${item.latitude},${item.longitude}&travelmode=${travelmode}`;
    const space=await checkParkingAvailability(item,vehicle);
    if(space){
      createReview(item.id, user.id, authTokens.access);
     }
    Linking.openURL(url);
  };
  const [sortBy, setSortBy] = useState('price');
  const [sortDirection, setSortDirection] = useState('asc');

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  const [filteredParkings, setFilteredParkings] = useState([]);

  
    useEffect(() => {
      if (filteredParkings.length > 0) {
        const sortedParkings = sortParkings(filteredParkings, sortBy, sortDirection);
        setFilteredParkings(sortedParkings);
      }
    }, [sortBy, sortDirection]);
  
    // Función para manejar el ordenamiento
    const sortParkings = (parkings, sortBy, sortDirection) => {
      return [...parkings].sort((a, b) => {
        if (sortBy === 'price') {
          const priceKey = `${selectedVehicle.toLowerCase()}_${priceType.toLowerCase().replace(' ', '_')}`;
    
          const priceA = parseFloat(a.prices[priceKey] || 0);
          const priceB = parseFloat(b.prices[priceKey] || 0);
    
          return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
        } else if (sortBy === 'distance') {
          return sortDirection === 'asc' ? a.distance - b.distance : b.distance - a.distance;
        }
        return 0;
      });
    };
    
    const clearFilters = () => {
      setFilters({
        vehicleType: selectedVehicle,
        maxDistance: null,
        maxPrice: null,
        priceType: 'Hora',
        isCovered: null,
        has24hSecurity: null,
        hasEVChargers: null,
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
        selectedEndTime: null,
        openNow: false,
      });
    
      // Volver a cargar los estacionamientos iniciales
      fetchInitialParkings();
    };
    const fetchInitialParkings = async () => {
      try {
        const response = await axios.post(`${API_URL}/driver/parkingFinder`, {
          vehicle_type: selectedVehicle,
          latitude: location.lat,
          longitude: location.lon
        });
    
        let parkings = response.data;
        setFilteredParkings(parkings);
      } catch (error) {
        console.error('Error fetching initial parkings:', error);
      }
    };
    
    // Llamar a la función cuando el componente se monta
    useEffect(() => {
      fetchInitialParkings();
    }, [selectedVehicle, location]);

    const applyFilters = async () => {
      try {
        const parkingFilters = {
          vehicle_type: selectedVehicle,
          max_price: filters.maxPrice || null,
          price_type: filters.priceType?.toLowerCase().replace(' ', '_').replace('í', 'i'),
          max_distance: filters.maxDistance || null,
          latitude: location.lat,
          longitude: location.lon,
          current_day: filters.selectedDay || null,
          open_now: filters.openNow || false,
          selected_start_time: filters.selectedStartTime || null,
          selected_end_time: filters.selectedEndTime || null,
          isCovered: filters.isCovered || false,
          has24hSecurity: filters.has24hSecurity || false,
          hasCCTV: filters.hasCCTV || false,
          hasValetService: filters.hasValetService || false,
          hasDisabledParking: filters.hasDisabledParking || false,
          hasEVChargers: filters.hasEVChargers || false,
          hasAutoPayment: filters.hasAutoPayment || false,
          hasCardAccess: filters.hasCardAccess || false,
          hasCarWash: filters.hasCarWash || false,
          hasRestrooms: filters.hasRestrooms || false,
          hasBreakdownAssistance: filters.hasBreakdownAssistance || false,
          hasFreeWiFi: filters.hasFreeWiFi || false
        };
        console.log(parkingFilters)
        const response = await axios.post(`${API_URL}/driver/parkingFinder`, parkingFilters);
    
        let parkings = response.data;
    
        // Aplicar ordenamiento
        parkings = sortParkings(parkings, sortBy, sortDirection);
        toggleDrawer();
        setFilteredParkings(parkings);
        
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    };
    
    if (loading) {
            return (
                <View style={styles2.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>Cargando contenido...</Text>
                </View>
            );
    }
  return (
    <View style={styles2.container}>
      <Text style={styles.title}>Encontrar Estacionamiento</Text>
        <Text style={styles.labelNegrita}>Ubicacion seleccionada:</Text>
        <Text style={styles.label}>
          {location.address.name!=location.address.road ? 
          `${location.address.name}, `: ''}{location.address.road} {location.address.house_number}, {location.address.city}, {location.address.state}, {location.address.country}
        </Text>

      {/* Sección de ordenamiento y filtros*/}
      <View>
        <Text style={styles.labelNegrita}>Ordenar por:</Text>
        <View style={styles2.row}>
        <View style={[{width:'70%'}]}>
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
        <CustomButton
          onPress={toggleDrawer} 
          text='Filtrar' 
          style={[styles.navigationButton,{width:'25%'}]}
          textStyle={styles.navigationButtonText}
        />
        </View>
      </View>

      {drawerOpen && (
        <Drawer.Section style={styles2.drawer}>
          
            <View style={{ alignSelf:'center',width:'90%',borderWidth: 1, borderColor: theme.colors.primary, borderRadius: theme.spacing.sm }}>
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
            </View>
            <View style={[{padding: 8,marginBottom: 8,alignItems: 'center',width:'100%'}]}>
            <CustomButton 
                text='Limpiar filtros' 
                onPress={clearFilters}
                style={styles.signupButton}
                textStyle={[styles.signupButtonText,{color:theme.colors.background}]} 
              />
            </View>
            <ScrollView>
            {activeFilterCategory === 'ubiPrecio' && (
              <>
                <View style={styles2.row}>
                <Text>Vehiculo:</Text>
                <View style={[{width:'70%'}]}>
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
                  <Text>Distancia máxima(cuadras):</Text>
                  <CustomInput
                    style={styles2.input}
                    keyboardType="numeric"
                    value={filters.maxDistance ? filters.maxDistance.toString(): null}
                    setValue={(text) => {
                      const distance = parseInt(text) || null;
                      setFilters({ ...filters, maxDistance: distance });
                    }}
                  />
                </View>
                <View style={styles2.row}>
                  <Text>Precio máximo(pesos):</Text>
                  <CustomInput
                    style={styles2.input}
                    keyboardType="numeric"
                    value={filters.maxPrice ? filters.maxPrice.toString() : null}
                    setValue={(text) => {
                      const price = parseInt(text) || null;
                      setFilters({ ...filters, maxPrice: price });
                    }}
                  />
                </View>
                <View style={styles2.row}>
                <Text>Tipo de tarifa:</Text>
                <View style={[{width:'70%'}]}>
                  <Picker pickerStyleType={[{fontSize:theme.typography.fontSize.small}]}
                    selectedValue={priceType}
                    onValueChange={(itemValue) => {
                      setPriceType(itemValue);
                      setFilters(prev => ({ ...prev, priceType: itemValue }));
                    }}
                  >
                    {['Fraccion', 'Hora', 'Medio día', 'Día completo'].map((priceType, index) => (
                      <Picker.Item 
                        key={index} 
                        label={priceType} 
                        value={priceType} 
                        color={theme.colors.text}
                      />
                    ))}
                  </Picker> 
                </View>
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

                  <View style={styles2.row}>
                    <Text>Abierto ahora</Text>
                    <Switch
                      value={filters.openNow}
                      onValueChange={(value) => {
                        setFilters(prevFilters => ({ 
                          ...prevFilters, 
                          openNow: value,
                          // Si se activa openNow, usar el día actual y limpiar los otros filtros de tiempo
                          selectedDay: null ,
                          selectedStartTime:  null ,
                          selectedEndTime: null 
                        }));
                      }}
                    />
                  </View>
                  <View style={styles2.row}>
                    <Text>Dia:</Text>
                    <View style={[{width:'70%'}]}>
                    <Picker
                      selectedValue={currentDay}
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
                    </View>
                  </View>
                  <View style={styles2.row}>
                    <Text>Hora desde:</Text>                   
                    <Pressable onPress={() => setShowStartTimePicker(true)} style={{width:'40%',height:'40%'}}>
                    <CustomInput
                      style={[styles2.input,{width:'100%',height:'100%'}]}
                      placeholder="(HH:MM)"
                      value={filters.selectedStartTime || ''}
                      onChangeText={(text) => setFilters({ ...filters, selectedStartTime: text })}
                      editable={false}
                    />
                    </Pressable>
                  </View>

                  <View style={styles2.row}>
                    <Text>Hora hasta:</Text>
                    
                    <Pressable onPress={() => setShowEndTimePicker(true)} style={{width:'40%',height:'40%'}}>
                    <CustomInput
                      style={[styles2.input,{width:'100%',height:'100%'}]}
                      placeholder="(HH:MM)"
                      value={filters.selectedEndTime || ''}
                      onChangeText={(text) => setFilters({ ...filters, selectedEndTime: text })}
                      editable={false}
                    />
                    </Pressable>
                  </View>

                  {showStartTimePicker && (
                    <DateTimePicker
                      mode="time"
                      display="default"
                      value={pickerDate}
                      onChange={(event, selectedDate) => onTimeChange(event, selectedDate, true)}
                    />
                  )}

                  {showEndTimePicker && (
                    <DateTimePicker
                      mode="time"
                      display="default"
                      value={pickerDate}
                      onChange={(event, selectedDate) => onTimeChange(event, selectedDate, false)}
                    />
                  )}
                </>
              )}
            </ScrollView>
            <View style={styles2.row}>
              <CustomButton 
                text='Cerrar' 
                onPress={toggleDrawer()} 
                style={styles.navigationButton} 
                textStyle={styles.navigationButtonText}
              />
              <CustomButton 
                text='Aplicar filtros' 
                onPress={applyFilters} 
                style={styles.navigationButton} 
                textStyle={styles.navigationButtonText}
              />
            </View>
        </Drawer.Section>
      )}

      {/* Resultados */}
      {filteredParkings.length > 0 ? (
 <FlatList
   data={filteredParkings}
   keyExtractor={(item) => item.id.toString()}
   renderItem={({ item }) => {
     let dayToShow = null;
     let openTime = null;
     let closeTime = null;

     const dayMap = {
       'L': 'lunes',
       'Ma': 'martes', 
       'Mi': 'miercoles',
       'J': 'jueves',
       'V': 'viernes',
       'S': 'sabado',
       'D': 'domingo',
       'F': 'feriados'
     };

     if (filters.openNow || filters.selectedDay) {
       const day = filters.openNow ? currentDay : filters.selectedDay;
       const scheduleDay = dayMap[day];
       openTime = item.schedule[`${scheduleDay}_open`];
       closeTime = item.schedule[`${scheduleDay}_close`];
       dayToShow = day;
     }

     const vehiclePrefix = selectedVehicle.toLowerCase().replace('í', 'i');

     return (
       <View style={styles.card}>
         <Text style={styles2.parkingTitle}>{item.nombre}</Text>
         <Text>{item.calle} {item.numero}</Text>
         <Text>Distancia: {item.distance} cuadras</Text>
         <View style={styles.card}>
           <Text>Tarifas para {selectedVehicle}:</Text>
           <Text>Fracción: ${item.prices[`${vehiclePrefix}_fraccion`]}</Text>
           <Text>Hora: ${item.prices[`${vehiclePrefix}_hora`]}</Text>
           <Text>Medio día: ${item.prices[`${vehiclePrefix}_medio_dia`]}</Text>
           <Text>Día completo: ${item.prices[`${vehiclePrefix}_dia_completo`]}</Text>
         </View>
         {dayToShow && (
           <Text>Horarios ({dayToShow}): {openTime} - {closeTime}</Text>
         )}
         <View style={styles.buttonContainer}>
           <CustomButton 
             text='Mas info'
             style={styles.navigationButton}
             textStyle={styles.navigationButtonText}
             onPress={() => navigation.navigate('SpecificParkingDetails', {
               parkingData: item,
               selectedVehicle: selectedVehicle,
             })}
           />
           <CustomButton 
             text='Ir con Google Maps'
             style={styles.navigationButton}
             textStyle={styles.navigationButtonText}
             onPress={() => {
                 openGoogleMaps(origin, item, selectedVehicle);
               
             }}
           />
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
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.text
  },
      drawer: {
        position: 'absolute',
        width: '80%',
        height: '100%',
        backgroundColor: theme.colors.background,
        elevation: 4,
        zIndex:1,
        alignContent:'center',
    },
      content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  container: {
    flex: 1,
    padding: 16,
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
    marginLeft: 8,
    marginRight:8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
