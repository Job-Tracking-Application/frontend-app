import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { useAuth } from "../context/AuthContext";

// auth pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminLogin from "../pages/auth/AdminLogin";

// layout
import Layout from "../components/layout/Layout";

// pages
import JobSeekerDashboard from "../pages/dashboard/JobSeekerDashboard";
import RecruiterDashboard from "../pages/dashboard/RecruiterDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCompanies from "../pages/admin/ManageCompanies";
import ManageJobs from "../pages/admin/ManageJobs";
import ViewLogs from "../pages/admin/ViewLogs";
import LanguageSettings from "../pages/settings/LanguageSettings";
import JobList from "../pages/jobs/JobList";
import JobDetails from "../pages/jobs/JobDetails";
import CreateJob from "../pages/jobs/CreateJob";
import EditJob from "../pages/jobs/EditJob";
import MyJobs from "../pages/jobs/MyJobs";

import MyApplications from "../pages/applications/MyApplications";
import ManageApplications from "../pages/applications/ManageApplications";
import ApplyJob from "../pages/applications/ApplyJob";
import AdminManageApplications from "../pages/admin/ManageApplications";
import JobSeekerProfile from "../pages/profile/JobSeekerProfile";
import RecruiterProfile from "../pages/profile/RecruiterProfile";

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
  if (user.role === 'RECRUITER') return <Navigate to="/dashboard/recruiter" replace />;
  // Default to jobseeker
  return <Navigate to="/dashboard/jobseeker" replace />;
};

export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected area uses Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>

          {/* Dashboard - visible to all, redirects based on role or shows default */}
          <Route path="/dashboard" element={<RoleRoute allowedRoles={["JOB_SEEKER", "RECRUITER", "ADMIN"]} />}>
            {/* Dashboard Redirect Logic */}
            <Route index element={<DashboardRedirect />} />
            <Route path="default" element={<div className="p-4">Select your dashboard from menu.</div>} />
            <Route path="jobseeker" element={<JobSeekerDashboard />} />
            <Route path="recruiter" element={<RecruiterDashboard />} />
          </Route>

          {/* Job Routes */}
          <Route element={<RoleRoute allowedRoles={["JOB_SEEKER", "RECRUITER", "ADMIN"]} />}>
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["JOB_SEEKER"]} />}>
            <Route path="/jobs/:id/apply" element={<ApplyJob />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["RECRUITER"]} />}>
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/jobs/edit/:id" element={<EditJob />} />
            <Route path="/jobs/my-jobs" element={<MyJobs />} />
            <Route path="/applications/manage" element={<ManageApplications />} />
          </Route>

          {/* Applications & Profile */}
          <Route element={<RoleRoute allowedRoles={["JOB_SEEKER", "RECRUITER", "ADMIN"]} />}>
            <Route path="/profile" element={user?.role === 'RECRUITER' ? <RecruiterProfile /> : <JobSeekerProfile />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["JOB_SEEKER"]} />}>
            <Route path="/applications" element={<MyApplications />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/dashboard/admin/" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/companies" element={<ManageCompanies />} />
            <Route path="/admin/jobs" element={<ManageJobs />} />
            <Route path="/admin/applications" element={<AdminManageApplications />} />
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
