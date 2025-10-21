/* eslint-disable no-console */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getPresidents = async () => {
  try {
    const response = await axios.get(`${API_URL}presidents`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tutores:', error);
    throw error;
  }
};

export default getPresidents;
