import api from './api';

// Get recruiter dashboard stats
export const getRecruiterStats = async () => {
  const response = await api.get('/dashboard/recruiter/stats');
  return response.data;
};

// Get job seeker dashboard stats
export const getJobSeekerStats = async () => {
  const response = await api.get('/dashboard/jobseeker/stats');
  return response.data;
};

// Get admin dashboard stats
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};