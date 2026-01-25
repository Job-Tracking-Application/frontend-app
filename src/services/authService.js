import api from "./api";


export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await api.post("/auth/register", registerData);
  return response.data;
};


export const setStoredToken = (token) => {
  localStorage.setItem("token", token);
};

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
