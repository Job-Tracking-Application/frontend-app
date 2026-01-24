import api from './api';

export const getUserProfile = async () => {
  const response = await api.get('/profile/jobseeker');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/profile/jobseeker', profileData);
  return response.data;
};
