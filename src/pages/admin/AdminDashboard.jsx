import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        if (mounted) setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Admin Dashboard</h1>

      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Total Users</p>
              <h2 className="h2">{stats?.totalUsers ?? 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Total Companies</p>
              <h2 className="h2">{stats?.totalCompanies ?? 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Total Jobs</p>
              <h2 className="h2">{stats?.totalJobs ?? 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <p className="text-muted mb-1">Total Applications</p>
              <h2 className="h2">{stats?.totalApplications ?? 0}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;