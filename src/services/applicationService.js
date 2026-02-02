import api from './api';

export const getMyApplications = async () => {
  try {
    const response = await api.get('/applications/me');
    
    // Handle ApiResponse wrapper structure
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && response.data.success === false) {
      return [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching my applications:', error);
    throw error;
  }
};

export const getApplicationsForJob = async (jobId) => {
  try {
    const response = await api.get(`/applications/job/${jobId}`);

    if (response.status === 204) {
      return [];
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (response.data && response.data.success === false) {
      return [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching applications for job:', error);
    throw error; // Re-throw to let the component handle it
  }
};

export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await api.patch(`/applications/manage/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating application status:', error);
    
    // Provide more specific error messages
    if (error.response?.status === 404) {
      throw new Error('Application not found');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to update this application');
    } else if (error.response?.status === 400) {
      throw new Error('Invalid status provided');
    }
    
    throw error; // Re-throw original error if no specific handling
  }
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