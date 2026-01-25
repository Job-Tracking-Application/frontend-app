import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import { getRecruiterStats } from "../../services/dashboardService";
import { getJobs } from "../../services/jobService";
import { showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/LanguageContext";

export default function RecruiterDashboard() {
    const { t } = useLanguage();

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

            try {
                const response = await getRecruiterStats();
                setStats(response.data);
            } catch {
                const jobsResponse = await getJobs();
                const jobs = jobsResponse.data || [];

                const activeJobs = jobs.filter(job => job.isActive !== false).length;

                setStats({
                    activeJobs,
                    pendingApplications: 0,
                    hiredCandidates: 0
                });
            }
        } catch (err) {
            setError(t("dashboard_error"));
            showErrorToast(t("dashboard_error_backend"));
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
                                    <span className="visually-hidden">{t("loading")}</span>
                                </div>
                            ) : (
                                <h2 className="display-5 fw-bold mb-0">{value}</h2>
                            )}
                        </div>
                        <i className={`bi ${icon} fs-1 text-${color} opacity-25`}></i>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <>
                <PageHero
                    title={t("recruiter_dashboard_title")}
                    subtitle={t("recruiter_dashboard_subtitle")}
                />

                <div className="container pb-5">
                    <div className="alert alert-danger shadow-sm d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                        <button
                            className="btn btn-outline-danger btn-sm ms-3"
                            onClick={loadDashboardData}
                        >
                            {t("retry")}
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHero
                title={t("recruiter_dashboard_title")}
                subtitle={t("recruiter_dashboard_subtitle")}
            />

            <div className="container pb-5">
                <div className="row g-4">
                    {/* Stats */}
                    <StatCard
                        title={t("active_jobs")}
                        value={stats.activeJobs}
                        color="primary"
                        icon="bi-briefcase"
                    />

                    <StatCard
                        title={t("pending_applications")}
                        value={stats.pendingApplications}
                        color="warning"
                        icon="bi-clock"
                    />

                    <StatCard
                        title={t("hired_candidates")}
                        value={stats.hiredCandidates}
                        color="success"
                        icon="bi-check-circle"
                    />

                    {/* Quick Actions */}
                    <div className="col-12 mt-4">
                        <h4 className="fw-bold mb-3">{t("quick_actions")}</h4>

                        <div className="row g-3">
                            <div className="col-md-3">
                                <Link
                                    to="/jobs/create"
                                    className="btn btn-primary w-100 py-3 shadow-sm"
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    {t("post_new_job")}
                                </Link>
                            </div>

                            <div className="col-md-3">
                                <Link
                                    to="/applications/manage"
                                    className="btn btn-outline-dark w-100 py-3 shadow-sm"
                                >
                                    <i className="bi bi-people me-2"></i>
                                    {t("manage_applications")}
                                </Link>
                            </div>

                            <div className="col-md-3">
                                <Link
                                    to="/profile"
                                    className="btn btn-outline-secondary w-100 py-3 shadow-sm"
                                >
                                    <i className="bi bi-building me-2"></i>
                                    {t("company_profile")}
                                </Link>
                            </div>

                            <div className="col-md-3">
                                <button
                                    className="btn btn-outline-info w-100 py-3 shadow-sm"
                                    onClick={loadDashboardData}
                                    disabled={loading}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                    {loading ? t("refreshing") : t("refresh_stats")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
