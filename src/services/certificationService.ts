import jsonClient from './jsonServerInstance';

const getCertifications = async () => {
  const response = await jsonClient.get(`certifications/`);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error('Failed to get certifications');
};

export default getCertifications;
