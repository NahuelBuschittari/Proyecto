import axios from 'axios';

import {LOCATION_IQ_API_KEY} from '@env';
const API_KEY = LOCATION_IQ_API_KEY; 

export const getLocationSuggestions = async (query) => {
  try {
    const response = await axios.get(`https://us1.locationiq.com/v1/autocomplete.php`, {
      params: {
        key: API_KEY,
        q: query,
        format: 'json',
        countrycodes:'ar',
        'accept-language':'es',
        limit: 8,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
