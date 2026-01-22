import React, { useEffect, useState } from "react";
import { getCompanies, verifyCompany } from "../../services/adminService";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    companyId: null,
    verified: null
  });

  useEffect(() => {
    let mounted = true;
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies();
        if (mounted) setCompanies(res.data || []);
      } catch (err) {
        console.error(err);
        showErrorToast("Failed to load companies");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCompanies();
    return () => (mounted = false);
  }, []);

  const showVerifyConfirmation = (id, verified) => {
    setConfirmModal({
      show: true,
      title: verified ? "Mark Unverified" : "Verify Company",
      message: `Are you sure you want to ${verified ? "mark this company as unverified" : "verify this company"}?`,
      companyId: id,
      verified: verified
    });
  };

  const handleConfirm = async () => {
    try {
      await verifyCompany(confirmModal.companyId, !confirmModal.verified);
      setCompanies(prev =>
        prev.map(c =>
          c.id === confirmModal.companyId
            ? { ...c, verified: !confirmModal.verified }
            : c
        )
      );
      showSuccessToast(`Company ${confirmModal.verified ? "unverified" : "verified"} successfully`);
    } catch (err) {
      console.error("Error verifying company:", err);
      showErrorToast("Failed to verify company");
    }
    setConfirmModal({ show: false, title: "", message: "", companyId: null, verified: null });
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <PageHero title="Manage Companies" subtitle="Registered organizations." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Email</th>
                <th>Verified</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.city}</td>
                  <td>{c.contactEmail}</td>
                  <td>
                    <span className={`badge ${c.verified ? "bg-success" : "bg-warning"}`}>
                      {c.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => showVerifyConfirmation(c.id, c.verified)}
                    >
                      {c.verified ? "Unverify" : "Verify"}
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No companies found
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
        onCancel={() => setConfirmModal({ show: false, title: "", message: "", companyId: null, verified: null })}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  );
};

export default ManageCompanies;