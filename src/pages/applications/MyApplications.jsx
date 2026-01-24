import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../services/applicationService";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import { showErrorToast } from "../../utils/toast";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
      setError("Failed to load applications");
      showErrorToast("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'HIRED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'INTERVIEWED':
        return 'bg-info';
      case 'UNDER_REVIEW':
        return 'bg-warning';
      case 'APPLIED':
      default:
        return 'bg-primary';
    }
  };

  const formatStatus = (status) => {
    switch (status?.toUpperCase()) {
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'INTERVIEWED':
        return 'Interviewed';
      case 'HIRED':
        return 'Hired';
      case 'REJECTED':
        return 'Rejected';
      case 'APPLIED':
      default:
        return 'Applied';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <Loader />;

  return (
    <div>
      <PageHero title="My Applications" subtitle="Track the status of your job applications." />

      <div className="container pb-5">
        {error && (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Applications</h4>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadApplications}>
              Try Again
            </button>
          </div>
        )}

        {!error && (
          <>
            {applications.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">
                  {applications.length} Application{applications.length !== 1 ? 's' : ''}
                </h4>
                <Link to="/jobs" className="btn btn-outline-primary">
                  <i className="bi bi-search me-2"></i>
                  Browse More Jobs
                </Link>
              </div>
            )}

            <div className="row g-4">
              {applications.map((app) => (
                <div key={app.id} className="col-lg-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="flex-grow-1">
                          <h5 className="fw-bold mb-1 text-primary">{app.jobTitle}</h5>
                          <h6 className="text-secondary mb-2">
                            <i className="bi bi-building me-2"></i>
                            {app.company}
                          </h6>
                        </div>
                        <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(app.status)}`}>
                          {formatStatus(app.status)}
                        </span>
                      </div>

                      <hr className="my-3 opacity-25" />

                      <div className="row g-3">
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-calendar-check text-muted me-2"></i>
                            <div>
                              <p className="text-muted small mb-0 fw-bold text-uppercase">Applied On</p>
                              <p className="fw-medium mb-0">{formatDate(app.appliedDate)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-file-earmark-text text-muted me-2"></i>
                            <div>
                              <p className="text-muted small mb-0 fw-bold text-uppercase">Resume</p>
                              {app.resume ? (
                                <a 
                                  href={app.resume} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-decoration-none fw-medium"
                                >
                                  View Resume <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                                </a>
                              ) : (
                                <span className="text-muted">No resume</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            Application ID: #{app.id}
                          </small>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-secondary"
                              onClick={() => window.open(app.resume, '_blank')}
                              disabled={!app.resume}
                            >
                              <i className="bi bi-eye me-1"></i>
                              View Resume
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="col-12 mt-4 text-center">
                  <div className="p-5 bg-light rounded-3">
                    <i className="bi bi-clipboard-x display-4 text-muted mb-3 d-block"></i>
                    <h4 className="text-muted">No Applications Yet</h4>
                    <p className="text-muted mb-4">
                      You haven't applied to any jobs yet. Start exploring opportunities!
                    </p>
                    <Link to="/jobs" className="btn btn-primary">
                      <i className="bi bi-search me-2"></i>
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
