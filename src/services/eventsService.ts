/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable camelcase */
import axios from 'axios';
import apiClient from './apiInstance';
import { Event, EventInterns } from '../models/eventInterface';
import { getAllCompleteInternService } from './internService';
import { CompleteIntern } from '../models/internsInterface';

export const getEventsService = async () => {
  try {
    const response = await apiClient.get('/events');
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to get events' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const getEventsInformationsService = async () => {
  try {
    const response = await apiClient.get('/events/register-information');
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to get events' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const getEventsInformations = async (id_event: number, id_becario: number) => {
  try {
    const response = await apiClient.get(`/events/${id_event}/status/${id_becario}`);
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to get events' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const registerInternEventService = async (id_event: number, id_intern: number) => {
  try {
    const response = await apiClient.post(`events/${id_event}/register`, {
      id_becario: id_intern,
    });
    if (response.status === 201) {
      return response.data;
    }
    return { error: 'Failed to register intern on event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const createEventService = async (event: Event) => {
  try {
    const response = await apiClient.post(`events`, event);
    if (response.status === 201) {
      return response.data;
    }
    return { error: 'Failed to create event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const deleteInternFromEventService = async (id_event: number, id_intern: number) => {
  try {
    const response = await apiClient.delete(`events/${id_event}/registrations/${id_intern}`);
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to delete intern from an event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const getFullEventInformationService = async (id: string) => {
  try {
    const response = await apiClient.get(`events/${id}/registrations`);
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to fetch full event info' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const deleteEventService = async (id_event: number) => {
  try {
    const response = await apiClient.delete(`events/${id_event}`);
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to delete intern on event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const updateEventService = async (id_event: number, event: Event) => {
  try {
    const response = await apiClient.put(`events/${id_event}`, event);
    if (response.status === 201) {
      return response.data;
    }
    return { error: 'Failed to delete intern from an event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const updateInternType = async (
  id_event: number,
  id_intern: number,
  eventIntern: Partial<EventInterns>
) => {
  try {
    const response = await apiClient.put(`events/${id_event}/update/${id_intern}`, eventIntern);
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to update intern type from event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const finishEventService = async (eventId: number) => {
  try {
    const response = await apiClient.put(`events/finish/${eventId}`);
    if (response.status === 200) {
      return response.data;
    }
    return { error: 'Failed to finish event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred' };
  }
};

export const getSupervisorEventByIdService = async (id_user: number) => {
  try {
    const everyIntern = await getAllCompleteInternService();
    // TODO: show all intern events
    const intern: CompleteIntern = everyIntern.data.find(
      (currentIntern: CompleteIntern) => currentIntern.user_profile_id === id_user
    );
    const supervisedEvent = intern.events?.find((event) => event.is_supervisor);
    if (!supervisedEvent) {
      return { error: 'No supervised events' };
    }
    const response = await getFullEventInformationService(supervisedEvent?.event_id.toString());
    if (response.code === 200) {
      return response.data;
    }
    return { error: 'Failed to fetch supervised event' };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data.message || 'Network error' };
    }
    return { error: 'An unexpected error occurred', err: error };
  }
};
