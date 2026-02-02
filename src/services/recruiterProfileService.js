import api from './api';

export const getRecruiterProfile = async () => {
  const response = await api.get('/profile/recruiter');
  return response.data;
};

export const updateRecruiterProfile = async (profileData) => {
  const response = await api.put('/profile/recruiter', profileData);
  return response.data;
};