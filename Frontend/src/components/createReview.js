import {API_URL} from "../context/constants";

const createReview = async (parkingId, driverId, token) => {
    console.log("Entra a review")
    try {
        const reviewData = {
            idParking: parkingId,
            idDriver: driverId,
        };
        console.log("Creando review con:",reviewData)
        const response = await fetch(`${API_URL}/reviews/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData),
        });
        if (!response.ok) {
            throw new Error('Error en el registro');
        }
        const data = await response.json();
        console.log("pipe",data);
    } catch (error) {
        console.log(error);
    }
};
export default createReview;