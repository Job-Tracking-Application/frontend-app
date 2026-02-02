import api from './api';

export const getSummaryReport = async () => {
  try {
    const response = await api.get('/admin/reports/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching summary report:', error);
    throw error;
  }
};

export const getMatrixReport = async () => {
  try {
    const response = await api.get('/admin/reports/matrix');
    return response.data;
  } catch (error) {
    console.error('Error fetching matrix report:', error);
    throw error;
  }
};