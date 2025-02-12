import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomButton from '../../components/CustomButton';
import { setupNotifications,checkParkingAvailability } from '../../components/Notifications';
import createReview from '../../components/createReview';
import { useAuth } from '../../context/AuthContext';
const SpecificParkingDetails = ({ route, navigation }) => {
    const { parkingData, selectedVehicle } = route.params;
    const [activeSection, setActiveSection] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const { user, authTokens } = useAuth();
    console.log("selectedVehicle",selectedVehicle);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Atrás',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => {
                        const previousScreen = navigation.getState().routes[navigation.getState().routes.length - 2].name;
                        if (previousScreen === 'ParkingFinder') {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Navigation', {
                                selectedParking: parkingData
                            });
                        }
                    }}
                >
                    <Text style={styles2.headerBackText}>Atrás</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, parkingData]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync({});
                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        })();
        setupNotifications();
    }, []);

    async function openGoogleMaps (){
        if (!userLocation) return;
        let travelmode= 'driving'
        if(selectedVehicle==='Moto' ||selectedVehicle==='motorcycle'){
            travelmode='two-wheeler';}
        else if(selectedVehicle==='Bicicleta' || selectedVehicle==='bicycle') {
            travelmode='bicycling';}

        const latDest = parseFloat(parkingData.latitude);
        const lngDest = parseFloat(parkingData.longitude);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${latDest},${lngDest}&travelmode=${travelmode}`;
        const space= await checkParkingAvailability(parkingData, selectedVehicle);
        if(space){
            createReview(parkingData.id, user.id, authTokens.access);
        }
        Linking.openURL(url);
    };

    const featureTranslations = {
        isCovered: { text: 'Estacionamiento Cubierto', icon: 'warehouse' },
        has24hSecurity: { text: 'Seguridad 24h', icon: 'shield-alt' },
        hasCCTV: { text: 'Cámaras de Seguridad', icon: 'video' },
        hasValetService: { text: 'Servicio de Valet', icon: 'car' },
        hasDisabledParking: { text: 'Estacionamiento para Discapacitados', icon: 'wheelchair' },
        hasEVChargers: { text: 'Cargadores para Vehículos Eléctricos', icon: 'charging-station' },
        hasAutoPayment: { text: 'Pago Automático', icon: 'money-bill-wave' },
        hasCardAccess: { text: 'Acceso con Tarjeta', icon: 'id-card' },
        hasCarWash: { text: 'Lavado de Autos', icon: 'soap' },
        hasRestrooms: { text: 'Baños', icon: 'restroom' },
        hasBreakdownAssistance: { text: 'Asistencia Mecánica', icon: 'tools' },
        hasFreeWiFi: { text: 'WiFi Gratuito', icon: 'wifi' }
    };

    const AccordionSection = ({ title, isActive, onPress, children }) => (
        <View style={styles2.accordionContainer}>
            <TouchableOpacity
                style={styles2.accordionHeader}
                onPress={onPress}
            >
                <Text style={styles2.accordionTitle}>{title}</Text>
                <FontAwesome5
                    name={isActive ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={theme.colors.text}
                />
            </TouchableOpacity>
            {isActive && (
                <View style={styles2.accordionContent}>
                    {children}
                </View>
            )}
        </View>
    );

    const PricesContent = () => (
        <View>
            {[
                { type: 'auto', label: 'Autos' },
                { type: 'camioneta', label: 'Camionetas' },
                { type: 'moto', label: 'Motos' },
                { type: 'bici', label: 'Bicicletas' }
            ].map(({ type, label }) => (
                <View key={type} style={styles2.priceCard}>
                    <Text style={styles2.priceTitle}>{label}</Text>
                    <View style={styles2.priceGrid}>
                        <Text style={styles2.priceItem}>Fracción: ${parkingData.prices[`${type}_fraccion`]}</Text>
                        <Text style={styles2.priceItem}>Hora: ${parkingData.prices[`${type}_hora`]}</Text>
                        <Text style={styles2.priceItem}>Medio día: ${parkingData.prices[`${type}_medio_dia`]}</Text>
                        <Text style={styles2.priceItem}>Día: ${parkingData.prices[`${type}_dia_completo`]}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
    
    const ScheduleContent = () => (
        <View style={styles2.scheduleContainer}>
            {[
                { key: 'lunes', label: 'Lunes' },
                { key: 'martes', label: 'Martes' },
                { key: 'miercoles', label: 'Miércoles' },
                { key: 'jueves', label: 'Jueves' },
                { key: 'viernes', label: 'Viernes' },
                { key: 'sabado', label: 'Sábados' },
                { key: 'domingo', label: 'Domingos' },
                { key: 'feriados', label: 'Feriados' }
            ].map(({ key, label }) => (
                <Text key={key} style={styles2.scheduleItem}>
                    {label}: {parkingData.schedule[`${key}_open`]} - {parkingData.schedule[`${key}_close`]}
                </Text>
            ))}
        </View>
    );
    
    const CapacityContent = () => (
        <View style={styles2.capacityContainer}>
            <Text style={styles2.capacityItem}>Autos: {parkingData.carCapacity}</Text>
            <Text style={styles2.capacityItem}>Motos: {parkingData.motoCapacity}</Text>
            <Text style={styles2.capacityItem}>Bicicletas: {parkingData.bikeCapacity}</Text>
        </View>
    );
    
    const FeaturesContent = () => (
        <View style={styles2.featuresContainer}>
            {Object.entries(parkingData.features).map(([key, value]) => (
                <View key={key} style={styles2.featureItem}>
                    <FontAwesome5 
                        name={featureTranslations[key]?.icon || 'question-circle'} 
                        size={20} 
                        color={theme.colors.primary}
                        style={styles2.featureIcon}
                    />
                    <Text style={styles2.featureText}>
                        {featureTranslations[key]?.text || key}
                    </Text>
                    <FontAwesome5 
                        name={value ? 'check' : 'times'} 
                        size={20} 
                        color={value ? theme.colors.success : theme.colors.error}
                        style={styles2.featureStatus}
                    />
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles2.mainContainer}>
            <View style={styles2.stickyHeader}>
                <View style={styles2.headerContent}>
                    <View style={styles2.headerTextContainer}>
                        <Text style={styles2.title}>{parkingData.nombre}</Text>
                        <Text style={styles2.address}>
                            {parkingData.calle} {parkingData.numero}, {parkingData.ciudad}
                        </Text>
                    </View>
                    <CustomButton
                        style={styles2.mapsButton}
                        textStyle={{color: 'white'}}
                        text="Ir con Maps"
                        onPress={()=>openGoogleMaps()}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles2.scrollContainer}>
                <AccordionSection
                    title="Capacidad"
                    isActive={activeSection === 'capacity'}
                    onPress={() => setActiveSection(activeSection === 'capacity' ? null : 'capacity')}
                >
                    <CapacityContent />
                </AccordionSection>

                <AccordionSection
                    title="Precios"
                    isActive={activeSection === 'prices'}
                    onPress={() => setActiveSection(activeSection === 'prices' ? null : 'prices')}
                >
                    <PricesContent />
                </AccordionSection>

                <AccordionSection
                    title="Horarios"
                    isActive={activeSection === 'schedule'}
                    onPress={() => setActiveSection(activeSection === 'schedule' ? null : 'schedule')}
                >
                    <ScheduleContent />
                </AccordionSection>

                <AccordionSection
                    title="Características"
                    isActive={activeSection === 'features'}
                    onPress={() => setActiveSection(activeSection === 'features' ? null : 'features')}
                >
                    <FeaturesContent />
                </AccordionSection>
            </ScrollView>
        </View>
    );
};

const styles2 = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        zIndex: 1000,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    headerBackText: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.normal,
        marginLeft: theme.spacing.sm,
    },
    scrollContainer: {
        paddingTop: 80, 
        paddingBottom: theme.spacing.xl,
    },
    title: {
        fontSize: theme.typography.fontSize.large,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    address: {
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    mapsButton: {
        color: theme.colors.white,   
        fontSize: theme.typography.fontSize.small,
        fontWeight: 'bold',
    },
    mapsButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.fontSize.small,
        fontWeight: 'bold',
    },
    accordionContainer: {
        marginVertical: theme.spacing.sm,
        marginHorizontal: theme.spacing.md,
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.md,
    },
    accordionTitle: {
        fontSize: theme.typography.fontSize.large,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    accordionContent: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
        borderBottomLeftRadius: theme.borderRadius.md,
        borderBottomRightRadius: theme.borderRadius.md,
    },
    featuresContainer: {
        gap: theme.spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    featureIcon: {
        marginRight: theme.spacing.md,
        width: 24,
    },
    featureText: {
        flex: 1,
        fontSize: theme.typography.fontSize.normal,
        color: theme.colors.text,
        marginRight: theme.spacing.md,
    },
    featureStatus: {
        width: 24,
        textAlign: 'right',
    },
    priceCard: {
        marginBottom: theme.spacing.md,
    },
    priceTitle: {
        fontSize: theme.typography.fontSize.normal,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    priceGrid: {
        gap: theme.spacing.sm,
    },
    priceItem: {
        color: theme.colors.text,
    },
    scheduleContainer: {
        gap: theme.spacing.sm,
    },
    scheduleItem: {
        color: theme.colors.text,
    },
    capacityContainer: {
        gap: theme.spacing.sm,
    },
    capacityItem: {
        color: theme.colors.text,
        fontSize: theme.typography.fontSize.normal,
    },
});

export default SpecificParkingDetails;