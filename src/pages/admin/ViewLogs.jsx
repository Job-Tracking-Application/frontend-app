import { useEffect, useState } from "react";
import { getLogs } from "../../services/adminService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";

const ViewLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Backend uses 0-based indexing
  const [logsPerPage] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await getLogs(currentPage, logsPerPage);
        if (mounted) {
          // Handle ApiResponse wrapper with pagination
          if (res?.data?.data) {
            const pageData = res.data.data;
            setLogs(pageData.content || []);
            setTotalElements(pageData.totalElements || 0);
            setTotalPages(pageData.totalPages || 0);
          } else if (res?.data) {
            // Fallback for non-paginated response
            setLogs(Array.isArray(res.data) ? res.data : []);
            setTotalElements(Array.isArray(res.data) ? res.data.length : 0);
            setTotalPages(1);
          } else {
            setLogs([]);
            setTotalElements(0);
            setTotalPages(0);
          }
        }
      } catch (err) {
        console.error("Failed to fetch logs:", err);
        if (mounted) {
          setLogs([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLogs();
    return () => (mounted = false);
  }, [currentPage, logsPerPage]);

  // Pagination logic - now using server-side pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('DELETE') || action.includes('Deleted')) return 'bg-danger';
    if (action.includes('CREATED') || action.includes('Created')) return 'bg-success';
    if (action.includes('UPDATED') || action.includes('changed')) return 'bg-warning';
    if (action.includes('VERIFIED') || action.includes('Activated')) return 'bg-info';
    return 'bg-secondary';
  };

  const getEntityIcon = (entity) => {
    switch (entity?.toLowerCase()) {
      case 'user': return 'bi-person';
      case 'job': return 'bi-briefcase';
      case 'company': return 'bi-building';
      case 'application': return 'bi-file-earmark-text';
      default: return 'bi-gear';
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const logDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - logDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return t("Just now");
    if (diffInMinutes < 60) return t("{{minutes}} minutes ago", { minutes: diffInMinutes });
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t("{{hours}} hours ago", { hours: diffInHours });
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return t("{{days}} days ago", { days: diffInDays });
    
    return logDate.toLocaleDateString();
  };

  if (loading) return <div className="text-center py-5">{t("Loading...")}</div>;

  return (
    <div>
      <PageHero title={t("System Logs")} subtitle={t("Audit trail of system activities.")} />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <h5 className="fw-bold mb-0">
                  {t("Activity Logs")} ({totalElements})
                </h5>
              </div>
              <div className="col-12 col-md-6 text-md-end text-center">
                <small className="text-muted text-mobile-sm">
                  {t("Showing {{start}} to {{end}} of {{total}}", {
                    start: currentPage * logsPerPage + 1,
                    end: Math.min((currentPage + 1) * logsPerPage, totalElements),
                    total: totalElements
                  })}
                </small>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {logs.length > 0 ? (
              <div className="list-group list-group-flush">
                {logs.map((log) => (
                  <div key={log.id} className="list-group-item border-0 py-3 px-3 px-md-4">
                    <div className="row align-items-center g-2">
                      {/* Desktop: Show icon */}
                      <div className="col-auto desktop-only">
                        <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className={`bi ${getEntityIcon(log.entity)} text-primary`}></i>
                        </div>
                      </div>
                      
                      <div className="col">
                        <div className="d-flex flex-mobile-column align-items-start align-items-md-center mb-2 mb-md-1 gap-2">
                          <div className="d-flex align-items-center flex-wrap gap-2">
                            {/* Mobile: Show icon inline */}
                            <i className={`bi ${getEntityIcon(log.entity)} text-primary mobile-only`}></i>
                            <span className={`badge ${getActionBadgeClass(log.action)}`}>
                              {log.action}
                            </span>
                            <strong className="text-capitalize">{log.entity}</strong>
                            {log.entityId && (
                              <span className="text-muted">#{log.entityId}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="d-flex flex-mobile-column align-items-start align-items-md-center text-muted small gap-1 gap-md-2">
                          <div className="d-flex align-items-center">
                            <i className="bi bi-clock me-1"></i>
                            <span>{formatTimeAgo(log.performedAt)}</span>
                          </div>
                          <span className="desktop-only">•</span>
                          <span className="text-muted text-mobile-xs">
                            {new Date(log.performedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5 text-muted px-3">
                <i className="bi bi-journal-text fs-1 mb-3 d-block"></i>
                <h6>{t("No logs available")}</h6>
                <p className="small">{t("System activities will appear here")}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white p-4 border-top">
              <nav className="d-flex justify-content-center">
                <ul className="pagination pagination-sm mb-0 flex-wrap">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link touch-target"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      {t("Previous")}
                    </button>
                  </li>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index;
                    } else if (currentPage <= 2) {
                      pageNumber = index;
                    } else if (currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 5 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                        <button 
                          className="page-link touch-target"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber + 1}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link touch-target"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      {t("Next")}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;