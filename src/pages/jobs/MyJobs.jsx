import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyJobs, deleteJob } from "../../services/jobService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmationModal from "../../components/common/ConfirmationModal";

export default function MyJobs() {
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
            console.error("Error loading my jobs:", error);
            setError("Failed to load your jobs");
            showErrorToast("Failed to load your jobs. Please try again.");
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
            showSuccessToast("Job deleted successfully!");
            setJobs(jobs.filter(job => job.id !== deleteModal.job.id));
        } catch (error) {
            console.error("Error deleting job:", error);
            showErrorToast("Failed to delete job. Please try again.");
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, job: null });
        }
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
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <Loader />;

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error Loading Jobs</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={loadMyJobs}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Job Postings</h2>
                <Link to="/jobs/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Post New Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <EmptyState 
                    title="No Jobs Posted Yet"
                    message="You haven't posted any jobs yet. Start by creating your first job posting!"
                    actionText="Post Your First Job"
                    actionLink="/jobs/create"
                    icon="fas fa-briefcase"
                />
            ) : (
                <div className="row">
                    {jobs.map(job => (
                        <div key={job.id} className="col-lg-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title mb-0">{job.title}</h5>
                                        <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                            {job.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <small className="text-muted">
                                            <i className="fas fa-building me-1"></i>
                                            Company ID: {job.companyId}
                                        </small>
                                        {job.location && (
                                            <small className="text-muted ms-3">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {job.location}
                                            </small>
                                        )}
                                    </div>

                                    <p className="card-text text-truncate" style={{maxHeight: '3rem'}}>
                                        {job.description}
                                    </p>

                                    <div className="mb-3">
                                        <div className="row text-sm">
                                            <div className="col-6">
                                                <strong>Salary:</strong><br/>
                                                <span className="text-success">{formatSalary(job.minSalary, job.maxSalary)}</span>
                                            </div>
                                            <div className="col-6">
                                                <strong>Experience:</strong><br/>
                                                <span className="text-info">{formatExperience(job.minExperience, job.maxExperience)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <span className="badge bg-light text-dark me-2">{job.jobType}</span>
                                        {job.deadline && (
                                            <small className="text-warning">
                                                <i className="fas fa-clock me-1"></i>
                                                Apply by: {formatDate(job.deadline)}
                                            </small>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            Posted: {formatDate(job.postedAt)}
                                        </small>
                                        <div className="btn-group">
                                            <Link 
                                                to={`/jobs/${job.id}`} 
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                View
                                            </Link>
                                            <Link 
                                                to={`/jobs/edit/${job.id}`} 
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteClick(job)}
                                            >
                                                Delete
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
                title="Delete Job"
                message={`Are you sure you want to delete "${deleteModal.job?.title}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModal({ show: false, job: null })}
                loading={deleting}
            />
        </div>
    );
}