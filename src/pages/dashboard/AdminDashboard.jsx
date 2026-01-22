import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService"
import PageHero from "../../components/common/PageHero";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await getAdminStats();

        if (mounted && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
        if (mounted) setError("Unable to load admin statistics");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();
    return () => (mounted = false);
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  return (
    <div>
      <PageHero
        title="Admin Dashboard"
        subtitle="System overview and statistics"
      />

      <div className="container pb-5">
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <div className="row g-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="bi-people"
          />
          <StatCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon="bi-briefcase"
          />
          <StatCard
            title="Total Companies"
            value={stats.totalCompanies}
            icon="bi-buildings"
          />
          <StatCard
            title="Total Applications"
            value={stats.totalApplications}
            icon="bi-file-earmark-text"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="col-md-6 col-lg-3">
    <div className="card shadow-sm border-0 rounded-4 h-100">
      <div className="card-body text-center">
        <i className={`bi ${icon} fs-2 text-primary mb-2`} />
        <h6 className="text-muted">{title}</h6>
        <h3 className="fw-bold">{value}</h3>
      </div>
    </div>
  </div>
);

export default AdminDashboard;