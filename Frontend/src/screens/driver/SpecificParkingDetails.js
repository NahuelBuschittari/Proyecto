import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomButton from '../../components/CustomButton';
import { setupNotifications, checkParkingAvailability } from '../../components/Notifications';
import createReview from '../../components/createReview';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../context/constants';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/FontAwesome';




const SpecificParkingDetails = ({ route, navigation }) => {
    const { parkingData, selectedVehicle } = route.params;
    const [activeSection, setActiveSection] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const { user, authTokens } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    console.log("selectedVehicle", selectedVehicle);
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
                                selectedParking: parkingData,
                                selectedVehicle: selectedVehicle
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
    useEffect(() => {
        fetchReviews();
    }, [parkingData.id]);

    async function openGoogleMaps() {
        if (!userLocation) return;
        let travelmode = 'driving'
        if (selectedVehicle === 'Moto' || selectedVehicle === 'motorcycle') {
            travelmode = 'two-wheeler';
        }
        else if (selectedVehicle === 'Bicicleta' || selectedVehicle === 'bicycle') {
            travelmode = 'bicycling';
        }

        const latDest = parseFloat(parkingData.latitude);
        const lngDest = parseFloat(parkingData.longitude);
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${latDest},${lngDest}&travelmode=${travelmode}`;
        const space = await checkParkingAvailability(parkingData, selectedVehicle);
        if (space) {
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

    const fetchReviews = async () => {
        setIsLoadingReviews(true);
        try {
            const response = await axios.get(`${API_URL}/parking/${parkingData.id}/reviews`, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`
                }
            });
            setReviews(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setReviews([]);
            } else {
                console.error('Error al cargar reseñas:', error);
            }
        } finally {
            setIsLoadingReviews(false);
        }
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

    const renderStars = (rating) => (
        <Stars
            display={rating}
            spacing={2}
            count={5}
            starSize={20}
            disabled={true}
            fullStar={<Icon name={'star'} style={[{ color: '#394c74' }]} />}
            emptyStar={<Icon name={'star-o'} style={[{ color: '#b1c8e7' }]} />}
        />
    );

    const ReviewsContent = () => {
        if (isLoadingReviews) {
            return (
                <View style={styles2.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }
        if (reviews.length === 0) {
            return (
                <Text style={styles2.noReviewsText}>
                    No hay reseñas para este estacionamiento
                </Text>
            );
        }

        const averageRatings = {
            Seguridad: reviews.reduce((sum, r) => sum + (r.Seguridad || 0), 0) / reviews.length,
            Limpieza: reviews.reduce((sum, r) => sum + (r.Limpieza || 0), 0) / reviews.length,
            Iluminación: reviews.reduce((sum, r) => sum + (r.Iluminación || 0), 0) / reviews.length,
            Accesibilidad: reviews.reduce((sum, r) => sum + (r.Acces || 0), 0) / reviews.length,
            Servicio: reviews.reduce((sum, r) => sum + (r.Servicio || 0), 0) / reviews.length
        };

        return (
            <View style={styles2.averageRatingsContainer}>
                <Text style={styles2.averageRatingsTitle}>Promedios de Reseñas</Text>
                {Object.entries(averageRatings).map(([key, value]) => (
                    <View key={key} style={styles2.ratingRow}>
                        <Text style={styles2.ratingLabel}>{key}</Text>
                        <View style={styles2.starsContainer}>
                            {renderStars(value, 5)}
                            <Text style={styles2.ratingValue}>({value.toFixed(1)})</Text>
                        </View>
                    </View>
                ))}

                <Text style={styles2.individualReviewsTitle}>Reseñas individuales</Text>
                {reviews.map((review, index) => (
                    <View key={index}>
                        <View style={styles2.reviewCard}>
                            <Text style={styles2.reviewerName}>{review.Usuario}</Text>
                            <View style={styles2.individualRatingsContainer}>
                                {['Seguridad', 'Limpieza', 'Iluminación', 'Accesibilidad', 'Servicio'].map(key => (
                                    <View key={key} style={styles2.individualRatingRow}>
                                        <Text style={styles2.individualRatingLabel}>{key}</Text>
                                        {renderStars(review[key === 'Accesibilidad' ? 'Acces' : key] || 0)}
                                    </View>
                                ))}
                            </View>
                            {review.Comentario && (
                                <Text style={styles2.reviewComment}>{review.Comentario}</Text>
                            )}
                        </View>
                        {index < reviews.length - 1 && (
                            <View style={styles2.reviewDivider} />
                        )}
                    </View>
                ))}
            </View>
        );
    };

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
                        textStyle={{ color: 'white' }}
                        text="Ir con Maps"
                        onPress={() => openGoogleMaps()}
                    />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles2.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
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
                <AccordionSection
                    title="Reseñas"
                    isActive={activeSection === 'reviews'}
                    onPress={() => setActiveSection(activeSection === 'reviews' ? null : 'reviews')}
                >
                    <ReviewsContent />
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
        paddingTop: 160,
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
    noReviewsText: {
        textAlign: 'center',
        color: theme.colors.secondary,
        fontStyle: 'italic',
        padding: theme.spacing.md,
    },
    individualReviewsTitle: {
        fontSize: theme.typography.fontSize.normal,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },

    reviewCard: {
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
    },
    individualRatingsContainer: {
        marginVertical: theme.spacing.sm,
    },
    individualRatingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    individualRatingLabel: {
        fontSize: theme.typography.fontSize.normal,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    ratingLabel: {
        fontSize: theme.typography.fontSize.normal,
    },
    ratingValue: {
        marginLeft: theme.spacing.sm,
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.secondary,
    },
    reviewerName: {
        fontSize: theme.typography.fontSize.normal,
        fontWeight: 'bold',
        marginBottom: theme.spacing.sm,
    },
    reviewComment: {
        fontSize: theme.typography.fontSize.small,
        color: theme.colors.text,
        fontStyle: 'italic',
        marginTop: theme.spacing.sm,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    averageRatingsContainer: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        elevation: 2,
    },
    averageRatingsTitle: {
        fontSize: theme.typography.fontSize.title,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    reviewDivider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.sm,
    },
});

export default SpecificParkingDetails;