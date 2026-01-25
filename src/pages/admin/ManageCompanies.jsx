import { useEffect, useState } from "react";
import { getCompanies, verifyCompany } from "../../services/adminService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageCompanies = () => {
  const { t } = useTranslation();
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
        showErrorToast(t("Failed to load companies"));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCompanies();
    return () => (mounted = false);
  }, [t]);

  const showVerifyConfirmation = (id, verified) => {
    const action = verified ? t("mark this company as unverified") : t("verify this company");
    setConfirmModal({
      show: true,
      title: verified ? t("Mark Unverified") : t("Verify Company"),
      message: t("Are you sure you want to {{action}}?", { action }),
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
      const action = confirmModal.verified ? t("unverified") : t("verified");
      showSuccessToast(t("Company {{action}} successfully", { action }));
    } catch (err) {
      console.error("Error verifying company:", err);
      showErrorToast(t("Failed to verify company"));
    }
    setConfirmModal({ show: false, title: "", message: "", companyId: null, verified: null });
  };

  if (loading) return <div className="text-center py-5">{t("Loading...")}</div>;

  return (
    <div>
      <PageHero title={t("Manage Companies")} subtitle={t("Registered organizations.")} />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          {/* Desktop Table View */}
          <div className="table-responsive-mobile">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-3 py-3">{t("Name")}</th>
                    <th className="px-3 py-3">{t("City")}</th>
                    <th className="px-3 py-3">{t("Email")}</th>
                    <th className="px-3 py-3">{t("Verified")}</th>
                    <th className="text-end px-3 py-3">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(c => (
                    <tr key={c.id}>
                      <td className="px-3 py-3 fw-semibold">{c.name}</td>
                      <td className="px-3 py-3">{c.city}</td>
                      <td className="px-3 py-3 text-muted small">{c.contactEmail}</td>
                      <td className="px-3 py-3">
                        <span className={`badge ${c.verified ? "bg-success" : "bg-warning"}`}>
                          {c.verified ? t("Verified") : t("Pending")}
                        </span>
                      </td>
                      <td className="text-end px-3 py-3">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => showVerifyConfirmation(c.id, c.verified)}
                        >
                          {c.verified ? t("Unverify") : t("Verify")}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {companies.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        {t("No companies found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {companies.length === 0 ? (
              <div className="text-center py-5 text-muted">
                {t("No companies found")}
              </div>
            ) : (
              <div className="p-3">
                {companies.map((c) => (
                  <div key={c.id} className="mobile-card-item">
                    <div className="mobile-card-header">
                      <div className="flex-grow-1">
                        <h6 className="mobile-card-title">{c.name}</h6>
                        <div className="mobile-card-details">
                          <div>
                            <i className="bi bi-geo-alt me-1"></i>
                            {c.city}
                          </div>
                          <div className="text-break-mobile">
                            <i className="bi bi-envelope me-1"></i>
                            {c.contactEmail}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${c.verified ? "bg-success" : "bg-warning"} ms-2`}>
                        {c.verified ? t("Verified") : t("Pending")}
                      </span>
                    </div>
                    <div className="mobile-card-actions">
                      <button
                        className="btn btn-sm btn-primary btn-mobile-full touch-target"
                        onClick={() => showVerifyConfirmation(c.id, c.verified)}
                      >
                        {c.verified ? t("Unverify") : t("Verify")}
                      </button>
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
        onCancel={() => setConfirmModal({ show: false, title: "", message: "", companyId: null, verified: null })}
        confirmText={t("Yes, Confirm")}
        cancelText={t("Cancel")}
        variant="primary"
      />
    </div>
  );
};

export default ManageCompanies;