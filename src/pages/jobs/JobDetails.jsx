import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById, deleteJob } from "../../services/jobService";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import ConfirmationModal from "../../components/common/ConfirmationModal";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isRecruiter = user?.role === 'RECRUITER';
    const isJobSeeker = user?.role === 'JOB_SEEKER';
    const isOwner = isRecruiter && job?.recruiterUserId === user?.id;

    const loadJob = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getJobById(id);
            setJob(response.data);
        } catch (error) {
            console.error("Error loading job:", error);
            setError(t("job_load_error"));
            showErrorToast(t("job_load_error"));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadJob();
        }
    }, [id, loadJob]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteJob(id);
            showSuccessToast(t("job_delete_success"));
            navigate("/jobs/my-jobs");
        } catch (error) {
            console.error("Error deleting job:", error);
            showErrorToast(t("job_delete_error"));
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const handleApply = () => {
        // Redirect to application form instead of direct apply
        navigate(`/jobs/${id}/apply`);
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return t("salary_not_specified");
        if (!max) return `₹${min?.toLocaleString()}+`;
        if (!min) return `${t("up_to")} ₹${max?.toLocaleString()}`;
        return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
    };

    const formatExperience = (min, max) => {
        if (!min && !max) return t("experience_not_specified");
        if (!max) return `${min}+ ${t("years")}`;
        if (!min) return `${t("up_to")} ${max} ${t("years")}`;
        if (min === max) return `${min} ${t("years")}`;
        return `${min} - ${max} ${t("years")}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return t("not_specified");
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <Loader />;

    if (error || !job) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">{t("error_loading_job")}</h4>
                    <p>{error || t("job_not_found")}</p>
                    {isRecruiter ? (
                        <Link to="/jobs/my-jobs" className="btn btn-outline-danger">
                            {t("back_to_my_jobs")}
                        </Link>
                    ) : (
                        <Link to="/jobs" className="btn btn-outline-danger">
                            {t("back_to_jobs")}
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h1 className="h3 mb-2">{job.title}</h1>
                                    <div className="text-muted mb-3">
                                        <i className="fas fa-building me-2"></i>
                                        {job.companyName || t("company_not_specified")}
                                        {job.location && (
                                            <>
                                                <i className="fas fa-map-marker-alt ms-3 me-2"></i>
                                                {job.location}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span className={`badge fs-6 ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                    {job.isActive ? t("status_active") : t("status_inactive")}
                                </span>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted mb-1">{t("salary_range")}</h6>
                                        <div className="h5 text-success mb-0">
                                            {formatSalary(job.minSalary, job.maxSalary)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted mb-1">{t("experience")}</h6>
                                        <div className="h5 text-info mb-0">
                                            {formatExperience(job.minExperience, job.maxExperience)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted mb-1">{t("job_type")}</h6>
                                        <div className="h5 text-primary mb-0">{job.jobType}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>{t("job_description")}</h5>
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                                        {job.description}
                                    </p>
                                </div>
                            </div>

                            {/* Skills Section */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="mb-4">
                                    <h5>{t("required_skills")}</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span 
                                                key={skill.id || index} 
                                                className="badge bg-primary-subtle text-primary px-3 py-2"
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6>{t("posted_date")}</h6>
                                    <p className="text-success">
                                        <i className="fas fa-calendar-plus me-2"></i>
                                        {formatDate(job.postedAt)}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h6>{t("application_deadline")}</h6>
                                    {job.deadline ? (
                                        <p className="text-warning fw-bold">
                                            <i className="fas fa-calendar-alt me-2"></i>
                                            {formatDate(job.deadline)}
                                        </p>
                                    ) : (
                                        <p className="text-muted fst-italic">
                                            <i className="fas fa-calendar-times me-2"></i>
                                            {t("no_deadline")}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                {/* Back button - different for each role */}
                                {isRecruiter ? (
                                    <Link to="/jobs/my-jobs" className="btn btn-outline-secondary">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        {t("back_to_my_jobs")}
                                    </Link>
                                ) : (
                                    <Link to="/jobs" className="btn btn-outline-secondary">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        {t("back_to_jobs")}
                                    </Link>
                                )}

                                {/* Role-specific action buttons */}
                                {isJobSeeker && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={handleApply}
                                    >
                                        <i className="fas fa-paper-plane me-2"></i>
                                        {t("apply_for_job")}
                                    </button>
                                )}

                                {isOwner && (
                                    <>
                                        <Link 
                                            to={`/jobs/edit/${job.id}`} 
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="fas fa-edit me-2"></i>
                                            {t("edit_job")}
                                        </Link>
                                        <button 
                                            className="btn btn-outline-danger"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            <i className="fas fa-trash me-2"></i>
                                            {t("delete_job")}
                                        </button>
                                    </>
                                )}

                                {isRecruiter && !isOwner && (
                                    <div className="text-muted fst-italic">
                                        <i className="fas fa-info-circle me-2"></i>
                                        {t("recruiter_edit_warning")}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">{t("job_information")}</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <strong>{t("job_id")}:</strong> {job.id}
                                </li>
                                <li className="mb-2">
                                    <strong>{t("recruiter_id")}:</strong> {job.recruiterUserId}
                                </li>
                                <li className="mb-2">
                                    <strong>{t("created")}:</strong> {formatDate(job.createdAt)}
                                </li>
                                <li className="mb-2">
                                    <strong>{t("last_updated")}:</strong> {formatDate(job.updatedAt)}
                                </li>
                                <li className="mb-2">
                                    <strong>{t("status")}:</strong> 
                                    <span className={`ms-2 badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                        {job.isActive ? t("status_active") : t("status_inactive")}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showDeleteModal}
                title={t("delete_job_confirm_title")}
                message={t("delete_job_confirm_message", { title: job.title })}
                confirmText={t("delete")}
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={deleting}
            />
        </div>
    );
}