import apiClient from './apiInstance';

const getStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export default getStats;
