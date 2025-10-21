/* eslint-disable no-console */
import apiClient from './apiInstance';

const getModes = async () => {
  try {
    const response = await apiClient.get(`modality`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las modalidades:', error);
    throw error;
  }
};

export default getModes;
