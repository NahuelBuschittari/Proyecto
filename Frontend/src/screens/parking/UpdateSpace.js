import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const ParkingManager = () => {
  const [spaces, setSpaces] = useState({
    cars: 20,
    motorcycles: 15,
    bikes: 10
  });

  const updateSpace = (type, increment) => {
    setSpaces(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment)
    }));
  };

  const getSpaceStatus = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return styles.highAvailability;
    if (percentage > 30) return styles.mediumAvailability;
    return styles.lowAvailability;
  };

  const SpaceCard = ({ title, emoji, available, total, type }) => (
    <View style={[styles.card, getSpaceStatus(available, total)]}>
      <View style={styles.cardHeader}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.availableNumber}>{available}</Text>
        <Text style={styles.availableText}>Disponibles</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => updateSpace(type, -1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => updateSpace(type, 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Control de Espacios</Text>
      
      <View style={styles.cardsContainer}>
        <SpaceCard 
          title="Vehículos"
          emoji="🚗"
          available={spaces.cars}
          total={20}
          type="cars"
        />
        
        <SpaceCard 
          title="Motos"
          emoji="🏍️"
          available={spaces.motorcycles}
          total={15}
          type="motorcycles"
        />
        
        <SpaceCard 
          title="Bicicletas"
          emoji="🚲"
          available={spaces.bikes}
          total={10}
          type="bikes"
        />
      </View>

      {Object.values(spaces).some(value => value === 0) && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>
            ¡Atención! Espacios agotados
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0a0a0a',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  card: {
    borderRadius: 8,
    padding: 8,
    elevation: 3,
    shadowColor: '#0a0a0a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: '28%',
  },
  highAvailability: {
    backgroundColor: '#b1c8e7',
  },
  mediumAvailability: {
    backgroundColor: '#8ba4c1',
  },
  lowAvailability: {
    backgroundColor: '#5f6f95',
  },
  cardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: '100%', 
  paddingHorizontal: 8, 
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a0a0a',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0a0a0a',
  },
  availableText: {
    fontSize: 12,
    color: '#394c74',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#394c74',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#f5f5f5',
    fontSize: 20,
    fontWeight: 'bold',
  },
  alert: {
    backgroundColor: '#5f6f95',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  alertText: {
    color: '#f5f5f5',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ParkingManager;