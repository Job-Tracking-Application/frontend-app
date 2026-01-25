import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById } from "../../services/jobService";
import { applyForJob, checkApplicationExists } from "../../services/applicationService";
import { useAuth } from "../../context/useAuth";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { validateResumeUrl, getUrlSuggestions } from "../../utils/urlValidator";
import ResumeUrlHelper from "../../components/common/ResumeUrlHelper";

export default function ApplyJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    useAuth(); // initialize auth context

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    const [formData, setFormData] = useState({
        resumeUrl: "",
        coverLetter: "",
        portfolioUrl: "",
        linkedinUrl: "",
        additionalNotes: ""
    });

    const [formErrors, setFormErrors] = useState({});
    const [urlSuggestions, setUrlSuggestions] = useState(null);

    useEffect(() => {
        if (id) {
            loadJobAndCheckApplication();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadJobAndCheckApplication = async () => {
        try {
            setLoading(true);
            setError(null);

            const jobResponse = await getJobById(id);
            setJob(jobResponse.data);

            try {
                const checkResponse = await checkApplicationExists(id);
                setAlreadyApplied(checkResponse.hasApplied);
            } catch {
                // backend will handle duplicate check
            }
        } catch (err) {
            console.error("Error loading job:", err);
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

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        if (name === "resumeUrl" && value.trim()) {
            setUrlSuggestions(getUrlSuggestions(value));
        } else if (name === "resumeUrl") {
            setUrlSuggestions(null);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.resumeUrl.trim()) {
            errors.resumeUrl = "Please provide a resume URL";
        } else {
            const validation = validateResumeUrl(formData.resumeUrl);
            if (!validation.isValid) {
                errors.resumeUrl = validation.message;
            }
        }

        if (formData.portfolioUrl && !validateResumeUrl(formData.portfolioUrl).isValid) {
            errors.portfolioUrl = "Please enter a valid URL";
        }

        if (formData.linkedinUrl && !validateResumeUrl(formData.linkedinUrl).isValid) {
            errors.linkedinUrl = "Please enter a valid URL";
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

            const applicationData = {
                resume: formData.resumeUrl.trim(),
                coverLetter: formData.coverLetter.trim() || null
            };

            await applyForJob(id, applicationData);
            showSuccessToast("Application submitted successfully!");
            navigate("/applications");
        } catch (err) {
            console.error("Error applying for job:", err);

            if (err.response?.status === 401) {
                showErrorToast("Your session has expired. Please log in again.");
            } else if (err.response?.status === 409) {
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
                <div className="alert alert-danger">
                    <h4>Error Loading Job</h4>
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
            <div className="container py-5 text-center">
                <h3>Application Already Submitted</h3>
                <p>You have already applied for <strong>{job.title}</strong>.</p>
                <div className="d-flex gap-3 justify-content-center">
                    <Link to="/jobs" className="btn btn-outline-secondary">Browse Jobs</Link>
                    <Link to="/applications" className="btn btn-primary">My Applications</Link>
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
                            <h4>Apply for Job</h4>
                        </div>
                        <div className="card-body">

                            <div className="bg-light p-3 rounded mb-4">
                                <h5>{job.title}</h5>
                                <p className="text-muted">
                                    ₹ {formatSalary(job.minSalary, job.maxSalary)}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Resume URL *</label>
                                    <input
                                        type="url"
                                        className={`form-control ${formErrors.resumeUrl ? "is-invalid" : ""}`}
                                        name="resumeUrl"
                                        value={formData.resumeUrl}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {formErrors.resumeUrl && (
                                        <div className="invalid-feedback">{formErrors.resumeUrl}</div>
                                    )}
                                </div>

                                {urlSuggestions && (
                                    <div className="alert alert-info">
                                        <ul className="mb-0">
                                            {urlSuggestions.map((s, i) => (
                                                <li key={i}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Cover Letter</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="coverLetter"
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={submitting}
                                    disabled={submitting}
                                >
                                    Submit Application
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <ResumeUrlHelper />
                </div>
            </div>
        </div>
    );
}