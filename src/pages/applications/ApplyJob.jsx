import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
        githubUrl: "",
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
            setError(t("apply_job_load_error"));
            showErrorToast(t("apply_job_load_error_toast"));
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
            errors.resumeUrl = t("apply_job_resume_required");
        } else {
            const validation = validateResumeUrl(formData.resumeUrl);
            if (!validation.isValid) {
                errors.resumeUrl = validation.message;
            }
        }

        if (formData.portfolioUrl && !validateResumeUrl(formData.portfolioUrl).isValid) {
            errors.portfolioUrl = t("apply_job_invalid_url");
        }

        if (formData.linkedinUrl && !validateResumeUrl(formData.linkedinUrl).isValid) {
            errors.linkedinUrl = t("apply_job_invalid_url");
        }

        if (formData.githubUrl && !validateResumeUrl(formData.githubUrl).isValid) {
            errors.githubUrl = t("apply_job_invalid_url");
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showErrorToast(t("Please fix the errors in the form"));
            return;
        }

        try {
            setSubmitting(true);

            const applicationData = {
                resume: formData.resumeUrl.trim(),
                coverLetter: formData.coverLetter.trim() || null,
                portfolioUrl: formData.portfolioUrl.trim() || null,
                linkedinUrl: formData.linkedinUrl.trim() || null,
                githubUrl: formData.githubUrl.trim() || null,
                additionalNotes: formData.additionalNotes.trim() || null
            };

            await applyForJob(id, applicationData);
            showSuccessToast(t("apply_job_success"));
            navigate("/applications");
        } catch (err) {
            console.error("Error applying for job:", err);

            if (err.response?.status === 401) {
                showErrorToast(t("apply_job_session_expired"));
            } else if (err.response?.status === 409) {
                showErrorToast(t("apply_job_already_applied"));
                setAlreadyApplied(true);
            } else {
                showErrorToast(t("apply_job_error"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return t("salary_not_specified");
        if (!max) return `₹${min?.toLocaleString()}+`;
        if (!min) return `${t("up_to")} ₹${max?.toLocaleString()}`;
        return `₹${min?.toLocaleString()} - ₹${max?.toLocaleString()}`;
    };

    if (loading) return <Loader />;

    if (error || !job) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h4>{t("error_loading_job")}</h4>
                    <p>{error || t("job_not_found")}</p>
                    <Link to="/jobs" className="btn btn-outline-danger">
                        {t("back_to_jobs")}
                    </Link>
                </div>
            </div>
        );
    }

    if (alreadyApplied) {
        return (
            <div className="container py-5 text-center">
                <h3>{t("apply_job_already_submitted")}</h3>
                <p>{t("apply_job_already_applied_message", { jobTitle: job.title })}</p>
                <div className="d-flex gap-3 justify-content-center">
                    <Link to="/jobs" className="btn btn-outline-secondary">{t("browse_jobs")}</Link>
                    <Link to="/applications" className="btn btn-primary">{t("nav_applications")}</Link>
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
                            <h4>{t("apply_job_title")}</h4>
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
                                    <label className="form-label">{t("apply_job_resume_url")} *</label>
                                    <input
                                        type="url"
                                        className={`form-control ${formErrors.resumeUrl ? "is-invalid" : ""}`}
                                        name="resumeUrl"
                                        value={formData.resumeUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://drive.google.com/file/d/..."
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
                                    <label className="form-label">{t("apply_job_cover_letter")}</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="coverLetter"
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        placeholder={t("apply_job_cover_letter_placeholder")}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t("apply_job_portfolio_url")}</label>
                                    <input
                                        type="url"
                                        className={`form-control ${formErrors.portfolioUrl ? "is-invalid" : ""}`}
                                        name="portfolioUrl"
                                        value={formData.portfolioUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://yourportfolio.com"
                                    />
                                    {formErrors.portfolioUrl && (
                                        <div className="invalid-feedback">{formErrors.portfolioUrl}</div>
                                    )}
                                    <small className="form-text text-muted">{t("apply_job_portfolio_help")}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t("apply_job_linkedin_url")}</label>
                                    <input
                                        type="url"
                                        className={`form-control ${formErrors.linkedinUrl ? "is-invalid" : ""}`}
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                    {formErrors.linkedinUrl && (
                                        <div className="invalid-feedback">{formErrors.linkedinUrl}</div>
                                    )}
                                    <small className="form-text text-muted">{t("apply_job_linkedin_help")}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t("apply_job_github_url")}</label>
                                    <input
                                        type="url"
                                        className={`form-control ${formErrors.githubUrl ? "is-invalid" : ""}`}
                                        name="githubUrl"
                                        value={formData.githubUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://github.com/yourusername"
                                    />
                                    {formErrors.githubUrl && (
                                        <div className="invalid-feedback">{formErrors.githubUrl}</div>
                                    )}
                                    <small className="form-text text-muted">{t("apply_job_github_help")}</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">{t("apply_job_additional_notes")}</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleInputChange}
                                        placeholder={t("apply_job_additional_notes_placeholder")}
                                    />
                                    <small className="form-text text-muted">{t("apply_job_additional_notes_help")}</small>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={submitting}
                                    disabled={submitting}
                                >
                                    {t("apply_job_submit")}
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