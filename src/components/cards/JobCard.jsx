import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";

export default function JobCard({ job }) {
    const { t } = useLanguage();
    
    // Format salary range
    const formatSalary = (minSalary, maxSalary) => {
        if (minSalary && maxSalary) {
            return `₹${(minSalary/1000).toFixed(0)}K - ₹${(maxSalary/1000).toFixed(0)}K`;
        }
        return t("salary_not_specified");
    };

    return (
        <div className="card h-100 shadow-sm border-0 job-card" style={{ transition: "transform 0.2s, box-shadow 0.2s" }}>
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="card-title fw-bold text-dark mb-1">{job.title}</h5>
                        <h6 className="card-subtitle text-muted">{job.companyName || t("company_not_specified")}</h6>
                    </div>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{job.jobType}</span>
                </div>

                <p className="card-text text-secondary mb-3 flex-grow-1" style={{ fontSize: "0.95rem" }}>
                    {job.description && job.description.length > 100 ? job.description.substring(0, 100) + "..." : job.description}
                </p>

                {/* Skills Display */}
                {job.skills && job.skills.length > 0 && (
                    <div className="mb-3">
                        <small className="text-muted d-block mb-1">{t("required_skills")}:</small>
                        <div className="d-flex flex-wrap gap-1">
                            {job.skills.slice(0, 3).map((skill, index) => (
                                <span key={skill.id || index} className="badge bg-light text-dark border" style={{ fontSize: "0.75rem" }}>
                                    {skill.name}
                                </span>
                            ))}
                            {job.skills.length > 3 && (
                                <span className="badge bg-secondary" style={{ fontSize: "0.75rem" }}>
                                    +{job.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    <div className="d-flex align-items-center text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                        <i className="bi bi-geo-alt me-1"></i> {job.location || t("location_not_specified")}
                        <span className="mx-2">&bull;</span>
                        <i className="bi bi-cash me-1"></i> {formatSalary(job.minSalary, job.maxSalary)}
                    </div>

                    <Link to={`/jobs/${job.id}`} className="btn btn-primary w-100 fw-medium">
                        {t("view_details")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
