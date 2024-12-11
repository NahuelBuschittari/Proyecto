import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SpecificParkingDetails = ({ route, navigation }) => {
    const { parkingData } = route.params;
    const [activeSection, setActiveSection] = useState(null);

    const AccordionSection = ({ title, isActive, onPress, children }) => (
        <View style={styles2.accordionContainer}>
            <TouchableOpacity
                style={styles2.accordionHeader}
                onPress={onPress}
            >
                <Text style={styles2.accordionTitle}>{title}</Text>
                <Ionicons
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
            <View style={styles2.priceCard}>
                <Text style={styles2.priceTitle}>Autos</Text>
                <View style={styles2.priceGrid}>
                    <Text style={styles2.priceItem}>Fracción: ${parkingData.prices.Auto.fraccion}</Text>
                    <Text style={styles2.priceItem}>Hora: ${parkingData.prices.Auto.hora}</Text>
                    <Text style={styles2.priceItem}>Medio día: ${parkingData.prices.Auto["medio dia"]}</Text>
                    <Text style={styles2.priceItem}>Día: ${parkingData.prices.Auto["dia completo"]}</Text>
                </View>
            </View>
            <View style={styles2.priceCard}>
                <Text style={styles2.priceTitle}>Camionetas</Text>
                <View style={styles2.priceGrid}>
                    <Text style={styles2.priceItem}>Fracción: ${parkingData.prices.Camioneta.fraccion}</Text>
                    <Text style={styles2.priceItem}>Hora: ${parkingData.prices.Camioneta.hora}</Text>
                    <Text style={styles2.priceItem}>Medio día: ${parkingData.prices.Camioneta["medio dia"]}</Text>
                    <Text style={styles2.priceItem}>Día: ${parkingData.prices.Camioneta["dia completo"]}</Text>
                </View>
            </View>
            <View style={styles2.priceCard}>
                <Text style={styles2.priceTitle}>Motos</Text>
                <View style={styles2.priceGrid}>
                    <Text style={styles2.priceItem}>Fracción: ${parkingData.prices.Moto.fraccion}</Text>
                    <Text style={styles2.priceItem}>Hora: ${parkingData.prices.Moto.hora}</Text>
                    <Text style={styles2.priceItem}>Medio día: ${parkingData.prices.Moto["medio dia"]}</Text>
                    <Text style={styles2.priceItem}>Día: ${parkingData.prices.Moto["dia completo"]}</Text>
                </View>
            </View>
            <View style={styles2.priceCard}>
                <Text style={styles2.priceTitle}>Bicicletas</Text>
                <View style={styles2.priceGrid}>
                    <Text style={styles2.priceItem}>Fracción: ${parkingData.prices.Bicicleta.fraccion}</Text>
                    <Text style={styles2.priceItem}>Hora: ${parkingData.prices.Bicicleta.hora}</Text>
                    <Text style={styles2.priceItem}>Medio día: ${parkingData.prices.Bicicleta["medio dia"]}</Text>
                    <Text style={styles2.priceItem}>Día: ${parkingData.prices.Bicicleta["dia completo"]}</Text>
                </View>
            </View>
        </View>
    );

    const ScheduleContent = () => (
        <View style={styles2.scheduleContainer}>
            <Text style={styles2.scheduleItem}>Lunes: {parkingData.schedule.L.openTime} - {parkingData.schedule.L.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Martes: {parkingData.schedule.Ma.openTime} - {parkingData.schedule.Ma.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Miércoles: {parkingData.schedule.Mi.openTime} - {parkingData.schedule.Mi.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Jueves: {parkingData.schedule.J.openTime} - {parkingData.schedule.J.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Viernes: {parkingData.schedule.V.openTime} - {parkingData.schedule.V.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Sábados: {parkingData.schedule.S.openTime} - {parkingData.schedule.S.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Domingos: {parkingData.schedule.D.openTime} - {parkingData.schedule.D.closeTime}</Text>
            <Text style={styles2.scheduleItem}>Feriados: {parkingData.schedule.F.openTime} - {parkingData.schedule.F.closeTime}</Text>
        </View>
    );

    const CapacityContent = () => (
        <View style={styles2.capacityContainer}>
            <Text style={styles2.capacityItem}>Autos: {parkingData.capacities.carCapacity}</Text>
            <Text style={styles2.capacityItem}>Motos: {parkingData.capacities.motoCapacity}</Text>
            <Text style={styles2.capacityItem}>Bicicletas: {parkingData.capacities.bikeCapacity}</Text>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: theme.spacing.xl }]}>
            <View style={styles2.header}>
                <Text style={styles2.title}>{parkingData.userData.name}</Text>
                <Text style={styles2.address}>
                    {parkingData.userData.address.street} {parkingData.userData.address.number}
                </Text>
            </View>

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
        </ScrollView>
    );
};

const styles2 = StyleSheet.create({
    header: {
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: theme.typography.fontSize.xlarge,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    address: {
        fontSize: theme.typography.fontSize.normal,
        color: theme.colors.secondary,
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