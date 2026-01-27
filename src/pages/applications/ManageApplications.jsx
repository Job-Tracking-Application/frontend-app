import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/applicationService";
import { getMyJobs } from "../../services/jobService";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ApplicationCard from "../../components/common/ApplicationCard";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import "./ManageApplications.css";

const ManageApplications = memo(() => {
  const { t } = useTranslation();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (selectedJobId) {
      loadApplications(selectedJobId);
    }
  }, [selectedJobId]); // Only run when selectedJobId changes

  const loadJobs = useCallback(async () => {
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
  }, [t]);

  const loadApplications = useCallback(async (jobId) => {
    try {
      setApplicationsLoading(true);
      const data = await getApplicationsForJob(jobId);
      const applicationsArray = Array.isArray(data) ? data : [];
      setApplications(applicationsArray);
    } catch (err) {
      console.error("Error loading applications:", err);
      showErrorToast(t("error_load_applications"));
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  }, [t]);

  const handleJobChange = useCallback((e) => {
    const newJobId = Number(e.target.value);
    setSelectedJobId(newJobId);
    setApplications([]); // Clear applications while loading new ones
  }, []);

  const handleStatusUpdate = useCallback(async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      
      // Update the application status in the local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      // Show success message with status
      const statusMessages = {
        'UNDER_REVIEW': t('status_under_review'),
        'INTERVIEWED': t('status_interviewed'),
        'SHORTLISTED': t('status_shortlisted'),
        'REJECTED': t('status_rejected'),
        'HIRED': t('status_hired'),
        'PENDING': t('status_pending')
      };
      
      showSuccessToast(`${t("application_status_updated")} - ${statusMessages[status] || status}`);
      
    } catch (err) {
      console.error("Error updating application:", err);
      
      // Show more specific error messages
      let errorMessage = t("error_update_application");
      if (err.message) {
        errorMessage += `: ${err.message}`;
      } else if (err.response?.data?.message) {
        errorMessage += `: ${err.response.data.message}`;
      }
      
      showErrorToast(errorMessage);
      throw err; // Re-throw so ApplicationCard can handle loading state
    }
  }, [t]);

  const selectedJob = useMemo(() => 
    jobs.find((j) => j.id === selectedJobId), 
    [jobs, selectedJobId]
  );

  if (loading) return <Loader message={t("loading")} />;

  return (
    <div className="manage-applications-page">
      <PageHero
        title={t("manage_applications")}
        subtitle={t("manage_applications_subtitle")}
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
                  disabled={applicationsLoading}
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
                    {applications.length} {applications.length === 1 ? t("application") : t("applications")}
                  </p>
                </div>
              </div>
            )}

            {/* Applications */}
            {applicationsLoading ? (
              <Loader message={t("loading")} />
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
                    <ApplicationCard 
                      application={app} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

ManageApplications.displayName = 'ManageApplications';

export default ManageApplications;