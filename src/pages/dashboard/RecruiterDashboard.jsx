import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import { getRecruiterStats } from "../../services/dashboardService";
import { getJobs } from "../../services/jobService";
import { showErrorToast } from "../../utils/toast";

export default function RecruiterDashboard() {
    const [stats, setStats] = useState({
        activeJobs: 0,
        pendingApplications: 0,
        hiredCandidates: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Try to get stats from dedicated endpoint first
            try {
                const response = await getRecruiterStats();
                setStats(response.data);
            } catch (statsError) {
                // Fallback: Calculate stats from jobs endpoint
                const jobsResponse = await getJobs();
                const jobs = jobsResponse.data || [];
                
                // Calculate basic stats from jobs data
                const activeJobs = jobs.filter(job => job.isActive !== false).length;
                
                setStats({
                    activeJobs: activeJobs,
                    pendingApplications: 0, // Would need applications endpoint
                    hiredCandidates: 0      // Would need applications endpoint
                });
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            setError("Failed to load dashboard data");
            showErrorToast("Failed to load dashboard data from backend");
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, color, icon }) => (
        <div className="col-md-4">
            <div className={`card shadow-sm p-3 h-100 border-start border-4 border-${color}`}>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-muted text-uppercase mb-2">{title}</h6>
                            {loading ? (
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <h2 className="display-5 fw-bold mb-0">{value}</h2>
                            )}
                        </div>
                        {icon && <i className={`bi ${icon} fs-1 text-${color} opacity-25`}></i>}
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div>
                <PageHero title="Recruiter Dashboard" subtitle="Post jobs and manage candidates efficiently." />
                <div className="container pb-5">
                    <div className="alert alert-danger border-0 shadow-sm rounded-3 p-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                        <button 
                            className="btn btn-outline-danger btn-sm ms-3"
                            onClick={loadDashboardData}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHero title="Recruiter Dashboard" subtitle="Post jobs and manage candidates efficiently." />

            <div className="container pb-5">
                <div className="row g-4">
                    {/* Quick Stats */}
                    <StatCard 
                        title="Active Jobs" 
                        value={stats.activeJobs} 
                        color="primary" 
                        icon="bi-briefcase"
                    />
                    
                    <StatCard 
                        title="Pending Applications" 
                        value={stats.pendingApplications} 
                        color="warning" 
                        icon="bi-clock"
                    />
                    
                    <StatCard 
                        title="Hired Candidates" 
                        value={stats.hiredCandidates} 
                        color="success" 
                        icon="bi-check-circle"
                    />

                    {/* Actions */}
                    <div className="col-12 mt-4">
                        <h4 className="fw-bold mb-3">Quick Actions</h4>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <Link to="/jobs/create" className="btn btn-primary w-100 py-3 fw-medium shadow-sm">
                                    <i className="bi bi-plus-circle me-2"></i> Post New Job
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/applications/manage" className="btn btn-outline-dark w-100 py-3 fw-medium shadow-sm">
                                    <i className="bi bi-people me-2"></i> Manage Applications
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/profile" className="btn btn-outline-secondary w-100 py-3 fw-medium shadow-sm">
                                    <i className="bi bi-building me-2"></i> Company Profile
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <button 
                                    className="btn btn-outline-info w-100 py-3 fw-medium shadow-sm"
                                    onClick={loadDashboardData}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i> 
                                    {loading ? "Refreshing..." : "Refresh Stats"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}