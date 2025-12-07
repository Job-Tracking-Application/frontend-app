import React, { createContext, useContext, useState } from "react";


const AuthContext = createContext();


export function useAuth() {
    return useContext(AuthContext);
}


export default function AuthProvider({ children }) {
    // Dummy initial: logged out
    const [user, setUser] = useState(null);


    const login = ({ email, password, role = "jobseeker" }) => {
        // For now, just set a dummy user object. In real app call API.
        const dummyUser = { id: 1, name: email.split('@')[0], email, role };
        setUser(dummyUser);
        return dummyUser;
    };


    const logout = () => {
        setUser(null);
    };


    const isAuthenticated = !!user;


    const value = { user, isAuthenticated, login, logout, setUser };


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}