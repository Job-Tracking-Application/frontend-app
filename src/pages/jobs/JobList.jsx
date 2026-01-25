import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import { showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function JobList() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [jobTypeFilter, setJobTypeFilter] = useState("");
    const [salaryRangeFilter, setSalaryRangeFilter] = useState("");
    const [experienceFilter, setExperienceFilter] = useState("");
    const [sortBy, setSortBy] = useState("newest"); // newest, oldest, salary-high, salary-low

    const isRecruiter = user?.role === 'RECRUITER';

    useEffect(() => {
        loadJobs();
    }, []);

    // Filter jobs whenever search/filter criteria change
    useEffect(() => {
        filterJobs();
    }, [jobs, searchTerm, locationFilter, jobTypeFilter, salaryRangeFilter, experienceFilter, sortBy]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getJobs();
            const jobsData = response.data || [];
            setJobs(jobsData);
            setFilteredJobs(jobsData);
        } catch (error) {
            console.error("Error loading jobs:", error);
            setError(t("error_loading_jobs"));
            showErrorToast(t("load_jobs_error_retry"));
        } finally {
            setLoading(false);
        }
    };

    const filterJobs = () => {
        let filtered = jobs.filter(job => {
            // Search term filter (title, description, location)
            const matchesSearch = !searchTerm ||
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase());

            // Location filter
            const matchesLocation = !locationFilter ||
                job.location?.toLowerCase().includes(locationFilter.toLowerCase());

            // Job type filter
            const matchesJobType = !jobTypeFilter ||
                job.jobType?.toLowerCase() === jobTypeFilter.toLowerCase();

            // Salary range filter (Annual salary – IT market)
            const matchesSalary = !salaryRangeFilter || (() => {
                const jobMaxSalary = job.maxSalary || job.minSalary || 0;

                switch (salaryRangeFilter) {
                    case "0-300000": return jobMaxSalary <= 300000;              // 0–3 LPA
                    case "300000-600000": return jobMaxSalary > 300000 && jobMaxSalary <= 600000; // 3–6 LPA
                    case "600000-1000000": return jobMaxSalary > 600000 && jobMaxSalary <= 1000000; // 6–10 LPA
                    case "1000000-2000000": return jobMaxSalary > 1000000 && jobMaxSalary <= 2000000; // 10–20 LPA
                    case "2000000+": return jobMaxSalary > 2000000;             // 20+ LPA
                    default: return true;
                }
            })();

            // Experience filter
            const matchesExperience = !experienceFilter || (() => {
                const jobMaxExp = job.maxExperience || job.minExperience || 0;
                switch (experienceFilter) {
                    case "0-2": return jobMaxExp <= 2;
                    case "3-5": return jobMaxExp >= 3 && jobMaxExp <= 5;
                    case "6-10": return jobMaxExp >= 6 && jobMaxExp <= 10;
                    case "10+": return jobMaxExp >= 10;
                    default: return true;
                }
            })();

            return matchesSearch && matchesLocation && matchesJobType && matchesSalary && matchesExperience;
        });

        // Sort the filtered results
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return new Date(a.postedAt) - new Date(b.postedAt);
                case "salary-high":
                    return (b.maxSalary || b.minSalary || 0) - (a.maxSalary || a.minSalary || 0);
                case "salary-low":
                    return (a.maxSalary || a.minSalary || 0) - (b.maxSalary || b.minSalary || 0);
                case "newest":
                default:
                    return new Date(b.postedAt) - new Date(a.postedAt);
            }
        });

        setFilteredJobs(filtered);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setLocationFilter("");
        setJobTypeFilter("");
        setSalaryRangeFilter("");
        setExperienceFilter("");
        setSortBy("newest");
    };

    // Get unique values for filter dropdowns
    const getUniqueLocations = () => {
        return [...new Set(jobs.map(job => job.location).filter(Boolean))];
    };

    const getUniqueJobTypes = () => {
        return [...new Set(jobs.map(job => job.jobType).filter(Boolean))];
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return t("salary_not_specified");
        if (!max) return `₹${min?.toLocaleString()}+`;
        if (!min) return `${t("upto")} ₹${max?.toLocaleString()}`;
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
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">{t("error_loading_job")}</h4>
                    <p>{error}</p>
                    <button className="btn btn-outline-danger" onClick={loadJobs}>
                        {t("try_again")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{t("latest_openings")}</h2>
                {isRecruiter && (
                    <Link to="/jobs/create" className="btn btn-primary">
                        {t("post_new_job")}
                    </Link>
                )}
            </div>

            {/* Search and Filter Section - Only for Job Seekers */}
            {!isRecruiter && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title mb-3">
                            <i className="bi bi-search me-2"></i>
                            {t("search_filter")}
                        </h5>

                        {/* Search Bar */}
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t("search_placeholder")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">{t("newest_first")}</option>
                                    <option value="oldest">{t("oldest_first")}</option>
                                    <option value="salary-high">{t("salary_high_to_low")}</option>
                                    <option value="salary-low">{t("salary_low_to_high")}</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={clearFilters}
                                >
                                    <i className="bi bi-x-circle me-2"></i>
                                    {t("clear_all")}
                                </button>
                            </div>
                        </div>

                        {/* Filter Options */}
                        <div className="row">
                            <div className="col-md-3 mb-2">
                                <select
                                    className="form-select"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                >
                                    <option value="">{t("all_locations")}</option>
                                    {getUniqueLocations().map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <select
                                    className="form-select"
                                    value={jobTypeFilter}
                                    onChange={(e) => setJobTypeFilter(e.target.value)}
                                >
                                    <option value="">{t("all_job_types")}</option>
                                    {getUniqueJobTypes().map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <select
                                    className="form-select"
                                    value={salaryRangeFilter}
                                    onChange={(e) => setSalaryRangeFilter(e.target.value)}
                                >
                                    <option value="">{t("all_salaries")}</option>
                                    <option value="0-300000">₹0 – ₹3 LPA</option>
                                    <option value="300000-600000">₹3 – ₹6 LPA</option>
                                    <option value="600000-1000000">₹6 – ₹10 LPA</option>
                                    <option value="1000000-2000000">₹10 – ₹20 LPA</option>
                                    <option value="2000000+">₹20 LPA+</option>

                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <select
                                    className="form-select"
                                    value={experienceFilter}
                                    onChange={(e) => setExperienceFilter(e.target.value)}
                                >
                                    <option value="">{t("all_experience")}</option>
                                    <option value="0-2">0-2 {t("years")}</option>
                                    <option value="3-5">3-5 {t("years")}</option>
                                    <option value="6-10">6-10 {t("years")}</option>
                                    <option value="10+">10+ {t("years")}</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-3 text-muted">
                            <small>
                                {t("showing_jobs", { count: filteredJobs.length, total: jobs.length })}
                                {(searchTerm || locationFilter || jobTypeFilter || salaryRangeFilter || experienceFilter) &&
                                    ` ${t("filtered")}`
                                }
                            </small>
                        </div>
                    </div>
                </div>
            )}

            {filteredJobs.length === 0 ? (
                isRecruiter ? (
                    <EmptyState
                        title={t("no_jobs_posted_title")}
                        message={t("no_jobs_posted_msg")}
                        actionText={t("post_job_action")}
                        actionLink="/jobs/create"
                    />
                ) : (
                    <EmptyState
                        title={jobs.length === 0 ? t("latest_openings") : t("no_jobs_found")}
                        message={jobs.length === 0 ?
                            t("no_jobs_at_moment") :
                            t("adjust_search_criteria")
                        }
                    />
                )
            ) : (
                <div className="row">
                    {filteredJobs.map(job => (
                        <div key={job.id} className="col-lg-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title mb-0">{job.title}</h5>
                                        <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                            {job.isActive ? t("status_active") : t("status_inactive")}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted">
                                            <i className="fas fa-building me-1"></i>
                                            {t("company")} ID: {job.companyId}
                                        </small>
                                        {job.location && (
                                            <small className="text-muted ms-3">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {job.location}
                                            </small>
                                        )}
                                    </div>

                                    <p className="card-text text-truncate" style={{ maxHeight: '3rem' }}>
                                        {job.description}
                                    </p>

                                    <div className="mb-3">
                                        <div className="row text-sm">
                                            <div className="col-6">
                                                <strong>{t("salary")}:</strong><br />
                                                <span className="text-success">{formatSalary(job.minSalary, job.maxSalary)}</span>
                                            </div>
                                            <div className="col-6">
                                                <strong>{t("experience")}:</strong><br />
                                                <span className="text-info">{formatExperience(job.minExperience, job.maxExperience)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <span className="badge bg-light text-dark me-2">{job.jobType}</span>
                                        {job.deadline && (
                                            <small className="text-warning">
                                                <i className="fas fa-clock me-1"></i>
                                                {t("apply_by")}: {formatDate(job.deadline)}
                                            </small>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            {t("posted_on")}: {formatDate(job.postedAt)}
                                        </small>
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            {t("view_details")}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}