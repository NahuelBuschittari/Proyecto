import axios from 'axios';

export const getDistance = async (startLat, startLon, endLat, endLon) => {
    try {
        const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}`, {
            params: {
                overview: 'false',
                geometries: 'polyline',
                steps: 'false'
            }
        });

        const distance = response.data.routes[0].distance; // Distancia en metros
        return distance;
    } catch (error) {
        console.error('Error al calcular la distancia con OSRM:', error);
        return null;
    }
};
