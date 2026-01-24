import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../../services/jobService";
import { useAuth } from "../../context/AuthContext";
import { showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function JobList() {
    const { user } = useAuth();
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
            setError("Failed to load jobs");
            showErrorToast("Failed to load jobs. Please try again.");
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

            // Salary range filter
            const matchesSalary = !salaryRangeFilter || (() => {
                const jobMaxSalary = job.maxSalary || job.minSalary || 0;
                switch(salaryRangeFilter) {
                    case "0-50000": return jobMaxSalary <= 50000;
                    case "50000-100000": return jobMaxSalary >= 50000 && jobMaxSalary <= 100000;
                    case "100000-150000": return jobMaxSalary >= 100000 && jobMaxSalary <= 150000;
                    case "150000+": return jobMaxSalary >= 150000;
                    default: return true;
                }
            })();

            // Experience filter
            const matchesExperience = !experienceFilter || (() => {
                const jobMaxExp = job.maxExperience || job.minExperience || 0;
                switch(experienceFilter) {
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
            switch(sortBy) {
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
                    <button className="btn btn-outline-danger" onClick={loadJobs}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Available Jobs</h2>
                {isRecruiter && (
                    <Link to="/jobs/create" className="btn btn-primary">
                        Post New Job
                    </Link>
                )}
            </div>

            {/* Search and Filter Section - Only for Job Seekers */}
            {!isRecruiter && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title mb-3">
                            <i className="bi bi-search me-2"></i>
                            Search & Filter Jobs
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
                                        placeholder="Search by job title, description, or location..."
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
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="salary-high">Salary: High to Low</option>
                                    <option value="salary-low">Salary: Low to High</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button 
                                    className="btn btn-outline-secondary w-100"
                                    onClick={clearFilters}
                                >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Clear All
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
                                    <option value="">All Locations</option>
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
                                    <option value="">All Job Types</option>
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
                                    <option value="">All Salaries</option>
                                    <option value="0-50000">₹0 - ₹50,000</option>
                                    <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                                    <option value="100000-150000">₹1,00,000 - ₹1,50,000</option>
                                    <option value="150000+">₹1,50,000+</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <select 
                                    className="form-select"
                                    value={experienceFilter}
                                    onChange={(e) => setExperienceFilter(e.target.value)}
                                >
                                    <option value="">All Experience</option>
                                    <option value="0-2">0-2 years</option>
                                    <option value="3-5">3-5 years</option>
                                    <option value="6-10">6-10 years</option>
                                    <option value="10+">10+ years</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-3 text-muted">
                            <small>
                                Showing {filteredJobs.length} of {jobs.length} jobs
                                {(searchTerm || locationFilter || jobTypeFilter || salaryRangeFilter || experienceFilter) && 
                                    " (filtered)"
                                }
                            </small>
                        </div>
                    </div>
                </div>
            )}

            {filteredJobs.length === 0 ? (
                isRecruiter ? (
                    <EmptyState 
                        title="No Jobs Posted"
                        message="You haven't posted any jobs yet. Be the first to post a job!"
                        actionText="Post Job"
                        actionLink="/jobs/create"
                    />
                ) : (
                    <EmptyState 
                        title={jobs.length === 0 ? "No Jobs Available" : "No Jobs Match Your Search"}
                        message={jobs.length === 0 ? 
                            "There are no job postings at the moment. Check back later for new opportunities!" :
                            "Try adjusting your search criteria or clearing filters to see more jobs."
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
                                        <Link 
                                            to={`/jobs/${job.id}`} 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            View Details
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