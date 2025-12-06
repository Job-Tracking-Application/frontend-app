import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";


// auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


// layout + pages
import App from "../App";
import JobSeekerDashboard from "../pages/dashboard/JobSeekerDashboard";
import RecruiterDashboard from "../pages/dashboard/RecruiterDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";


export default function Router(){
return (
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />


{/* Protected area uses App layout */}
<Route element={<ProtectedRoute />}>
<Route element={<App />}>
{/* Dashboard visible to all roles, component can branch internally if needed */}
<Route path="/dashboard" element={<RoleRoute allowedRoles={["jobseeker","recruiter","admin"]} />}>
{/* nested role selection route */}
<Route index element={<Navigate to="/dashboard/default" replace />} />
<Route path="default" element={<div className="p-4">Select your dashboard from menu.</div>} />
</Route>


{/* Jobseeker specific */}
<Route element={<RoleRoute allowedRoles={["jobseeker"]} />}>
<Route path="/dashboard/jobseeker" element={<JobSeekerDashboard />} />
</Route>


{/* Recruiter specific */}
<Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
<Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
</Route>


{/* Admin */}
<Route element={<RoleRoute allowedRoles={["admin"]} />}>
<Route path="/admin" element={<AdminDashboard />} />
</Route>


{/* Fallback protected route */}
<Route path="/" element={<Navigate to="/dashboard" replace />} />
</Route>
</Route>


{/* catch-all */}
<Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
);
}