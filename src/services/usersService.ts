import { UserRequest } from '../models/userInterface';
import apiClient from './apiInstance';

const baseURL = 'user';

export const getUsers = async () => {
  try {
    const response = await apiClient.get(baseURL);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to fetch users');
  } catch (error) {
    throw new Error(`Failed to fetch users ${(error as Error).message}`);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await apiClient.delete(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete user ${(error as Error).message}`);
  }
};

export const postUser = async (user: UserRequest) => {
  try {
    const response = await apiClient.post(baseURL, user);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to post user ${(error as Error).message}`);
  }
};

export const putUser = async (id: number, user: UserRequest) => {
  try {
    const response = await apiClient.put(`${baseURL}/${id}`, user);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to put user ${(error as Error).message}`);
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await apiClient.get(`${baseURL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get user by id${(error as Error).message}`);
  }
};

export const createUserWIthRoles = async (user: UserRequest) => {
  const response = await apiClient.post(baseURL, user);
  return response.data;
};
