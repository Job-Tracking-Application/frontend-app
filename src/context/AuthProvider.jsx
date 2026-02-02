import { useState, useEffect } from "react";
import * as authService from "../services/authService";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token on refresh
  useEffect(() => {
    const storedToken = authService.getStoredToken();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    // Validate token with backend and get fresh user data
    authService
      .getCurrentUser()
      .then((userData) => {
        // Map the secure response to match frontend expectations
        const mappedUser = {
          roleId: userData.roleId,
          role: userData.role,
          displayName: userData.displayName,
          fullname: userData.displayName, // Map displayName to fullname for consistency
          maskedEmail: userData.maskedEmail,
          email: userData.maskedEmail, // Also map to email for fallback
          active: userData.active,
          languagePref: userData.languagePref,
          accountType: userData.accountType
        };
        setUser(mappedUser);
      })
      .catch((error) => {
        console.warn("Token validation failed:", error.response?.status);
        // Clear invalid token
        authService.logout();
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const mapRoleIdToName = (roleId) => {
    switch (roleId) {
      case 1: return "ADMIN";
      case 2: return "RECRUITER";
      case 3: return "JOB_SEEKER";
      default: return "JOB_SEEKER";
    }
  };

  const login = async ({ email, password }) => {
    const response = await authService.loginUser(email, password);
    const { token, userId, roleId, fullname, email: userEmail } = response;

    const userData = {
      id: userId,
      email: userEmail || email,
      roleId,
      role: mapRoleIdToName(roleId),
      fullname,
    };

    // Store only the token, user data will be fetched from /auth/me on refresh
    authService.setStoredToken(token);

    setToken(token);
    setUser(userData);

    return userData;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}