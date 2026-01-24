import React, { useEffect, useState } from "react";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/applicationService";
import PageHero from "../../components/common/PageHero";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const load = async () => {
      // Hardcoded job ID for demo purposes as per original file
      const data = await getApplicationsForJob(1);
      setApplications(data);
    };
    load();
  }, []);

  const handleAction = (id, status) => {
    console.log(`Application ${id} → ${status}`);
    updateApplicationStatus(id, status);
    // Optimistic update for UI
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  return (
    <div>
      <PageHero title="Manage Applications" subtitle="Review and take action on candidate applications." />

      <div className="container pb-5">
        <div className="row g-4">
          {applications.map((app) => (
            <div key={app.id} className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">{app.name}</h5>
                      <p className="text-muted mb-0">{app.email}</p>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-light btn-sm rounded-circle" type="button">
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      {app.skills.map((skill, i) => (
                        <span key={i} className="badge bg-light text-dark border">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <a href={app.resume} target="_blank" rel="noreferrer" className="d-inline-flex align-items-center text-decoration-none p-2 bg-light rounded text-dark">
                      <i className="bi bi-file-earmark-pdf text-danger me-2 fs-5"></i>
                      View Candidate Resume
                    </a>
                  </div>

                  {(!app.status || app.status === "PENDING") ? (
                    <div className="d-grid gap-2 d-md-flex">
                      <button
                        onClick={() => handleAction(app.id, "SHORTLISTED")}
                        className="btn btn-outline-warning flex-grow-1"
                        title="Shortlist Candidate"
                      >
                        <i className="bi bi-star me-2"></i> Shortlist
                      </button>
                      <button
                        onClick={() => handleAction(app.id, "REJECTED")}
                        className="btn btn-outline-danger flex-grow-1"
                        title="Reject Application"
                      >
                        <i className="bi bi-x-circle me-2"></i> Reject
                      </button>
                      <button
                        onClick={() => handleAction(app.id, "HIRED")}
                        className="btn btn-primary flex-grow-1"
                        title="Hire Candidate"
                      >
                        <i className="bi bi-check-circle me-2"></i> Hire
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded border">
                      <div>
                        <span className="text-muted small text-uppercase">Current Status</span>
                        <h6 className={`mb-0 fw-bold ${app.status === "Hired" ? "text-success" :
                          app.status === "Shortlisted" ? "text-warning" :
                            "text-danger"
                          }`}>
                          {app.status === "Hired" && <i className="bi bi-check-circle-fill me-2"></i>}
                          {app.status === "Shortlisted" && <i className="bi bi-star-fill me-2"></i>}
                          {app.status === "Rejected" && <i className="bi bi-x-circle-fill me-2"></i>}
                          {app.status}
                        </h6>
                      </div>
                      <button
                        className="btn btn-sm btn-link text-decoration-none"
                        onClick={() => handleAction(app.id, "Pending")}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="col-12 mt-4 text-center">
              <p className="text-muted">No applications to review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
