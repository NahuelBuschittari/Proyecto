import axios from 'axios';

const API_KEY = 'pk.f9d7b4178651e359c7f88955f5fed702'; // Reemplaza con tu API Key

export const getLocationSuggestions = async (query) => {
  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php`, {
      params: {
        key: API_KEY,
        q: query,
        format: 'json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
