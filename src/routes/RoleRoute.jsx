import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


// Usage: <Route element={<RoleRoute allowedRoles={["admin"]} />}>
export default function RoleRoute({ allowedRoles = [] }){
const { user } = useAuth();
const role = user?.role;
if(!user) return <Navigate to="/login" replace />;
if(allowedRoles.length && !allowedRoles.includes(role)){
return <Navigate to="/dashboard" replace />;
}
return <Outlet />;
}