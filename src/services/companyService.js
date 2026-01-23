import api from "./api";

// Get all companies (for job posting dropdown)
export const getCompanies = async () => {
  const response = await api.get("/organizations");
  return response.data;
};

// Get company profile by ID (public access)
export const getCompanyById = async (companyId) => {
  return api.get(`/organizations/${companyId}`);
};

// Get current recruiter's company profile
export const getMyCompanyProfile = async () => {
  return api.get("/organizations/my");
};

// Create company profile (recruiter only)
export const createCompanyProfile = async (companyData) => {
  return api.post("/organizations", companyData);
};

// Update company profile (recruiter only)
export const updateCompanyProfile = async (companyId, companyData) => {
  return api.put(`/organizations/${companyId}`, companyData);
};

// Check if recruiter has a company profile
export const hasCompanyProfile = async () => {
  return api.get("/organizations/exists");
};

// Legacy method for backward compatibility - now uses real API
export const getCompanyProfile = async () => {
  const response = await getMyCompanyProfile();
  return response.data.data; // Extract data from ApiResponse wrapper
};