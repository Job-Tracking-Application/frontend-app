import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import PageHero from "../../components/common/PageHero";

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

  if (loading) return <div className="p-5 text-center">Loading admin stats...</div>;

  return (
    <div>
      <PageHero title="Admin Portal" subtitle="System analytics and management overview." />

      <div className="container pb-5">
        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                  <i className="bi bi-people fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">Total Users</p>
                  <h2 className="h3 fw-bold mb-0">{stats?.totalUsers ?? 0}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                  <i className="bi bi-building fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">Companies</p>
                  <h2 className="h3 fw-bold mb-0">{stats?.totalCompanies ?? 0}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                  <i className="bi bi-briefcase fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">Active Jobs</p>
                  <h2 className="h3 fw-bold mb-0">{stats?.totalJobs ?? 0}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3 text-info">
                  <i className="bi bi-file-text fs-4"></i>
                </div>
                <div>
                  <p className="text-muted mb-0 small text-uppercase fw-bold">Applications</p>
                  <h2 className="h3 fw-bold mb-0">{stats?.totalApplications ?? 0}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
