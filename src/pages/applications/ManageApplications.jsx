import React, { useEffect, useState } from "react";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/applicationService";
import { getMyJobs } from "../../services/jobService";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // Load recruiter's jobs on component mount
  useEffect(() => {
    loadJobs();
  }, []);

  // Load applications when a job is selected
  useEffect(() => {
    if (selectedJobId) {
      loadApplications(selectedJobId);
    }
  }, [selectedJobId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await getMyJobs();
      const jobsData = response.data || [];
      setJobs(jobsData);
      
      // Auto-select first job if available
      if (jobsData.length > 0) {
        setSelectedJobId(jobsData[0].id);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      showErrorToast("Failed to load your jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId) => {
    try {
      setApplicationsLoading(true);
      const data = await getApplicationsForJob(jobId);
      // Ensure data is an array
      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        console.warn('Expected array but got:', data);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      showErrorToast("Failed to load applications");
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleJobChange = (e) => {
    const jobId = parseInt(e.target.value);
    setSelectedJobId(jobId);
  };

  const handleAction = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      showSuccessToast(`Application ${status.toLowerCase()} successfully!`);
      
      // Optimistic update for UI
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    } catch (error) {
      console.error(`Error updating application status:`, error);
      showErrorToast("Failed to update application status");
    }
  };

  const getSelectedJob = () => {
    return jobs.find(job => job.id === selectedJobId);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <PageHero 
        title="Manage Applications" 
        subtitle="Review and take action on candidate applications for your job postings." 
      />

      <div className="container pb-5">
        {jobs.length === 0 ? (
          <EmptyState
            icon="bi-briefcase"
            title="No Jobs Posted"
            message="You haven't posted any jobs yet. Create a job posting to start receiving applications."
            actionText="Post a Job"
            actionLink="/jobs/create"
          />
        ) : (
          <>
            {/* Job Selection */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Select Job to Manage Applications:</label>
                <select 
                  className="form-select" 
                  value={selectedJobId || ''} 
                  onChange={handleJobChange}
                >
                  <option value="">Choose a job...</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedJobId && (
              <>
                {/* Selected Job Info */}
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{getSelectedJob()?.title}</h5>
                        <p className="text-muted mb-0">
                          <i className="bi bi-geo-alt me-1"></i>
                          {getSelectedJob()?.location} • 
                          <i className="bi bi-people ms-2 me-1"></i>
                          {applications.length} Application{applications.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-primary">
                          {getSelectedJob()?.jobType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                {applicationsLoading ? (
                  <Loader />
                ) : applications.length === 0 ? (
                  <EmptyState
                    icon="bi-person-x"
                    title="No Applications Yet"
                    message="No candidates have applied for this job yet. Share your job posting to attract more candidates."
                    actionText="View Job Details"
                    actionLink={`/jobs/${selectedJobId}`}
                  />
                ) : (
                  <div className="row g-4">
                    {applications.map((app) => (
                      <div key={app.id} className="col-lg-6">
                        <div className="card shadow-sm border-0 h-100">
                          <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="fw-bold mb-1">{app.name}</h5>
                                <p className="text-muted mb-0">
                                  <i className="bi bi-envelope me-1"></i>
                                  {app.email}
                                </p>
                              </div>
                              <span className={`badge ${
                                app.status === "HIRED" ? "bg-success" :
                                app.status === "SHORTLISTED" ? "bg-warning" :
                                app.status === "REJECTED" ? "bg-danger" :
                                "bg-secondary"
                              }`}>
                                {app.status || "APPLIED"}
                              </span>
                            </div>

                            {/* Skills */}
                            <div className="mb-3">
                              <label className="form-label small text-muted fw-bold">SKILLS</label>
                              <div className="d-flex flex-wrap gap-2">
                                {app.skills && app.skills.length > 0 ? (
                                  app.skills.map((skill, i) => (
                                    <span key={i} className="badge bg-light text-dark border">
                                      {skill}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-muted small">No skills listed</span>
                                )}
                              </div>
                            </div>

                            {/* Resume */}
                            <div className="mb-4">
                              {app.resume ? (
                                <a 
                                  href={app.resume} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="d-inline-flex align-items-center text-decoration-none p-2 bg-light rounded text-dark hover-shadow"
                                >
                                  <i className="bi bi-file-earmark-pdf text-danger me-2 fs-5"></i>
                                  <span>View Resume</span>
                                  <i className="bi bi-box-arrow-up-right ms-2 small"></i>
                                </a>
                              ) : (
                                <div className="p-2 bg-light rounded text-muted">
                                  <i className="bi bi-file-earmark-x me-2"></i>
                                  No resume provided
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            {(!app.status || app.status === "APPLIED") ? (
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
                                  <h6 className={`mb-0 fw-bold ${
                                    app.status === "HIRED" ? "text-success" :
                                    app.status === "SHORTLISTED" ? "text-warning" :
                                    "text-danger"
                                  }`}>
                                    {app.status === "HIRED" && <i className="bi bi-check-circle-fill me-2"></i>}
                                    {app.status === "SHORTLISTED" && <i className="bi bi-star-fill me-2"></i>}
                                    {app.status === "REJECTED" && <i className="bi bi-x-circle-fill me-2"></i>}
                                    {app.status}
                                  </h6>
                                </div>
                                <button
                                  className="btn btn-sm btn-link text-decoration-none"
                                  onClick={() => handleAction(app.id, "APPLIED")}
                                  title="Reset to Applied"
                                >
                                  <i className="bi bi-arrow-clockwise me-1"></i>
                                  Reset
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
