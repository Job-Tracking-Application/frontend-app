import api from "./api";

// Get company profile by ID (public access)
export const getCompanyById = async (companyId) => {
  return api.get(`/api/organization/${companyId}`);
};

// Get current recruiter's company profile
export const getMyCompanyProfile = async () => {
  return api.get("/api/organization/my");
};

// Create company profile (recruiter only)
export const createCompanyProfile = async (companyData) => {
  return api.post("/api/organization", companyData);
};

// Update company profile (recruiter only)
export const updateCompanyProfile = async (companyId, companyData) => {
  return api.put(`/api/organization/${companyId}`, companyData);
};

// Check if recruiter has a company profile
export const hasCompanyProfile = async () => {
  return api.get("/api/organization/exists");
};

// Legacy method for backward compatibility - now uses real API
export const getCompanyProfile = async () => {
  try {
    const response = await getMyCompanyProfile();
    return response.data.data; // Extract data from ApiResponse wrapper
  } catch (error) {
    // Return mock data if no company profile exists (for demo purposes)
    return {
      companyName: "TechSoft Innovations Pvt. Ltd.",
      address: "2nd Floor, Cyber Park, Pune, Maharashtra, India",
      email: "techsoft@gmail.com",
      website: "https://techsoft.in",
      description: "TechSoft Innovations is a leading provider of enterprise software solutions, specializing in cloud products, AI-driven automation, and scalable web applications."
    };
  }
};


