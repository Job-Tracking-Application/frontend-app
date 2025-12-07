import React from "react";
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";

export default function RecruiterDashboard() {
    return (
        <div>
            <PageHero title="Recruiter Dashboard" subtitle="Post jobs and manage candidates efficiently." />

            <div className="container pb-5">
                <div className="row g-4">
                    {/* Quick Stats */}
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 h-100 border-start border-4 border-primary">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase mb-2">Active Jobs</h6>
                                <h2 className="display-5 fw-bold mb-0">5</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 h-100 border-start border-4 border-warning">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase mb-2">Pending Applications</h6>
                                <h2 className="display-5 fw-bold mb-0">28</h2>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 h-100 border-start border-4 border-success">
                            <div className="card-body">
                                <h6 className="text-muted text-uppercase mb-2">Hired Candidates</h6>
                                <h2 className="display-5 fw-bold mb-0">14</h2>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="col-12 mt-4">
                        <h4 className="fw-bold mb-3">Quick Actions</h4>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <Link to="/jobs/create" className="btn btn-primary w-100 py-3 fw-medium shadow-sm">
                                    <i className="bi bi-plus-circle me-2"></i> Post New Job
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/applications/manage" className="btn btn-outline-dark w-100 py-3 fw-medium shadow-sm">
                                    <i className="bi bi-people me-2"></i> Manage Candidates
                                </Link>
                            </div>
                            <div className="col-md-3">
                                <Link to="/profile" className="btn btn-outline-secondary w-100 py-3 fw-medium shadow-sm">
                                    <i className="bi bi-building me-2"></i> Company Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}