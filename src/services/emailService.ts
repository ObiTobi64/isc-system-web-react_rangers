/* eslint-disable no-console */
import apiClient from './apiInstance';

interface EmailInterface {
  email: string;
  subject: string;
  textHtml: string;
}

const sendEmail = async (email: EmailInterface) => {
  try {
    const response = await apiClient.post(`email`, email);
    return response.data;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

export default sendEmail;
