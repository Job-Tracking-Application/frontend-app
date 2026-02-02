import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService"
import { getSummaryReport, getMatrixReport } from "../../services/reportService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });
  const [summaryReport, setSummaryReport] = useState(null);
  const [matrixReport, setMatrixReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        // Fetch each API separately to identify which one is failing
        let statsRes, summaryRes, matrixRes;
        
        try {
          statsRes = await getAdminStats();
        } catch (err) {
          console.error("Failed to fetch admin stats:", err);
          statsRes = { data: { data: { totalUsers: 0, totalJobs: 0, totalCompanies: 0, totalApplications: 0 } } };
        }
        
        try {
          summaryRes = await getSummaryReport();
        } catch (err) {
          console.error("Failed to fetch summary report:", err);
          summaryRes = null;
        }
        
        try {
          matrixRes = await getMatrixReport();
        } catch (err) {
          console.error("Failed to fetch matrix report:", err);
          matrixRes = null;
        }

        if (mounted) {
          // Handle ApiResponse wrapper - data is in statsRes.data.data
          if (statsRes?.data?.data) {
            setStats(statsRes.data.data);
          } else if (statsRes?.data) {
            // Fallback if response is not wrapped
            setStats(statsRes.data);
          }
          setSummaryReport(summaryRes);
          setMatrixReport(matrixRes);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (mounted) setError(t("Unable to load admin statistics"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [t]);

  if (loading) {
    return <div className="text-center py-5">{t("Loading dashboard...")}</div>;
  }

  return (
    <div>
      <PageHero
        title={t("Admin Dashboard")}
        subtitle={t("System overview and statistics")}
      />

      <div className="container pb-5">
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* Tab Navigation */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
          <div className="card-header bg-white p-0 border-bottom">
            <nav className="nav nav-tabs border-0">
              <button 
                className={`nav-link px-4 py-3 border-0 ${activeTab === 'overview' ? 'active bg-primary text-white' : 'text-muted'}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                {t("Overview")}
              </button>
              <button 
                className={`nav-link px-4 py-3 border-0 ${activeTab === 'analytics' ? 'active bg-primary text-white' : 'text-muted'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="bi bi-bar-chart me-2"></i>
                {t("Analytics")}
              </button>
              <button 
                className={`nav-link px-4 py-3 border-0 ${activeTab === 'performance' ? 'active bg-primary text-white' : 'text-muted'}`}
                onClick={() => setActiveTab('performance')}
              >
                <i className="bi bi-graph-up me-2"></i>
                {t("Performance")}
              </button>
            </nav>
          </div>

          <div className="card-body p-4">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} loading={loading} t={t} />
            )}
            {activeTab === 'analytics' && summaryReport && (
              <AnalyticsTab report={summaryReport} t={t} />
            )}
            {activeTab === 'performance' && matrixReport && (
              <PerformanceTab report={matrixReport} t={t} />
            )}
          </div>
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

const OverviewTab = ({ stats, loading, t }) => (
  <div>
    {loading ? (
      <div className="text-center py-5">{t("Loading dashboard...")}</div>
    ) : (
      <div className="row g-4">
        <StatCard
          title={t("Total Users")}
          value={stats.totalUsers}
          icon="bi-people"
        />
        <StatCard
          title={t("Total Jobs")}
          value={stats.totalJobs}
          icon="bi-briefcase"
        />
        <StatCard
          title={t("Total Companies")}
          value={stats.totalCompanies}
          icon="bi-buildings"
        />
        <StatCard
          title={t("Total Applications")}
          value={stats.totalApplications}
          icon="bi-file-earmark-text"
        />
      </div>
    )}
  </div>
);

const AnalyticsTab = ({ report, t }) => (
  <div>
    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white h-100">
          <div className="card-body text-center">
            <i className="bi bi-people fs-2 mb-2"></i>
            <h4>{report.overview.totalUsers}</h4>
            <small>{t("Total Users")}</small>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white h-100">
          <div className="card-body text-center">
            <i className="bi bi-briefcase fs-2 mb-2"></i>
            <h4>{report.overview.totalJobs}</h4>
            <small>{t("Total Jobs")}</small>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white h-100">
          <div className="card-body text-center">
            <i className="bi bi-buildings fs-2 mb-2"></i>
            <h4>{report.overview.totalCompanies}</h4>
            <small>{t("Total Companies")}</small>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white h-100">
          <div className="card-body text-center">
            <i className="bi bi-file-earmark-text fs-2 mb-2"></i>
            <h4>{report.overview.totalApplications}</h4>
            <small>{t("Total Applications")}</small>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-4">
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h6 className="mb-0">{t("User Breakdown")}</h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>{t("Active Users")}</span>
                <strong>{report.userBreakdown.active}</strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${(report.userBreakdown.active / report.overview.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span>{t("Inactive Users")}</span>
                <strong>{report.userBreakdown.inactive}</strong>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-danger" 
                  style={{ width: `${(report.userBreakdown.inactive / report.overview.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
            <hr />
            <h6>{t("By Role")}</h6>
            <div className="small">
              <div className="d-flex justify-content-between">
                <span>{t("Admins")}</span>
                <span>{report.userBreakdown.byRole.ADMIN}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>{t("Recruiters")}</span>
                <span>{report.userBreakdown.byRole.RECRUITER}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>{t("Job Seekers")}</span>
                <span>{report.userBreakdown.byRole.JOB_SEEKER}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h6 className="mb-0">{t("Application Status Breakdown")}</h6>
          </div>
          <div className="card-body">
            {Object.entries(report.applicationBreakdown).map(([status, count]) => (
              <div key={status} className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>{t(status.replace(/_/g, ' '))}</span>
                  <strong>{count}</strong>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${(count / report.overview.totalApplications) * 100}%`,
                      backgroundColor: getStatusColor(status)
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="text-muted text-center mt-4">
      <small>{t("Generated at")}: {new Date(report.generatedAt).toLocaleString()}</small>
    </div>
  </div>
);

const PerformanceTab = ({ report, t }) => (
  <div>
    <div className="row g-4 mb-4">
      <div className="col-md-4">
        <div className="card bg-light h-100">
          <div className="card-body text-center">
            <h5 className="text-primary">{report.systemMetrics.avgApplicationsPerJob}</h5>
            <small>{t("Avg Applications per Job")}</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-light h-100">
          <div className="card-body text-center">
            <h5 className="text-success">{report.systemMetrics.avgJobsPerCompany}</h5>
            <small>{t("Avg Jobs per Company")}</small>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-light h-100">
          <div className="card-body text-center">
            <h5 className="text-info">{report.systemMetrics.totalActiveJobs}</h5>
            <small>{t("Active Jobs")}</small>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-4">
      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h6 className="mb-0">{t("Top Companies")}</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>{t("Company")}</th>
                    <th>{t("Jobs")}</th>
                    <th>{t("Applications")}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.companyMatrix.slice(0, 5).map(company => (
                    <tr key={company.id}>
                      <td>
                        <div>
                          <strong>{company.name}</strong>
                          {company.verified && <i className="bi bi-check-circle-fill text-success ms-1"></i>}
                          <br />
                          <small className="text-muted">{company.city}</small>
                        </div>
                      </td>
                      <td>{company.jobCount}</td>
                      <td>{company.applicationCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card h-100">
          <div className="card-header">
            <h6 className="mb-0">{t("Top Jobs by Applications")}</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>{t("Job Title")}</th>
                    <th>{t("Applications")}</th>
                    <th>{t("Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.jobMatrix
                    .sort((a, b) => b.applicationCount - a.applicationCount)
                    .slice(0, 5)
                    .map(job => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                        <br />
                        <small className="text-muted">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-primary">{job.applicationCount}</span>
                      </td>
                      <td>
                        <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {job.isActive ? t("Active") : t("Inactive")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="text-muted text-center mt-4">
      <small>{t("Generated at")}: {new Date(report.generatedAt).toLocaleString()}</small>
    </div>
  </div>
);

const getStatusColor = (status) => {
  const colors = {
    'APPLIED': '#007bff',
    'UNDER_REVIEW': '#ffc107',
    'INTERVIEWED': '#17a2b8',
    'SHORTLISTED': '#28a745',
    'REJECTED': '#dc3545',
    'HIRED': '#28a745',
    'PENDING': '#6c757d'
  };
  return colors[status] || '#6c757d';
};

export default AdminDashboard;