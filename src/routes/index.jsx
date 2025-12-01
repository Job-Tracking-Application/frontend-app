import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCompanies from "../pages/admin/ManageCompanies";
import ManageJobs from "../pages/admin/ManageJobs";
import ViewLogs from "../pages/admin/ViewLogs";
import LanguageSettings from "../pages/settings/LanguageSettings";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/companies" element={<ManageCompanies />} />
        <Route path="/admin/jobs" element={<ManageJobs />} />
        <Route path="/admin/logs" element={<ViewLogs />} />

        {/* Settings */}
        <Route path="/settings" element={<LanguageSettings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;