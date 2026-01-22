import React, { useEffect, useState } from "react";
import { getApplications, deleteApplication } from "../../services/adminService";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    applicationId: null
  });

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "APPLIED", label: "Applied" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
    { value: "INTERVIEW_COMPLETED", label: "Interview Completed" },
    { value: "SELECTED", label: "Selected" },
    { value: "REJECTED", label: "Rejected" },
    { value: "WITHDRAWN", label: "Withdrawn" }
  ];

  const fetchApplications = async (page = 0, status = null) => {
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
      showErrorToast("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, statusFilter || null);
  }, [currentPage, statusFilter]);

  const filteredApplications = applications.filter(app =>
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobSeekerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showDeleteConfirmation = (applicationId, jobTitle, jobSeekerName) => {
    setConfirmModal({
      show: true,
      title: "Delete Application",
      message: `Are you sure you want to delete the application by ${jobSeekerName} for ${jobTitle}? This action cannot be undone.`,
      applicationId: applicationId
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteApplication(confirmModal.applicationId);
      showSuccessToast("Application deleted successfully");
      // Refresh the current page
      fetchApplications(currentPage, statusFilter || null);
    } catch (err) {
      console.error("Error deleting application:", err);
      showErrorToast("Failed to delete application");
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
      case "SELECTED":
        return "bg-success";
      case "REJECTED":
        return "bg-danger";
      case "WITHDRAWN":
        return "bg-secondary";
      case "INTERVIEW_SCHEDULED":
      case "INTERVIEW_COMPLETED":
        return "bg-info";
      case "UNDER_REVIEW":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading && applications.length === 0) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div>
      <PageHero 
        title="Manage Applications" 
        subtitle="View and moderate job applications for abuse prevention." 
      />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="row align-items-center">
              <div className="col-md-4">
                <h5 className="fw-bold mb-0">
                  Applications ({totalElements})
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
                  placeholder="Search by job title or applicant..."
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
                  <th>Job & Applicant</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th>Last Updated</th>
                  <th>Resume</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <strong className="d-block">{app.jobTitle}</strong>
                        <small className="text-muted">by {app.jobSeekerName}</small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                        {app.status.replace(/_/g, ' ')}
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
                          View Resume
                        </a>
                      ) : (
                        <span className="text-muted">No resume</span>
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => showDeleteConfirmation(
                          app.id, 
                          app.jobTitle, 
                          app.jobSeekerName
                        )}
                        title="Delete abusive application"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      {searchTerm ? "No applications match your search" : "No applications found"}
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
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} applications
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        Previous
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
                        Next
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
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ManageApplications;