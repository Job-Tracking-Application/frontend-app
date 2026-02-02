import api from './api';

export const getJobs = async () => {
    const response = await api.get('/jobs');
    return response.data;
};

export const getMyJobs = async () => {
    const response = await api.get('/recruiter/jobs/my-jobs');
    return response.data;
};

export const getJobById = async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
};

export const addJob = async (jobData, skillIds = []) => {
    // Create query string for skillIds
    const skillParams = skillIds.length > 0 ? `?${skillIds.map(id => `skillIds=${id}`).join('&')}` : '';
    
    const response = await api.post(`/jobs${skillParams}`, jobData);
    return response.data;
};

export const updateJob = async (id, jobData, skillIds = []) => {
    const skillParams = skillIds.length > 0 ? `?${skillIds.map(id => `skillIds=${id}`).join('&')}` : '';
    
    const response = await api.put(`/jobs/${id}${skillParams}`, jobData);
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
};