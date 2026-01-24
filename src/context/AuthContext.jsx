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
            const { token, userId, roleId, fullname, email: userEmail } = response;

            // Map roleId to role name
            const role = mapRoleIdToName(roleId);

            const userData = {
                id: userId,
                email: userEmail || email,
                roleId,
                role,
                fullname,
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

    // Map roleId to role name (must match backend RoleMapper)
    const mapRoleIdToName = (roleId) => {
        switch (roleId) {
            case 1:
                return "ADMIN";
            case 2:
                return "RECRUITER";
            case 3:
                return "JOB_SEEKER";
            default:
                return "JOB_SEEKER";
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