import api from "./api";

export const getAdminStats = () => {
  return api.get("/admin/stats");
};

export const getUsers = () => {
  return api.get("/admin/users");
};

export const toggleUserStatus = (userId, active) => {
  return api.patch(`/admin/users/${userId}/status?active=${active}`);
};

export const changeUserRole = (userId, roleId) => {
  return api.patch(`/admin/users/${userId}/role?roleId=${roleId}`);
};

export const getJobs = () => {
  return api.get("/admin/jobs");
};

export const verifyJob = (jobId) => {
  return api.patch(`/admin/jobs/${jobId}/verify`);
};

export const deleteJob = (jobId) => {
  return api.delete(`/admin/jobs/${jobId}`);
};


export const getCompanies = () => {
  return api.get("/admin/companies");
};

export const verifyCompany = (companyId, verified) => {
  return api.patch(`/admin/companies/${companyId}/verify?verified=${verified}`);
};

export const getLogs = () => {
  return api.get("/admin/logs");
};
