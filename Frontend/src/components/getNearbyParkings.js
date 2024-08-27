// getNearbyParkings.js
import { DUMMY_PARKINGS } from './dummyParkings'; // Asegúrate de tener tus datos de prueba aquí
import { getDistance } from './getDistance';

export const getNearbyParkings = async (selectedLocation, maxDistance) => {
    const { lat, lon } = selectedLocation;
    const maxDistanceInMeters = maxDistance * 100; // Aproximadamente 100 metros por cuadra

    const filteredParkings = [];

    for (const parking of DUMMY_PARKINGS) {
        const distance = await getDistance(lat, lon, parking.lat, parking.lon);
        if (distance <= maxDistanceInMeters) {
            filteredParkings.push(parking);
        }
    }

    return filteredParkings;
};

