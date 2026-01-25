import api from "./api";
import { setAuthToken, getAuthToken, clearAuthCookies } from "../utils/cookies";

export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await api.post("/auth/register", registerData);
  return response.data;
};

export const setStoredToken = (token) => {
  // Only store the JWT token - never store user data in cookies
  setAuthToken(token, 7); // Store for 7 days
};

export const getStoredToken = () => {
  return getAuthToken();
};

export const logout = () => {
  // Clear only the token cookie
  clearAuthCookies();
};

export const getCurrentUser = async () => {
  // Always fetch fresh user data from backend
  const response = await api.get("/auth/me");
  return response.data;
};