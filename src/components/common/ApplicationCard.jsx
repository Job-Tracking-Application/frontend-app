import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ApplicationCard = ({ application, onStatusUpdate }) => {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

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
      'UNDER_REVIEW': { class: 'bg-info', text: t('status_under_review') },
      'INTERVIEWED': { class: 'bg-info', text: t('status_interviewed') },
      'SHORTLISTED': { class: 'bg-warning text-dark', text: t('status_shortlisted') },
      'REJECTED': { class: 'bg-danger', text: t('status_rejected') },
      'HIRED': { class: 'bg-success', text: t('status_hired') },
      'PENDING': { class: 'bg-secondary', text: t('status_pending') }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const hasAdditionalInfo = application.portfolioUrl || application.linkedinUrl || 
                           application.githubUrl || application.coverLetter || 
                           application.additionalNotes || (application.skills && application.skills.length > 0);

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1 fw-bold text-primary">
              {application.name || application.candidateName || 'Unknown Candidate'}
            </h5>
            <small className="text-muted">
              <i className="bi bi-envelope me-1"></i>
              {application.email || application.candidateEmail || 'No email provided'}
            </small>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </div>

      <div className="card-body">
        {/* Skills Section */}
        {application.skills && application.skills.length > 0 && (
          <div className="mb-3">
            <h6 className="fw-bold text-secondary mb-2">
              <i className="bi bi-gear me-1"></i>
              {t("skills")}:
            </h6>
            <div className="d-flex flex-wrap gap-1">
              {application.skills.slice(0, showFullDetails ? application.skills.length : 3).map((skill, index) => (
                <span key={index} className="badge bg-light text-dark border">
                  {skill}
                </span>
              ))}
              {!showFullDetails && application.skills.length > 3 && (
                <span className="badge bg-secondary">
                  +{application.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact & Profile Links */}
        <div className="mb-3">
          <h6 className="fw-bold text-secondary mb-2">
            <i className="bi bi-person-lines-fill me-1"></i>
            {t("profile_links")}:
          </h6>
          <div className="d-flex flex-wrap gap-2">
            {/* Resume */}
            {application.resume || application.resumeUrl ? (
              <a
                href={application.resume || application.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                <i className="bi bi-file-earmark-text me-1"></i>
                {t("resume")}
              </a>
            ) : (
              <span className="text-muted small">
                <i className="bi bi-file-earmark-x me-1"></i>
                {t("no_resume")}
              </span>
            )}

            {/* Portfolio */}
            {application.portfolioUrl && (
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-info"
              >
                <i className="bi bi-globe me-1"></i>
                {t("portfolio")}
              </a>
            )}
            
            {/* LinkedIn */}
            {application.linkedinUrl && (
              <a
                href={application.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                <i className="bi bi-linkedin me-1"></i>
                LinkedIn
              </a>
            )}
            
            {/* GitHub */}
            {application.githubUrl && (
              <a
                href={application.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-dark"
              >
                <i className="bi bi-github me-1"></i>
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Cover Letter Preview */}
        {application.coverLetter && (
          <div className="mb-3">
            <h6 className="fw-bold text-secondary mb-2">
              <i className="bi bi-file-text me-1"></i>
              {t("cover_letter")}:
            </h6>
            <div className="bg-light p-2 rounded">
              <p className="mb-0 small text-muted" style={{ 
                maxHeight: showFullDetails ? 'none' : '60px', 
                overflow: showFullDetails ? 'visible' : 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {application.coverLetter}
              </p>
              {application.coverLetter.length > 100 && (
                <button 
                  className="btn btn-link btn-sm p-0 mt-1"
                  onClick={() => setShowFullDetails(!showFullDetails)}
                >
                  {showFullDetails ? t("show_less") : t("show_more")}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {application.additionalNotes && (
          <div className="mb-3">
            <h6 className="fw-bold text-secondary mb-2">
              <i className="bi bi-chat-text me-1"></i>
              {t("additional_notes")}:
            </h6>
            <div className="bg-light p-2 rounded">
              <p className="mb-0 small text-muted" style={{ 
                maxHeight: showFullDetails ? 'none' : '60px', 
                overflow: showFullDetails ? 'visible' : 'hidden'
              }}>
                {application.additionalNotes}
              </p>
            </div>
          </div>
        )}

        {/* Application Date */}
        {application.appliedOn && (
          <div className="mb-3">
            <small className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              {t("applied_on")}: {new Date(application.appliedOn).toLocaleDateString()}
            </small>
          </div>
        )}

        {/* Show/Hide Details Toggle */}
        {hasAdditionalInfo && (
          <div className="text-center mb-3">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setShowFullDetails(!showFullDetails)}
            >
              <i className={`bi bi-chevron-${showFullDetails ? 'up' : 'down'} me-1`}></i>
              {showFullDetails ? t("show_less") : t("show_more_details")}
            </button>
          </div>
        )}
      </div>

      {/* Action buttons in footer */}
      <div className="card-footer bg-white">
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          {/* Show different buttons based on current status */}
          {application.status === 'APPLIED' && (
            <>
              <button
                className="btn btn-outline-info btn-sm"
                onClick={() => handleStatusUpdate("UNDER_REVIEW")}
                disabled={isUpdating}
                data-testid={`review-btn-${application.id}`}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {t("loading")}...
                  </>
                ) : (
                  <>
                    <i className="bi bi-eye me-1"></i>
                    {t("under_review")}
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={isUpdating}
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
            </>
          )}

          {application.status === 'UNDER_REVIEW' && (
            <>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleStatusUpdate("INTERVIEWED")}
                disabled={isUpdating}
                data-testid={`interview-btn-${application.id}`}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    {t("loading")}...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-video2 me-1"></i>
                    {t("interview")}
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={isUpdating}
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
            </>
          )}

          {application.status === 'INTERVIEWED' && (
            <>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => handleStatusUpdate("SHORTLISTED")}
                disabled={isUpdating}
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
                disabled={isUpdating}
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
            </>
          )}

          {application.status === 'SHORTLISTED' && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusUpdate("HIRED")}
                disabled={isUpdating}
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
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleStatusUpdate("REJECTED")}
                disabled={isUpdating}
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
            </>
          )}

          {(application.status === 'PENDING' || application.status === 'HIRED' || application.status === 'REJECTED') && (
            <div className="text-center text-muted">
              <small>
                {application.status === 'HIRED' && (
                  <>
                    <i className="bi bi-check-circle-fill text-success me-1"></i>
                    {t("candidate_hired")}
                  </>
                )}
                {application.status === 'REJECTED' && (
                  <>
                    <i className="bi bi-x-circle-fill text-danger me-1"></i>
                    {t("application_rejected")}
                  </>
                )}
                {application.status === 'PENDING' && (
                  <>
                    <i className="bi bi-clock-fill text-warning me-1"></i>
                    {t("status_pending")}
                  </>
                )}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;