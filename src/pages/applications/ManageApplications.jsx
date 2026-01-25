import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/applicationService";
import { getMyJobs } from "../../services/jobService";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageApplications = () => {
  const { t } = useTranslation(); // ✅ FIX: t now always exists

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  /* =======================
     LOAD JOBS
  ======================= */
  useEffect(() => {
    loadJobs();
  }, []);

  /* =======================
     LOAD APPLICATIONS
  ======================= */
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

      if (jobsData.length > 0) {
        setSelectedJobId(jobsData[0].id);
      }
    } catch (err) {
      console.error("Error loading jobs:", err);
      showErrorToast(t("error_load_jobs"));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async (jobId) => {
    try {
      setApplicationsLoading(true);
      const data = await getApplicationsForJob(jobId);
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading applications:", err);
      showErrorToast(t("error_load_applications"));
      setApplications([]);
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
      showSuccessToast(t("application_status_updated"));

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Error updating application:", err);
      showErrorToast(t("error_update_application"));
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  if (loading) return <Loader />;

  return (
    <div>
      <PageHero
        title={t("manage_applications")}
        subtitle={t("manage_applications_subtitle")}
      />

      <div className="container pb-5">
        {jobs.length === 0 ? (
          <EmptyState
            icon="bi-briefcase"
            title={t("no_jobs_posted")}
            message={t("no_jobs_posted_msg")}
            actionText={t("post_job")}
            actionLink="/jobs/create"
          />
        ) : (
          <>
            {/* Job selector */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  {t("select_job")}
                </label>
                <select
                  className="form-select"
                  value={selectedJobId || ""}
                  onChange={handleJobChange}
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} – {job.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job info */}
            {selectedJob && (
              <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                  <h5 className="mb-1">{selectedJob.title}</h5>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-1"></i>
                    {selectedJob.location} •{" "}
                    {applications.length} {t("applications")}
                  </p>
                </div>
              </div>
            )}

            {/* Applications */}
            {applicationsLoading ? (
              <Loader />
            ) : applications.length === 0 ? (
              <EmptyState
                icon="bi-person-x"
                title={t("no_applications")}
                message={t("no_applications_msg")}
                actionText={t("view_job")}
                actionLink={`/jobs/${selectedJobId}`}
              />
            ) : (
              <div className="row g-4">
                {applications.map((app) => (
                  <div key={app.id} className="col-lg-6">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="fw-bold">{app.name}</h5>
                        <p className="text-muted mb-2">{app.email}</p>

                        <a
                          href={app.resume}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary mb-3"
                        >
                          {t("view_resume")}
                        </a>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => handleAction(app.id, "SHORTLISTED")}
                          >
                            {t("shortlist")}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleAction(app.id, "REJECTED")}
                          >
                            {t("reject")}
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={() => handleAction(app.id, "HIRED")}
                          >
                            {t("hire")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;