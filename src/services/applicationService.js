import api from './api';

export const getMyApplications = async () => {
  const response = await api.get('/applications/me');
  return response.data;
};

export const getApplicationsForJob = async (jobId) => {
  try {
    const response = await api.get(`/applications/job/${jobId}`);
    // Handle different response types
    if (response.status === 204) {
      return []; // No content, return empty array
    }
    
    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If it's wrapped in an ApiResponse object
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // If it's wrapped in an ApiResponse but data is null/undefined
    if (response.data && response.data.success === false) {
      return [];
    }
    
    // Fallback: return empty array if data structure is unexpected
    return [];
  } catch (error) {
    return []; // Return empty array on error
  }
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/manage/${id}`, { status });
  return response.data;
};

export const applyForJob = async (jobId, applicationData) => {
  const response = await api.post(`/applications/${jobId}`, applicationData);
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

export const checkApplicationExists = async (jobId) => {
  const response = await api.get(`/applications/check/${jobId}`);
  return response.data;
};