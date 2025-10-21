/* eslint-disable camelcase */
import apiClient from './apiInstance';

const route = 'roles/';

export const getRoles = async () => {
  try {
    const response = await apiClient.get(route);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get roles: ${(error as Error).message}`);
  }
};

export const getProfessorRoles = async () => {
  try {
    const response = await apiClient.get(`${route}professor`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to get professor roles${(error as Error).message}`);
  }
};

export const getStudentRoles = async () => {
  try {
    const response = await apiClient.get(`${route}student`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to get student roles${(error as Error).message}`);
  }
};

export const addRole = async (role: { name: string; category: string }) => {
  try {
    const response = await apiClient.post(route, role);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add role: ${(error as Error).message}`);
  }
};

export const editRole = async (id: number, role: { name: string }) => {
  try {
    const response = await apiClient.put(route + id, role);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to edit role: ${(error as Error).message}`);
  }
};

export const deleteRole = async (id: number) => {
  try {
    const response = await apiClient.delete(route + id);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete role: ${(error as Error).message}`);
  }
};

export const addPermisionToRole = async (role_id: number, permission_id: number) => {
  try {
    const response = await apiClient.post(`${route}permissions/`, { role_id, permission_id });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add a permission: ${(error as Error).message}`);
  }
};

export const removePermisionToRole = async (role_id: number, permission_id: number) => {
  try {
    const response = await apiClient.delete(`${route}permissions/`, {
      data: { role_id, permission_id },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to remove a permission: ${(error as Error).message}`);
  }
};
