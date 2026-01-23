import api from './api';

export const getMyApplications = async () => {
  const response = await api.get('/applications/me');
  return response.data;
};

export const getApplicationsForJob = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.put(`/applications/${id}/status`, { status });
  return response.data;
};

export const applyForJob = async (jobId, applicationData) => {
  const response = await api.post(`/applications/apply/${jobId}`, applicationData);
  return response.data;
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

export const withdrawApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};