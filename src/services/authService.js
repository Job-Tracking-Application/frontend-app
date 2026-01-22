import api from "./api";

export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
};

export const registerUser = async (registerData) => {
    const response = await api.post("/auth/register", registerData);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getStoredToken = () => {
    return localStorage.getItem("token");
};

export const getStoredUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const setStoredAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};
