import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h5 className="card-title text-primary">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                <div className="mb-2">
                    <span className="badge bg-light text-dark me-2">{job.type}</span>
                    <span className="badge bg-light text-dark">{job.location}</span>
                </div>
                <p className="card-text text-truncate">{job.description}</p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fw-bold">{job.salary}</span>
                    <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
