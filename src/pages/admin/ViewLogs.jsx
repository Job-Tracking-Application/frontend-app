import React, { useEffect, useState } from "react";
import { getLogs } from "../../services/adminService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";

const ViewLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      try {
        const res = await getLogs();
        if (mounted) {
          // Handle ApiResponse wrapper - data might be in res.data.data
          let logsData;
          if (res?.data?.data) {
            // Paginated response
            if (res.data.data.content) {
              logsData = res.data.data.content;
            } else {
              logsData = res.data.data;
            }
          } else if (res?.data) {
            // Direct response
            if (Array.isArray(res.data)) {
              logsData = res.data;
            } else if (res.data.content) {
              logsData = res.data.content;
            } else {
              logsData = [];
            }
          } else {
            logsData = [];
          }
          
          // Sort by most recent first (in case backend doesn't sort)
          const sortedLogs = Array.isArray(logsData) ? logsData.sort((a, b) => 
            new Date(b.performedAt) - new Date(a.performedAt)
          ) : [];
          setLogs(sortedLogs);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setLogs([]); // Ensure logs is always an array
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLogs();
    return () => (mounted = false);
  }, []);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

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
                  {t("Activity Logs")} ({logs.length})
                </h5>
              </div>
              <div className="col-12 col-md-6 text-md-end text-center">
                <small className="text-muted text-mobile-sm">
                  {t("Showing {{start}} to {{end}} of {{total}}", {
                    start: indexOfFirstLog + 1,
                    end: Math.min(indexOfLastLog, logs.length),
                    total: logs.length
                  })}
                </small>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {currentLogs.length > 0 ? (
              <div className="list-group list-group-flush">
                {currentLogs.map((log) => (
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
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link touch-target"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {t("Previous")}
                    </button>
                  </li>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                        <button 
                          className="page-link touch-target"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link touch-target"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
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