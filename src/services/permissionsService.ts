/* eslint-disable no-console */
import apiClient from './apiInstance';

const permissionTable = 'permission/';

export const getPermissions = async () => {
  try {
    const response = await apiClient.get(permissionTable);
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions data:', error);
    return [];
  }
};

export const getPermissionById = async (id: number) => {
  try {
    const response = await apiClient.get(`${permissionTable}${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions data:', error);
    return null;
  }
};
