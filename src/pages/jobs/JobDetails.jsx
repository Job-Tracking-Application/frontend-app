import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById, deleteJob } from "../../services/jobService";
import { useAuth } from "../../context/useAuth";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import ConfirmationModal from "../../components/common/ConfirmationModal";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isRecruiter = user?.role === 'RECRUITER';
    const isJobSeeker = user?.role === 'JOB_SEEKER';
    const isOwner = isRecruiter && job?.recruiterUserId === user?.id;

    useEffect(() => {
        if (id) {
            loadJob();
        }
    }, [loadJob]);

    const loadJob = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getJobById(id);
            setJob(response.data);
        } catch (error) {
            console.error("Error loading job:", error);
            setError("Failed to load job details");
            showErrorToast("Failed to load job details. Please try again.");
        } finally {
            setLoading(false);
        }
    },[id]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await deleteJob(id);
            showSuccessToast("Job deleted successfully!");
            navigate("/jobs/my-jobs");
        } catch (error) {
            console.error("Error deleting job:", error);
            showErrorToast("Failed to delete job. Please try again.");
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
        if (!min && !max) return "Salary not specified";
        if (!max) return `₹${min?.toLocaleString()}+`;
        if (!min) return `Up to ₹${max?.toLocaleString()}`;
        return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
    };

    const formatExperience = (min, max) => {
        if (!min && !max) return "Experience not specified";
        if (!max) return `${min}+ years`;
        if (!min) return `Up to ${max} years`;
        if (min === max) return `${min} years`;
        return `${min} - ${max} years`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
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
                    <h4 className="alert-heading">Error Loading Job</h4>
                    <p>{error || "Job not found"}</p>
                    {isRecruiter ? (
                        <Link to="/jobs/my-jobs" className="btn btn-outline-danger">
                            Back to My Jobs
                        </Link>
                    ) : (
                        <Link to="/jobs" className="btn btn-outline-danger">
                            Back to Jobs
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
                                        Company ID: {job.companyId}
                                        {job.location && (
                                            <>
                                                <i className="fas fa-map-marker-alt ms-3 me-2"></i>
                                                {job.location}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span className={`badge fs-6 ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                    {job.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted mb-1">Salary Range</h6>
                                        <div className="h5 text-success mb-0">
                                            {formatSalary(job.minSalary, job.maxSalary)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted mb-1">Experience</h6>
                                        <div className="h5 text-info mb-0">
                                            {formatExperience(job.minExperience, job.maxExperience)}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="border rounded p-3 text-center">
                                        <h6 className="text-muted mb-1">Job Type</h6>
                                        <div className="h5 text-primary mb-0">{job.jobType}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5>Job Description</h5>
                                <div className="bg-light p-3 rounded">
                                    <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                                        {job.description}
                                    </p>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6>Posted Date</h6>
                                    <p className="text-success">
                                        <i className="fas fa-calendar-plus me-2"></i>
                                        {formatDate(job.postedAt)}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h6>Application Deadline</h6>
                                    {job.deadline ? (
                                        <p className="text-warning fw-bold">
                                            <i className="fas fa-calendar-alt me-2"></i>
                                            {formatDate(job.deadline)}
                                        </p>
                                    ) : (
                                        <p className="text-muted fst-italic">
                                            <i className="fas fa-calendar-times me-2"></i>
                                            No deadline specified
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex gap-3">
                                {/* Back button - different for each role */}
                                {isRecruiter ? (
                                    <Link to="/jobs/my-jobs" className="btn btn-outline-secondary">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to My Jobs
                                    </Link>
                                ) : (
                                    <Link to="/jobs" className="btn btn-outline-secondary">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Jobs
                                    </Link>
                                )}

                                {/* Role-specific action buttons */}
                                {isJobSeeker && (
                                    <button 
                                        className="btn btn-primary"
                                        onClick={handleApply}
                                    >
                                        <i className="fas fa-paper-plane me-2"></i>
                                        Apply for Job
                                    </button>
                                )}

                                {isOwner && (
                                    <>
                                        <Link 
                                            to={`/jobs/edit/${job.id}`} 
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="fas fa-edit me-2"></i>
                                            Edit Job
                                        </Link>
                                        <button 
                                            className="btn btn-outline-danger"
                                            onClick={() => setShowDeleteModal(true)}
                                        >
                                            <i className="fas fa-trash me-2"></i>
                                            Delete Job
                                        </button>
                                    </>
                                )}

                                {isRecruiter && !isOwner && (
                                    <div className="text-muted fst-italic">
                                        <i className="fas fa-info-circle me-2"></i>
                                        You can only edit jobs you created
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Job Information</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <strong>Job ID:</strong> {job.id}
                                </li>
                                <li className="mb-2">
                                    <strong>Recruiter ID:</strong> {job.recruiterUserId}
                                </li>
                                <li className="mb-2">
                                    <strong>Created:</strong> {formatDate(job.createdAt)}
                                </li>
                                <li className="mb-2">
                                    <strong>Last Updated:</strong> {formatDate(job.updatedAt)}
                                </li>
                                <li className="mb-2">
                                    <strong>Status:</strong> 
                                    <span className={`ms-2 badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                        {job.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                show={showDeleteModal}
                title="Delete Job"
                message={`Are you sure you want to delete "${job.title}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                loading={deleting}
            />
        </div>
    );
}