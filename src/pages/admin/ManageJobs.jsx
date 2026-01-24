import { useEffect, useState } from "react";
import { getJobs, deleteJob, verifyJob } from "../../services/adminService";
import { useLanguage } from "../../context/LanguageContext";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageJobs = () => {
  const { t } = useLanguage();
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
        if (mounted) setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        showErrorToast(t("Failed to load jobs"));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJobs();
    return () => (mounted = false);
  }, [t]);

  const showDeleteConfirmation = (id) => {
    setConfirmModal({
      show: true,
      title: t("Delete Job"),
      message: t("Are you sure you want to delete this job? This action cannot be undone."),
      action: "delete",
      jobId: id
    });
  };

  const showVerifyConfirmation = (id, isActive) => {
    const action = isActive ? t("deactivate") : t("activate");
    setConfirmModal({
      show: true,
      title: isActive ? t("Deactivate Job") : t("Activate Job"),
      message: t("Are you sure you want to {{action}} this job?", { action }),
      action: "verify",
      jobId: id,
      isActive: isActive
    });
  };

  const handleConfirm = async () => {
    try {
      if (confirmModal.action === "delete") {
        await deleteJob(confirmModal.jobId);
        setJobs(prev => prev.filter(j => j.id !== confirmModal.jobId));
        showSuccessToast(t("Job deleted successfully"));
      } else if (confirmModal.action === "verify") {
        await verifyJob(confirmModal.jobId);
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

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5">{t("Loading...")}</div>;

  return (
    <div>
      <PageHero title={t("Manage Jobs")} subtitle={t("Review and moderate job postings.")} />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="d-flex justify-content-between">
              <h5 className="fw-bold mb-0">{t("Jobs")} ({filteredJobs.length})</h5>
              <input
                className="form-control w-25"
                placeholder={t("Search jobs...")}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>{t("Title")}</th>
                <th>{t("Company")}</th>
                <th>{t("Status")}</th>
                <th className="text-end">{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(j => (
                <tr key={j.id}>
                  <td>{j.title}</td>
                  <td>{j.companyName}</td>
                  <td>
                    <span className={`badge ${j.isActive ? "bg-success" : "bg-warning"}`}>
                      {j.isActive ? t("Active") : t("Inactive")}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => showVerifyConfirmation(j.id, j.isActive)}
                    >
                      {j.isActive ? t("Deactivate") : t("Activate")}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => showDeleteConfirmation(j.id)}
                    >
                      {t("Delete")}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    {t("No jobs found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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