import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// layout
import Layout from "../components/layout/Layout";

// pages
import JobSeekerDashboard from "../pages/dashboard/JobSeekerDashboard";
import RecruiterDashboard from "../pages/dashboard/RecruiterDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCompanies from "../pages/admin/ManageCompanies";
import ManageJobs from "../pages/admin/ManageJobs";
import ViewLogs from "../pages/admin/ViewLogs";
import LanguageSettings from "../pages/settings/LanguageSettings";
import JobList from "../pages/jobs/JobList";
import JobDetails from "../pages/jobs/JobDetails";
import CreateJob from "../pages/jobs/CreateJob";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected area uses Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>

          {/* Dashboard - visible to all, redirects based on role or shows default */}
          <Route path="/dashboard" element={<RoleRoute allowedRoles={["jobseeker", "recruiter", "admin"]} />}>
            <Route index element={<Navigate to="/dashboard/default" replace />} />
            <Route path="default" element={<div className="p-4">Select your dashboard from menu.</div>} />
            <Route path="jobseeker" element={<JobSeekerDashboard />} />
            <Route path="recruiter" element={<RecruiterDashboard />} />
          </Route>

          {/* Job Routes */}
          <Route element={<RoleRoute allowedRoles={["jobseeker", "recruiter", "admin"]} />}>
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
            <Route path="/jobs/create" element={<CreateJob />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/companies" element={<ManageCompanies />} />
            <Route path="/admin/jobs" element={<ManageJobs />} />
            <Route path="/admin/logs" element={<ViewLogs />} />
          </Route>

          {/* Settings */}
          <Route path="/settings" element={<LanguageSettings />} />

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
