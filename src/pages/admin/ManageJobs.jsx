import { useEffect, useState } from "react";
import { getJobs, deleteJob, toggleJobStatus } from "../../services/adminService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageJobs = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    action: null,
    jobId: null,
    isActive: null
  });

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      try {
        const res = await getJobs();
        if (mounted) {
          // Handle ApiResponse wrapper - data is in res.data.data
          if (res?.data?.data && Array.isArray(res.data.data)) {
            setJobs(res.data.data);
          } else if (res?.data && Array.isArray(res.data)) {
            // Fallback if response is not wrapped
            setJobs(res.data);
          } else {
            // Ensure jobs is always an array
            setJobs([]);
          }
        }
      } catch (err) {
        console.error(err);
        showErrorToast(t("Failed to load jobs"));
        if (mounted) setJobs([]); // Ensure jobs is always an array
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJobs();
    return () => (mounted = false);
  }, [t]);

  const showDeleteConfirmation = (id, title) => {
    setConfirmModal({
      show: true,
      title: t("Delete Job"),
      message: t("Are you sure you want to delete '{{title}}'? This action cannot be undone.", { title }),
      action: "delete",
      jobId: id
    });
  };

  const showToggleStatusConfirmation = (id, isActive) => {
    const action = isActive ? t("deactivate") : t("activate");
    setConfirmModal({
      show: true,
      title: isActive ? t("Deactivate Job") : t("Activate Job"),
      message: t("Are you sure you want to {{action}} this job?", { action }),
      action: "toggle-status",
      jobId: id,
      isActive: isActive
    });
  };

  const handleConfirm = async () => {
    try {
      if (confirmModal.action === "delete") {
        await deleteJob(confirmModal.jobId);
        setJobs(prev => Array.isArray(prev) ? prev.filter(j => j.id !== confirmModal.jobId) : []);
        showSuccessToast(t("Job deleted successfully"));
      } else if (confirmModal.action === "toggle-status") {
        await toggleJobStatus(confirmModal.jobId);
        setJobs(prev =>
          prev.map(j =>
            j.id === confirmModal.jobId
              ? { ...j, isActive: !confirmModal.isActive }
              : j
          )
        );
        const action = confirmModal.isActive ? t("deactivated") : t("activated");
        showSuccessToast(t("Job {{action}} successfully", { action }));
      }
    } catch (err) {
      console.error("Error:", err);
      showErrorToast(t("Failed to perform action on job"));
    }
    setConfirmModal({ show: false, title: "", message: "", action: null, jobId: null, isActive: null });
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(j =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) return <div className="text-center py-5">{t("Loading...")}</div>;

  return (
    <div>
      <PageHero title={t("Manage Jobs")} subtitle={t("Review and moderate job postings.")} />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <h5 className="fw-bold mb-0">{t("Jobs")} ({filteredJobs.length})</h5>
              </div>
              <div className="col-12 col-md-6">
                <input
                  className="form-control"
                  placeholder={t("Search jobs...")}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="table-responsive-mobile">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-3 py-3">{t("Title")}</th>
                    <th className="px-3 py-3">{t("Company")}</th>
                    <th className="px-3 py-3">{t("Status")}</th>
                    <th className="text-end px-3 py-3">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map(j => (
                    <tr key={j.id}>
                      <td className="px-3 py-3 fw-semibold">{j.title}</td>
                      <td className="px-3 py-3">{j.companyName}</td>
                      <td className="px-3 py-3">
                        <span className={`badge ${j.isActive ? "bg-success" : "bg-warning"}`}>
                          {j.isActive ? t("Active") : t("Inactive")}
                        </span>
                      </td>
                      <td className="text-end px-3 py-3">
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => showToggleStatusConfirmation(j.id, j.isActive)}
                        >
                          {j.isActive ? t("Deactivate") : t("Activate")}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => showDeleteConfirmation(j.id, j.title)}
                        >
                          {t("Delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        {searchTerm ? (
                          <>
                            <i className="bi bi-search mb-2 fs-4 d-block"></i>
                            {t("No jobs match your search criteria")}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-briefcase mb-2 fs-4 d-block"></i>
                            {t("No jobs found")}
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-5 text-muted">
                {searchTerm ? (
                  <>
                    <i className="bi bi-search mb-2 fs-4 d-block"></i>
                    {t("No jobs match your search criteria")}
                  </>
                ) : (
                  <>
                    <i className="bi bi-briefcase mb-2 fs-4 d-block"></i>
                    {t("No jobs found")}
                  </>
                )}
              </div>
            ) : (
              <div className="p-3">
                {filteredJobs.map((j) => (
                  <div key={j.id} className="mobile-card-item">
                    <div className="mobile-card-header">
                      <div className="flex-grow-1">
                        <h6 className="mobile-card-title">{j.title}</h6>
                        <div className="mobile-card-details">
                          <div>
                            <i className="bi bi-building me-1"></i>
                            {j.companyName}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${j.isActive ? "bg-success" : "bg-warning"} ms-2`}>
                        {j.isActive ? t("Active") : t("Inactive")}
                      </span>
                    </div>
                    
                    <div className="mobile-card-actions">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-info flex-grow-1 touch-target"
                          onClick={() => showToggleStatusConfirmation(j.id, j.isActive)}
                        >
                          <i className={`bi ${j.isActive ? 'bi-pause-circle' : 'bi-play-circle'} me-1`}></i>
                          {j.isActive ? t("Deactivate") : t("Activate")}
                        </button>
                        <button
                          className="btn btn-sm btn-danger flex-grow-1 touch-target"
                          onClick={() => showDeleteConfirmation(j.id, j.title)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          {t("Delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ show: false, title: "", message: "", action: null, jobId: null, isActive: null })}
        confirmText={t("Yes, Confirm")}
        cancelText={t("Cancel")}
        variant={confirmModal.action === "delete" ? "danger" : "warning"}
      />
    </div>
  );
};

export default ManageJobs;