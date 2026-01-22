import React, { useEffect, useState } from "react";
import { getJobs, deleteJob, verifyJob } from "../../services/adminService";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageJobs = () => {
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
        showErrorToast("Failed to load jobs");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJobs();
    return () => (mounted = false);
  }, []);

  const showDeleteConfirmation = (id) => {
    setConfirmModal({
      show: true,
      title: "Delete Job",
      message: "Are you sure you want to delete this job? This action cannot be undone.",
      action: "delete",
      jobId: id
    });
  };

  const showVerifyConfirmation = (id, isActive) => {
    setConfirmModal({
      show: true,
      title: isActive ? "Deactivate Job" : "Activate Job",
      message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} this job?`,
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
        showSuccessToast("Job deleted successfully");
      } else if (confirmModal.action === "verify") {
        await verifyJob(confirmModal.jobId);
        setJobs(prev =>
          prev.map(j =>
            j.id === confirmModal.jobId
              ? { ...j, isActive: !confirmModal.isActive }
              : j
          )
        );
        showSuccessToast(`Job ${confirmModal.isActive ? "deactivated" : "activated"} successfully`);
      }
    } catch (err) {
      console.error("Error:", err);
      showErrorToast("Failed to perform action on job");
    }
    setConfirmModal({ show: false, title: "", message: "", action: null, jobId: null, isActive: null });
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <PageHero title="Manage Jobs" subtitle="Review and moderate job postings." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="d-flex justify-content-between">
              <h5 className="fw-bold mb-0">Jobs ({filteredJobs.length})</h5>
              <input
                className="form-control w-25"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(j => (
                <tr key={j.id}>
                  <td>{j.title}</td>
                  <td>{j.companyName}</td>
                  <td>
                    <span className={`badge ${j.isActive ? "bg-success" : "bg-warning"}`}>
                      {j.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => showVerifyConfirmation(j.id, j.isActive)}
                    >
                      {j.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => showDeleteConfirmation(j.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredJobs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No jobs found
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
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        variant={confirmModal.action === "delete" ? "danger" : "warning"}
      />
    </div>
  );
};

export default ManageJobs;