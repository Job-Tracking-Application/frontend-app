import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

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

  if (loading) return <div className="p-4">Loading logs…</div>;

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">System Logs</h1>

      <ul className="list-group">
        {logs.map((log) => (
          <li key={log.id} className="list-group-item">
            <p className="mb-1"><strong>Action:</strong> {log.action}</p>
            <p className="mb-0"><strong>Date:</strong> {log.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewLogs;
