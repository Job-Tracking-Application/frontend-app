import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ApplicationCard = ({ application, onStatusUpdate }) => {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(application.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'APPLIED': { class: 'bg-primary', text: t('status_applied') },
      'SHORTLISTED': { class: 'bg-warning text-dark', text: t('status_shortlisted') },
      'REJECTED': { class: 'bg-danger', text: t('status_rejected') },
      'HIRED': { class: 'bg-success', text: t('status_hired') },
      'UNDER_REVIEW': { class: 'bg-info', text: t('status_under_review') }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    
    return (
      <span className={`badge ${config.class} mb-2`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="fw-bold mb-0">
            {application.name || application.candidateName || 'Unknown Candidate'}
          </h5>
          {getStatusBadge(application.status)}
        </div>
        
        <p className="text-muted mb-2">
          <i className="bi bi-envelope me-1"></i>
          {application.email || application.candidateEmail || 'No email provided'}
        </p>

        {application.phone && (
          <p className="text-muted mb-2">
            <i className="bi bi-telephone me-1"></i>
            {application.phone}
          </p>
        )}

        {application.appliedOn && (
          <p className="text-muted mb-3">
            <i className="bi bi-calendar me-1"></i>
            {t("applied_on")}: {new Date(application.appliedOn).toLocaleDateString()}
          </p>
        )}

        {/* Resume link */}
        {application.resume || application.resumeUrl ? (
          <a
            href={application.resume || application.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-outline-primary mb-3"
          >
            <i className="bi bi-file-earmark-text me-1"></i>
            {t("view_resume")}
          </a>
        ) : (
          <p className="text-muted mb-3">
            <i className="bi bi-file-earmark-x me-1"></i>
            {t("no_resume")}
          </p>
        )}

        {/* Action buttons */}
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-warning btn-sm"
            onClick={() => handleStatusUpdate("SHORTLISTED")}
            disabled={isUpdating || application.status === 'SHORTLISTED'}
            data-testid={`shortlist-btn-${application.id}`}
          >
            {isUpdating ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {t("loading")}...
              </>
            ) : (
              <>
                <i className="bi bi-star me-1"></i>
                {t("shortlist")}
              </>
            )}
          </button>
          
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => handleStatusUpdate("REJECTED")}
            disabled={isUpdating || application.status === 'REJECTED'}
            data-testid={`reject-btn-${application.id}`}
          >
            {isUpdating ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {t("loading")}...
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-1"></i>
                {t("reject")}
              </>
            )}
          </button>
          
          <button
            className="btn btn-success btn-sm"
            onClick={() => handleStatusUpdate("HIRED")}
            disabled={isUpdating || application.status === 'HIRED'}
            data-testid={`hire-btn-${application.id}`}
          >
            {isUpdating ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {t("loading")}...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-1"></i>
                {t("hire")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;