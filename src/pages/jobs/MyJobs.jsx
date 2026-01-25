import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../services/jobService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { useLanguage } from "../../context/LanguageContext";

export default function MyJobs() {
    const { t } = useLanguage();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ show: false, job: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadMyJobs();
    }, []);

    const loadMyJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMyJobs();
            setJobs(response.data || []);
        } catch (error) {
            setError(t("load_jobs_error"));
            showErrorToast(t("load_jobs_error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (job) => {
        setDeleteModal({ show: true, job });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.job) return;

        try {
            setDeleting(true);
            await deleteJob(deleteModal.job.id);
            showSuccessToast(t("job_deleted"));
            setJobs(prev => prev.filter(j => j.id !== deleteModal.job.id));
        } catch (error) {
            showErrorToast(t("delete_job_error"));
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, job: null });
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return t("salary_not_specified");
        if (!max) return `₹${min?.toLocaleString()}+`;
        if (!min) return `${t("salary_upto")} ₹${max?.toLocaleString()}`;
        return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
    };

    const formatExperience = (min, max) => {
        if (!min && !max) return t("experience_not_specified");
        if (!max) return `${min}+ ${t("years")}`;
        if (!min) return `${t("upto")} ${max} ${t("years")}`;
        if (min === max) return `${min} ${t("years")}`;
        return `${min} - ${max} ${t("years")}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4>{t("error_loading_jobs")}</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={loadMyJobs}>
                        {t("try_again")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{t("my_job_postings")}</h2>
                <Link to="/jobs/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    {t("post_new_job")}
                </Link>
            </div>

            {jobs.length === 0 ? (
                <EmptyState
                    title={t("no_jobs_posted_title")}
                    message={t("no_jobs_posted_msg")}
                    actionText={t("post_first_job")}
                    actionLink="/jobs/create"
                    icon="fas fa-briefcase"
                />
            ) : (
                <div className="row">
                    {jobs.map(job => (
                        <div key={job.id} className="col-lg-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">

                                    {/* TITLE + STATUS */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="mb-0">{job.title}</h5>

                                        {/* ✅ FIXED STATUS BADGE */}
                                        <span
                                            className={`badge ${job.isActive ? "bg-success" : "bg-secondary"}`}
                                            style={{
                                                padding: "4px 10px",
                                                fontSize: "0.75rem",
                                                borderRadius: "12px",
                                                lineHeight: "1",
                                                whiteSpace: "nowrap"
                                            }}
                                        >
                                            {job.isActive ? t("status_active") : t("status_inactive")}
                                        </span>
                                    </div>

                                    <p className="text-truncate">{job.description}</p>

                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <strong>{t("salary")}:</strong><br />
                                            {formatSalary(job.minSalary, job.maxSalary)}
                                        </div>
                                        <div className="col-6">
                                            <strong>{t("experience")}:</strong><br />
                                            {formatExperience(job.minExperience, job.maxExperience)}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <small>
                                            {t("posted_on")}: {formatDate(job.postedAt)}
                                        </small>

                                        <div className="btn-group">
                                            <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm">
                                                {t("view")}
                                            </Link>
                                            <Link to={`/jobs/edit/${job.id}`} className="btn btn-outline-secondary btn-sm">
                                                {t("edit")}
                                            </Link>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteClick(job)}
                                            >
                                                {t("delete")}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmationModal
                show={deleteModal.show}
                title={t("delete_job_confirm_title")}
                message={t("delete_job_confirm_message", { title: deleteModal.job?.title })}
                confirmText={t("delete")}
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModal({ show: false, job: null })}
                loading={deleting}
            />
        </div>
    );
}
