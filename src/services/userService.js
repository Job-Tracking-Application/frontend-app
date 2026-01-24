import api from './api';
export const getUserProfile = async () => {
  const response = await api.get('/profile/jobseeker');
  return response.data; // education is already an object
};

export const updateUserProfile = async (data) => {
  const response = await api.put('/profile/jobseeker', data);
  return response.data;
};
