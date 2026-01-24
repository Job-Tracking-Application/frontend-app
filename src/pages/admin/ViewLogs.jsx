import React, { useEffect, useState } from "react";
import { getLogs } from "../../services/adminService";
import { useLanguage } from "../../context/LanguageContext";
import PageHero from "../../components/common/PageHero";

const ViewLogs = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLogs = async () => {
      try {
        const res = await getLogs();
        if (mounted) setLogs(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLogs();
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="text-center py-5">{t("Loading...")}</div>;

  return (
    <div>
      <PageHero title={t("System Logs")} subtitle={t("Audit trail of system activities.")} />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4">
          <ul className="list-group list-group-flush">
            {logs.map(log => (
              <li key={log.id} className="list-group-item">
                <strong>{log.action}</strong> – {log.entity} #{log.entityId}
                <br />
                <small className="text-muted">
                  {new Date(log.performedAt).toLocaleString()}
                </small>
              </li>
            ))}
            {logs.length === 0 && (
              <li className="list-group-item text-center text-muted">
                {t("No logs available")}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;