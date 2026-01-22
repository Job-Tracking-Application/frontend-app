import api from "./api";

export const getApplications = (page = 0, size = 10, status = null) => {
  let url = `/admin/applications?page=${page}&size=${size}`;
  if (status) url += `&status=${status}`;
  return api.get(url);
};

export const getApplicationById = (id) => {
  return api.get(`/admin/applications/${id}`);
};

export const deleteApplication = (id) => {
  return api.delete(`/admin/applications/${id}`);
};