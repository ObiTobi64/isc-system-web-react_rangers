import { UserRequest } from '../models/userInterface';
import apiClient from './apiInstance';
import { ProfessorInterface } from './models/Professor';
import { putUser } from './usersService';

const getMentors = async () => {
  try {
    const response = await apiClient.get(`professor`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los tutores:', error);
    throw error;
  }
};

const getProfessorById = async (professorId: number) => {
  try {
    const response = await apiClient.get(`professor/${professorId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener el docente:',professorId, error);
    throw error;
  }
};

const createProfessor = async (professor: ProfessorInterface) => {
  try {
    const response = await apiClient.post(`professor`, professor);
    return response.data;
  } catch (error) {
    console.error('Error al crear el tutor:', error);
    throw error;
  }
};
type ProfessorWithId = UserRequest & { id: number };

export const updateProfessor = async (professor: ProfessorWithId) => {
  
  const { id, ...professorData } = professor;
  
  const response = await putUser(id, professorData);
  return response;
};

const deleteProfessor = async (professorId: number) => {
  try {
    const response = await apiClient.delete(`professor/${professorId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el tutor:', error);
    throw error;
  }
};

export { getMentors, createProfessor, deleteProfessor, getProfessorById };
