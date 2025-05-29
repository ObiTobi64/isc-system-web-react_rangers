import axios from 'axios';
import apiClient from './apiInstance';
import { Interns, InternsInformation } from '../models/internsInterface';

export const getInternService = async (intern_id: number) => {
  try {
    const response = await apiClient.get(`/interns/${intern_id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getInternData = async (intern_id: number) => {
  try {
    const response = await apiClient.get(`/interns/${intern_id}/informacion`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getInternEvents = async (intern_id: number) => {
  try {
    const response = await apiClient.get(`/interns/${intern_id}/my-events`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern events' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getInternList = async () => {
  try {
    const response = await apiClient.get(`/interns/`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern events' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getInternInformation = async (user_id: number) => {
  try {
    const response = await apiClient.get(`/interns/${user_id}/intern`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern events' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getAllCompleteInternService = async () => {
  try {
    const response = await apiClient.get(`/interns/full-info`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get full interns info ' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const createIntern = async (intern: Partial<Interns>) => {
  try {
    const response = await apiClient.post(`/interns/`, intern);
    if (response.status === 201) {
      return response.data;
    } else {
      return { error: 'Failed to create intern' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getInternByUserIdService = async (userId: number) => {
  try {
    const response = await apiClient.get(`interns/${userId}/intern`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern by user id' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const getInternHistoryByIdService = async (internId: number) => {
  try {
    const response = await apiClient.get(`/interns/${internId}/historial-eventos`);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to get intern events' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

export const updateIntern = async (intern_id: number, internData: Partial<InternsInformation>) => {
  try {
    const response = await apiClient.put(`/interns/${intern_id}`, internData);
    if (response.status === 200) {
      return response.data;
    } else {
      return { error: 'Failed to update intern' };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    } else {
      return { error: 'An unexpected error occurred' };
    }
  }
};

