import React, { useEffect, useState } from "react";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/applicationService";
import { getMyJobs } from "../../services/jobService";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/LanguageContext";

const ManageApplications = () => {
  const { t } = useLanguage();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  /* 🔑 Backend status → translation key */
  const getStatusKey = (status) => {
    switch (status) {
      case "APPLIED":
        return "status_applied";
      case "SHORTLISTED":
        return "status_shortlisted";
      case "REJECTED":
        return "status_rejected";
      case "HIRED":
        return "status_hired";
      default:
        return "status_applied";
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadApplications(selectedJobId);
    }
  }, [selectedJobId]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await getMyJobs();
      const data = res.data || [];
      setJobs(data);
      if (data.length > 0) setSelectedJobId(data[0].id);
    } catch {
      showErrorToast(t("load_jobs_error"));
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId) => {
    try {
      setApplicationsLoading(true);
      const data = await getApplicationsForJob(jobId);
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      showErrorToast(t("load_apps_error"));
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleJobChange = (e) => {
    setSelectedJobId(Number(e.target.value));
  };

  const handleAction = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);

      showSuccessToast(
        t("update_status_success", {
          status: t(getStatusKey(status))
        })
      );

      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch {
      showErrorToast(t("update_status_error"));
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHero
        title={t("recruiter_manage_applications_title")}
        subtitle={t("recruiter_manage_applications_subtitle")}
      />

      <div className="container pb-5">
        {jobs.length === 0 ? (
          <EmptyState
            icon="bi-briefcase"
            title={t("no_jobs_posted_title")}
            message={t("no_jobs_posted_msg")}
            actionText={t("post_job_action")}
            actionLink="/jobs/create"
          />
        ) : (
          <>
            {/* Job selection */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  {t("select_job_label")}
                </label>
                <select
                  className="form-select"
                  value={selectedJobId || ""}
                  onChange={handleJobChange}
                >
                  <option value="">{t("choose_job_placeholder")}</option>
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
                {/* Job info */}
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{selectedJob?.title}</h5>
                      <p className="text-muted mb-0">
                        {selectedJob?.location} • {applications.length} {t("total_applications")}
                      </p>
                    </div>
                    <span className="badge bg-primary">
                      {selectedJob?.jobType}
                    </span>
                  </div>
                </div>

                {applicationsLoading ? (
                  <Loader />
                ) : applications.length === 0 ? (
                  <EmptyState
                    icon="bi-person-x"
                    title={t("no_apps_yet_title")}
                    message={t("apply_more_msg")}
                  />
                ) : (
                  <div className="row g-4">
                    {applications.map(app => (
                      <div key={app.id} className="col-lg-6">
                        <div className="card shadow-sm border-0 h-100">
                          <div className="card-body">

                            {/* Header + SMALL status badge */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h5 className="mb-1">{app.name}</h5>
                                <p className="text-muted mb-0">{app.email}</p>
                              </div>

                              <span
                                className={`badge rounded-pill px-3 py-1 fw-semibold text-uppercase ${app.status === "HIRED"
                                    ? "bg-success"
                                    : app.status === "SHORTLISTED"
                                      ? "bg-warning text-dark"
                                      : app.status === "REJECTED"
                                        ? "bg-danger"
                                        : "bg-secondary"
                                  }`}
                                style={{
                                  fontSize: "0.75rem",
                                  height: "fit-content"
                                }}
                              >
                                {t(getStatusKey(app.status))}
                              </span>
                            </div>

                            {/* Skills */}
                            <label className="fw-bold small">
                              {t("recruiter_skills_label")}
                            </label>

                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {app.skills?.length ? (
                                app.skills.map((s, i) => (
                                  <span key={i} className="badge bg-light text-dark border">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted small">
                                  {t("no_skills")}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            {(!app.status || app.status === "APPLIED") && (
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() => handleAction(app.id, "SHORTLISTED")}
                                >
                                  {t("shortlist")}
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleAction(app.id, "REJECTED")}
                                >
                                  {t("reject")}
                                </button>
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleAction(app.id, "HIRED")}
                                >
                                  {t("hire")}
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
