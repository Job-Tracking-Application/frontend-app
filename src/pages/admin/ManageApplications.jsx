import { useEffect, useState, useCallback } from "react";
import { getApplications, deleteApplication } from "../../services/adminApplicationService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageApplications = () => {
  const { t } = useTranslation();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    applicationId: null
  });

  const [viewModal, setViewModal] = useState({
    show: false,
    application: null
  });

  const statusOptions = [
    { value: "", label: t("All Statuses") },
    { value: "APPLIED", label: t("Applied") },
    { value: "UNDER_REVIEW", label: t("Under Review") },
    { value: "INTERVIEW_SCHEDULED", label: t("Interview Scheduled") },
    { value: "INTERVIEW_COMPLETED", label: t("Interview Completed") },
    { value: "SHORTLISTED", label: t("Shortlisted") },
    { value: "REJECTED", label: t("Rejected") },
    { value: "WITHDRAWN", label: t("Withdrawn") }
  ];

 const fetchApplications = useCallback(
    async (page = 0, status = null) => {
      try {
        setLoading(true);
        const res = await getApplications(page, pageSize, status);
        const data = res.data;

        setApplications(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setCurrentPage(data.number || 0);
      } catch (err) {
        console.error("Failed to load applications:", err);
        showErrorToast(t("Failed to load applications"));
      } finally {
        setLoading(false);
      }
    },
    [pageSize, t]
  );

  useEffect(() => {
    fetchApplications(currentPage, statusFilter || null);
  }, [currentPage, statusFilter, fetchApplications]);

  const filteredApplications = applications.filter(app =>
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobSeekerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showViewDetails = (application) => {
    setViewModal({ show: true, application });
  };

  const showDeleteConfirmation = (applicationId, jobTitle, jobSeekerName) => {
    setConfirmModal({
      show: true,
      title: t("Delete Application"),
      message: t(
        "Are you sure you want to delete the application by {{name}} for {{job}}? This action cannot be undone.",
        { name: jobSeekerName, job: jobTitle }
      ),
      applicationId
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteApplication(confirmModal.applicationId);
      showSuccessToast(t("Application deleted successfully"));
      fetchApplications(currentPage, statusFilter || null);
    } catch (err) {
      console.error("Error deleting application:", err);
      showErrorToast(t("Failed to delete application"));
    }
    setConfirmModal({ show: false, title: "", message: "", applicationId: null });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "APPLIED": return "bg-primary";
      case "UNDER_REVIEW": return "bg-warning";
      case "INTERVIEW_SCHEDULED":
      case "INTERVIEW_COMPLETED": return "bg-info";
      case "SELECTED": return "bg-success";
      case "REJECTED": return "bg-danger";
      case "WITHDRAWN": return "bg-secondary";
      default: return "bg-primary";
    }
  };

  const shouldDisableDelete = (status) => status === "SELECTED";

  const formatDate = (dateString) => {
    if (!dateString) return t("N/A");
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading && applications.length === 0) {
    return <div className="text-center py-5">{t("Loading...")}</div>;
  }

  return (
    <div>
      <PageHero 
        title={t("Manage Applications")} 
        subtitle={t("View and moderate job applications for abuse prevention.")} 
      />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h5 className="fw-bold mb-0">
                  {t("Applications")} ({totalElements})
                </h5>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(0);
                  }}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  className="form-control"
                  placeholder={t("Search by job title or applicant...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>{t("Job & Applicant")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Applied Date")}</th>
                  <th>{t("Last Updated")}</th>
                  <th>{t("Resume")}</th>
                  <th className="text-end">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <strong className="d-block">{app.jobTitle}</strong>
                        <small className="text-muted">{t("by")} {app.jobSeekerName}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                        {t(app.status.replace(/_/g, ' '))}
                      </span>
                    </td>
                    <td>
                      <small>{formatDate(app.appliedAt)}</small>
                    </td>
                    <td>
                      <small>{formatDate(app.updatedAt)}</small>
                    </td>
                    <td>
                      {app.resumePath ? (
                        <a 
                          href={app.resumePath} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          {t("View Resume")}
                        </a>
                      ) : (
                        <span className="text-muted">{t("No resume")}</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => showViewDetails(app)}
                          title={t("View application details")}
                        >
                          {t("View")}
                        </button>
                        <button
                          className={`btn btn-sm ${shouldDisableDelete(app.status) ? 'btn-secondary' : 'btn-outline-danger'}`}
                          onClick={() => showDeleteConfirmation(
                            app.id, 
                            app.jobTitle, 
                            app.jobSeekerName
                          )}
                          disabled={shouldDisableDelete(app.status)}
                          title={shouldDisableDelete(app.status) ? t("Cannot delete selected applications") : t("Delete abusive application")}
                        >
                          {t("Delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      {loading ? (
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          {t("Loading applications...")}
                        </div>
                      ) : searchTerm ? (
                        <>
                          <i className="bi bi-search mb-2 fs-4 d-block"></i>
                          {t("No applications match your search criteria")}
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-text mb-2 fs-4 d-block"></i>
                          {t("No applications found")}
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white p-4 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  {t("Showing {{start}} to {{end}} of {{total}} applications", {
                    start: currentPage * pageSize + 1,
                    end: Math.min((currentPage + 1) * pageSize, totalElements),
                    total: totalElements
                  })}
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        {t("Previous")}
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(index)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        {t("Next")}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ show: false, title: "", message: "", applicationId: null })}
        confirmText={t("Yes, Delete")}
        cancelText={t("Cancel")}
        variant="danger"
      />

      {/* View Details Modal */}
      {viewModal.show && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("Application Details")}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setViewModal({ show: false, application: null })}
                ></button>
              </div>
              <div className="modal-body">
                {viewModal.application && (
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="fw-bold">{t("Job Information")}</h6>
                      <p><strong>{t("Job Title")}:</strong> {viewModal.application.jobTitle}</p>
                      <p><strong>{t("Job ID")}:</strong> {viewModal.application.jobId}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">{t("Applicant Information")}</h6>
                      <p><strong>{t("Applicant")}:</strong> {viewModal.application.jobSeekerName}</p>
                      <p><strong>{t("Applicant ID")}:</strong> {viewModal.application.jobSeekerUserId}</p>
                    </div>
                    <div className="col-12">
                      <hr />
                      <h6 className="fw-bold">{t("Application Status")}</h6>
                      <p>
                        <span className={`badge ${getStatusBadgeClass(viewModal.application.status)}`}>
                          {t(viewModal.application.status.replace(/_/g, ' '))}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">{t("Timeline")}</h6>
                      <p><strong>{t("Applied")}:</strong> {formatDate(viewModal.application.appliedAt)}</p>
                      <p><strong>{t("Last Updated")}:</strong> {formatDate(viewModal.application.updatedAt)}</p>
                    </div>
                    <div className="col-md-6">
                      <h6 className="fw-bold">{t("Resume")}</h6>
                      {viewModal.application.resumePath ? (
                        <a 
                          href={viewModal.application.resumePath} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          <i className="bi bi-download me-1"></i>
                          {t("Download Resume")}
                        </a>
                      ) : (
                        <p className="text-muted">{t("No resume uploaded")}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setViewModal({ show: false, application: null })}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;