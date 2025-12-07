import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import PageHero from "../../components/common/PageHero";

const ViewLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      try {
        const res = await adminService.getLogs();
        if (mounted) setLogs(res.data || []);
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLogs();
    return () => (mounted = false);
  }, []);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHero title="System Logs" subtitle="Audit trail of system activities and events." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white p-4 border-0 border-bottom">
            <h5 className="mb-0 fw-bold"><i className="bi bi-activity me-2"></i>Activity Log</h5>
          </div>
          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {logs.map((log) => (
                <div key={log.id} className="list-group-item p-4 border-bottom-0 border-top d-flex align-items-start hover-bg-light transition-all">
                  <div className="me-3 mt-1">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary" style={{ width: '40px', height: '40px' }}>
                      <i className="bi bi-clock-history"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1 fw-bold text-dark">{log.action}</h6>
                      <small className="text-muted bg-light px-2 py-1 rounded border">{log.date}</small>
                    </div>
                    <p className="mb-0 text-muted small">
                      System event logged with ID <span className="font-monospace text-dark">#{log.id}</span>
                    </p>
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-5 text-muted">No logs available.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;
