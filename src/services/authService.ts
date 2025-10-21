import axios from 'axios';
import apiClient from './apiInstance';
import { UserResponse } from './models/LoginResponse';

const authenticateUser = async (email: string, password: string): Promise<UserResponse> => {
  try {
    const response = await apiClient.post(`auth/login`, { email, password });
    if (response.status === 200) {
      return response.data.data;
    }
    throw new Error('Failed to authenticate');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Network error');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};
export default authenticateUser;
