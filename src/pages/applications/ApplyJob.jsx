import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById } from "../../services/jobService";
import { applyForJob, getMyApplications, checkApplicationExists } from "../../services/applicationService";
import { useAuth } from "../../context/AuthContext";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { validateResumeUrl, getUrlSuggestions } from "../../utils/urlValidator";
import ResumeUrlHelper from "../../components/common/ResumeUrlHelper";

export default function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        resumeUrl: '',
        coverLetter: '',
        portfolioUrl: '',
        linkedinUrl: '',
        additionalNotes: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [urlSuggestions, setUrlSuggestions] = useState(null);

    useEffect(() => {
        if (id) {
            loadJobAndCheckApplication();
        }
    }, [id]);

    const loadJobAndCheckApplication = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load job details
            const jobResponse = await getJobById(id);
            setJob(jobResponse.data);

            // Check if user already applied for this specific job using the new API
            try {
                const checkResponse = await checkApplicationExists(id);
                setAlreadyApplied(checkResponse.hasApplied);
                
                if (checkResponse.hasApplied) {
                    // User has already applied for this job
                }
            } catch (appError) {
                // Could not check existing applications - continue anyway
                // Backend will handle duplicate check
            }
        } catch (error) {
            console.error("Error loading job:", error);
            setError("Failed to load job details");
            showErrorToast("Failed to load job details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Provide URL suggestions for resume URL
        if (name === 'resumeUrl' && value.trim()) {
            const suggestions = getUrlSuggestions(value);
            setUrlSuggestions(suggestions);
        } else if (name === 'resumeUrl') {
            setUrlSuggestions(null);
        }
    };

    const handleFileChange = (e) => {
        // Removed file upload functionality - using URLs only
    };

    const validateForm = () => {
        const errors = {};

        // Resume URL validation - required
        if (!formData.resumeUrl.trim()) {
            errors.resumeUrl = 'Please provide a resume URL';
        } else {
            const validation = validateResumeUrl(formData.resumeUrl);
            if (!validation.isValid) {
                errors.resumeUrl = validation.message;
            }
        }

        // Other URL validations
        if (formData.portfolioUrl && !validateResumeUrl(formData.portfolioUrl).isValid) {
            errors.portfolioUrl = 'Please enter a valid URL (starting with http:// or https://)';
        }
        
        if (formData.linkedinUrl && !validateResumeUrl(formData.linkedinUrl).isValid) {
            errors.linkedinUrl = 'Please enter a valid URL (starting with http:// or https://)';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showErrorToast("Please fix the errors in the form");
            return;
        }

        try {
            setSubmitting(true);

            // Use the resume URL directly
            const applicationData = {
                resume: formData.resumeUrl.trim(),
                coverLetter: formData.coverLetter.trim() || null
            };

            await applyForJob(id, applicationData);
            showSuccessToast("Application submitted successfully!");
            navigate("/applications/my");
        } catch (error) {
            console.error("Error applying for job:", error);
            
            if (error.response?.status === 401) {
                showErrorToast("Your session has expired. Please log in again.");
            } else if (error.response?.status === 409) {
                showErrorToast("You have already applied for this job");
                setAlreadyApplied(true);
            } else {
                showErrorToast("Failed to apply for job. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return "Salary not specified";
        if (!max) return `₹${min?.toLocaleString()}+`;
        if (!min) return `Up to ₹${max?.toLocaleString()}`;
        return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
    };

    if (loading) return <Loader />;

    if (error || !job) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error Loading Job</h4>
                    <p>{error || "Job not found"}</p>
                    <Link to="/jobs" className="btn btn-outline-danger">
                        Back to Jobs
                    </Link>
                </div>
            </div>
        );
    }

    if (alreadyApplied) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-5">
                                <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                                <h3 className="mb-3">Application Already Submitted</h3>
                                <p className="text-muted mb-4">
                                    You have already submitted an application for <strong>{job?.title}</strong> position.
                                    <br />
                                    You can track your application status in "My Applications".
                                </p>
                                <div className="d-flex gap-3 justify-content-center">
                                    <Link to="/jobs" className="btn btn-outline-secondary">
                                        <i className="bi bi-search me-2"></i>
                                        Browse More Jobs
                                    </Link>
                                    <Link to="/applications" className="btn btn-primary">
                                        <i className="bi bi-file-earmark-text me-2"></i>
                                        View My Applications
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-file-earmark-text me-2"></i>
                                Apply for Job
                            </h4>
                        </div>
                        <div className="card-body">
                            {/* Job Summary */}
                            <div className="bg-light p-3 rounded mb-4">
                                <h5 className="mb-2 text-primary">{job.title}</h5>
                                <div className="text-muted mb-2">
                                    <i className="bi bi-building me-2"></i>
                                    Company ID: {job.companyId}
                                    {job.location && (
                                        <>
                                            <i className="bi bi-geo-alt ms-3 me-2"></i>
                                            {job.location}
                                        </>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="text-success fw-bold">
                                            <i className="bi bi-currency-rupee me-1"></i>
                                            {formatSalary(job.minSalary, job.maxSalary)}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="text-info">
                                            <i className="bi bi-briefcase me-1"></i>
                                            {job.minExperience || 0} - {job.maxExperience || 'Any'} years experience
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Resume Section */}
                                <div className="mb-4">
                                    <h5 className="mb-3">
                                        <i className="bi bi-file-person me-2"></i>
                                        Resume URL <span className="text-danger">*</span>
                                    </h5>
                                    
                                    <div className="mb-3">
                                        <input
                                            type="url"
                                            className={`form-control ${formErrors.resumeUrl ? 'is-invalid' : ''}`}
                                            name="resumeUrl"
                                            value={formData.resumeUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://drive.google.com/file/d/your-resume-id/view"
                                            required
                                        />
                                        <div className="form-text">
                                            <strong>Supported platforms:</strong> Google Drive or LinkedIn Profile
                                        </div>
                                        {formErrors.resumeUrl && (
                                            <div className="invalid-feedback">{formErrors.resumeUrl}</div>
                                        )}
                                        
                                        {/* URL Suggestions */}
                                        {urlSuggestions && urlSuggestions.length > 0 && (
                                            <div className="alert alert-info mt-2">
                                                <small>
                                                    <i className="bi bi-lightbulb me-1"></i>
                                                    <strong>Suggestions:</strong>
                                                    <ul className="mb-0 mt-1">
                                                        {urlSuggestions.map((suggestion, index) => (
                                                            <li key={index}>{suggestion}</li>
                                                        ))}
                                                    </ul>
                                                </small>
                                            </div>
                                        )}
                                    </div>

                                    {/* Resume URL Examples */}
                                    <div className="alert alert-info">
                                        <h6 className="alert-heading">
                                            <i className="bi bi-info-circle me-2"></i>
                                            How to get your resume URL:
                                        </h6>
                                        <ul className="mb-0">
                                            <li><strong>Google Drive:</strong> Upload resume → Right-click → Share → Copy link</li>
                                            <li><strong>LinkedIn:</strong> Go to your profile → Contact info → Copy profile URL</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="mb-4">
                                    <label htmlFor="coverLetter" className="form-label">
                                        <i className="bi bi-file-text me-2"></i>
                                        Cover Letter
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="coverLetter"
                                        name="coverLetter"
                                        rows="6"
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a good fit..."
                                    />
                                    <div className="form-text">
                                        Optional but recommended. This helps you stand out from other candidates.
                                    </div>
                                </div>

                                {/* Additional Links */}
                                <div className="mb-4">
                                    <h6 className="mb-3">Additional Information (Optional)</h6>
                                    
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="portfolioUrl" className="form-label">
                                                <i className="bi bi-briefcase me-2"></i>
                                                Portfolio URL
                                            </label>
                                            <input
                                                type="url"
                                                className={`form-control ${formErrors.portfolioUrl ? 'is-invalid' : ''}`}
                                                id="portfolioUrl"
                                                name="portfolioUrl"
                                                value={formData.portfolioUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://your-portfolio.com"
                                            />
                                            {formErrors.portfolioUrl && (
                                                <div className="invalid-feedback">{formErrors.portfolioUrl}</div>
                                            )}
                                        </div>
                                        
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="linkedinUrl" className="form-label">
                                                <i className="bi bi-linkedin me-2"></i>
                                                LinkedIn Profile
                                            </label>
                                            <input
                                                type="url"
                                                className={`form-control ${formErrors.linkedinUrl ? 'is-invalid' : ''}`}
                                                id="linkedinUrl"
                                                name="linkedinUrl"
                                                value={formData.linkedinUrl}
                                                onChange={handleInputChange}
                                                placeholder="https://linkedin.com/in/your-profile"
                                            />
                                            {formErrors.linkedinUrl && (
                                                <div className="invalid-feedback">{formErrors.linkedinUrl}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Notes */}
                                <div className="mb-4">
                                    <label htmlFor="additionalNotes" className="form-label">
                                        <i className="bi bi-chat-text me-2"></i>
                                        Additional Notes
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="additionalNotes"
                                        name="additionalNotes"
                                        rows="3"
                                        value={formData.additionalNotes}
                                        onChange={handleInputChange}
                                        placeholder="Any additional information you'd like to share..."
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="d-flex gap-3">
                                    <Link to={`/jobs/${id}`} className="btn btn-outline-secondary">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Job
                                    </Link>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        loading={submitting}
                                        disabled={submitting}
                                    >
                                        <i className="bi bi-send me-2"></i>
                                        {submitting ? "Submitting Application..." : "Submit Application"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Job Details Sidebar */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h6 className="mb-0">Job Details</h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <strong>Job Type:</strong>
                                <span className="ms-2 badge bg-primary">{job.jobType}</span>
                            </div>
                            <div className="mb-3">
                                <strong>Experience Required:</strong>
                                <div className="text-muted">
                                    {job.minExperience || 0} - {job.maxExperience || 'Any'} years
                                </div>
                            </div>
                            <div className="mb-3">
                                <strong>Application Deadline:</strong>
                                <div className="text-warning">
                                    {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                                </div>
                            </div>
                            <div className="mb-3">
                                <strong>Posted:</strong>
                                <div className="text-muted">
                                    {new Date(job.postedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume URL Helper */}
                    <ResumeUrlHelper />

                    {/* Application Tips */}
                    <div className="card shadow-sm mt-3">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="bi bi-lightbulb me-2"></i>
                                Application Tips
                            </h6>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Make sure your resume URL is publicly accessible
                                </li>
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Use Google Drive for reliable access to your PDF resume
                                </li>
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Write a compelling cover letter
                                </li>
                                <li className="mb-2">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Include relevant portfolio links
                                </li>
                                <li className="mb-0">
                                    <i className="bi bi-check-circle text-success me-2"></i>
                                    Double-check all URLs before submitting
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}