import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById, deleteJob } from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
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

    const isRecruiter = user?.role === "RECRUITER";
    const isJobSeeker = user?.role === "JOB_SEEKER";
    const isOwner = isRecruiter && job?.recruiterUserId === user?.id;

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            setLoading(true);
            const res = await getJobById(id);
            setJob(res.data);
        } catch {
            setError(true);
            showErrorToast(t("job_load_error"));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteJob(id);
            showSuccessToast(t("job_delete_success"));
            navigate("/jobs/my-jobs");
        } catch {
            showErrorToast(t("job_delete_error"));
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return t("salary_not_specified");
        if (!max) return `₹${min.toLocaleString()}+`;
        if (!min) return `Up to ₹${max.toLocaleString()}`;
        return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    };

    const formatExperience = (min, max) => {
        if (!min && !max) return t("experience_not_specified");
        if (!max) return `${min}+ years`;
        if (!min) return `Up to ${max} years`;
        if (min === max) return `${min} years`;
        return `${min} - ${max} years`;
    };

    const formatDate = (d) =>
        d
            ? new Date(d).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            })
            : t("no_deadline");

    if (loading) return <Loader />;

    if (!job || error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4>{t("error_loading_job")}</h4>
                    <p>{t("job_not_found")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                {/* LEFT */}
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-4">
                                <div>
                                    <h3>{job.title}</h3>
                                    <div className="text-muted">
                                        Company ID: {job.companyId} {job.location && `• ${job.location}`}
                                    </div>
                                </div>

                                {/* STATUS BADGE – FIXED SIZE */}
                                <span
                                    className={`badge ${job.isActive ? "bg-success" : "bg-secondary"}`}
                                    style={{
                                        padding: "4px 10px",
                                        fontSize: "0.75rem",
                                        borderRadius: "12px",
                                        height: "fit-content"
                                    }}
                                >
                                    {job.isActive ? t("status_active") : t("status_inactive")}
                                </span>
                            </div>

                            {/* INFO CARDS */}
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted">{t("salary_range")}</h6>
                                        <div className="text-success fw-bold">
                                            {formatSalary(job.minSalary, job.maxSalary)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted">{t("experience")}</h6>
                                        <div className="text-info fw-bold">
                                            {formatExperience(job.minExperience, job.maxExperience)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted">{t("job_type")}</h6>
                                        <div className="fw-bold text-primary">{job.jobType}</div>
                                    </div>
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            <h5>{t("job_description")}</h5>
                            <div className="bg-light p-3 rounded mb-4">
                                {job.description}
                            </div>

                            {/* DATES */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <strong>{t("posted_date")}:</strong> {formatDate(job.postedAt)}
                                </div>
                                <div className="col-md-6">
                                    <strong>{t("application_deadline")}:</strong>{" "}
                                    {job.deadline ? formatDate(job.deadline) : t("no_deadline")}
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="d-flex gap-3">
                                <Link
                                    to={isRecruiter ? "/jobs/my-jobs" : "/jobs"}
                                    className="btn btn-outline-secondary"
                                >
                                    {isRecruiter ? t("back_to_my_jobs") : t("back_to_jobs")}
                                </Link>

                                {isOwner && (
                                    <>
                                        <Link
                                            to={`/jobs/edit/${job.id}`}
                                            className="btn btn-outline-primary"
                                        >
                                            {t("edit_job")}
                                        </Link>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            {t("delete_job")}
                                        </button>
                                    </>
                                )}

                                {isJobSeeker && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/jobs/${id}/apply`)}
                                    >
                                        {t("apply_for_job")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5>{t("job_information")}</h5>
                            <ul className="list-unstyled">
                                <li><strong>{t("job_id")}:</strong> {job.id}</li>
                                <li><strong>{t("recruiter_id")}:</strong> {job.recruiterUserId}</li>
                                <li><strong>{t("created")}:</strong> {formatDate(job.createdAt)}</li>
                                <li><strong>{t("last_updated")}:</strong> {formatDate(job.updatedAt)}</li>
                                <li>
                                    <strong>{t("status")}:</strong>
                                    <span
                                        className={`ms-2 badge ${job.isActive ? "bg-success" : "bg-secondary"}`}
                                        style={{
                                            padding: "4px 10px",
                                            fontSize: "0.75rem",
                                            borderRadius: "12px"
                                        }}
                                    >
                                        {job.isActive ? t("status_active") : t("status_inactive")}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            <ConfirmationModal
                show={showDeleteModal}
                title={t("delete_job_confirm_title")}
                message={t("delete_job_confirm_message").replace("{{title}}", job.title)}
                confirmText={t("delete_job")}
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={deleting}
            />
        </div>
    );
}
