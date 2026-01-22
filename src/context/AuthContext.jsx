import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async ({ email, password }) => {
        try {
            const response = await authService.loginUser(email, password);
            const { token, userId, roleId } = response;

            // Map roleId to role name
            const role = mapRoleIdToName(roleId);

            const userData = {
                id: userId,
                email,
                roleId,
                role,
            };

            // Store token and user
            authService.setStoredAuth(token, userData);
            setToken(token);
            setUser(userData);

            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!user && !!token;

    // Map roleId to role name
    const mapRoleIdToName = (roleId) => {
        switch (roleId) {
            case 1:
                return "admin";
            case 2:
                return "recruiter";
            case 3:
                return "jobseeker";
            default:
                return "jobseeker";
        }
    };

    const value = {
        user,
        token,
        isAuthenticated,
        login,
        logout,
        setUser,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}