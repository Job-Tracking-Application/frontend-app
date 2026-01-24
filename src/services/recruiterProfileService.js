import api from './api';

export const getRecruiterProfile = async () => {
  try {
    const response = await api.get('/profile/recruiter');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateRecruiterProfile = async (profileData) => {
  try {
    const response = await api.put('/profile/recruiter', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};