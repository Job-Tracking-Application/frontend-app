import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";

export default function JobCard({ job }) {
    const { t } = useLanguage();
    return (
        <div className="card h-100 shadow-sm border-0 job-card" style={{ transition: "transform 0.2s, box-shadow 0.2s" }}>
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="card-title fw-bold text-dark mb-1">{job.title}</h5>
                        <h6 className="card-subtitle text-muted">{job.company}</h6>
                    </div>
                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3">{job.type}</span>
                </div>

                <p className="card-text text-secondary mb-4 flex-grow-1" style={{ fontSize: "0.95rem" }}>
                    {job.description.length > 100 ? job.description.substring(0, 100) + "..." : job.description}
                </p>

                <div className="mt-auto">
                    <div className="d-flex align-items-center text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                        <i className="bi bi-geo-alt me-1"></i> {job.location}
                        <span className="mx-2">&bull;</span>
                        <i className="bi bi-cash me-1"></i> {job.salary}
                    </div>

                    <Link to={`/jobs/${job.id}`} className="btn btn-primary w-100 fw-medium">
                        {t("view_details")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
