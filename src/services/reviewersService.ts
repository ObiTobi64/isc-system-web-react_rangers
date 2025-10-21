/* eslint-disable no-console */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getReviewers = async () => {
  try {
    const response = await axios.get(`${API_URL}reviewers`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los revisores:', error);
    throw error;
  }
};

export default getReviewers;
