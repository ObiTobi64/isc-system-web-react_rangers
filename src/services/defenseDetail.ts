import axios from 'axios';
import apiClient from './apiInstance';
import { CreateDefenseDetail } from './models/DefenseDetail';

const getDefenseDetail = async (processId: number, type: string) => {
  try {
    const response = await apiClient.get(`graduation/${processId}/defense/`, {
      params: {
        type,
      },
    });
    if (response.status === 200) {
      return response.data.data;
    }
    throw new Error('Failed to get defense detail');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Network error');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

const postDefenseDetail = async (processId: number, data: CreateDefenseDetail) => {
  try {
    const response = await apiClient.post(`graduation/${processId}/defense/`, {
      ...data,
    });
    if (response.status === 201) {
      return response.data.data;
    }
    throw new Error('Failed to post defense detail');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Network error');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

export { getDefenseDetail, postDefenseDetail };
