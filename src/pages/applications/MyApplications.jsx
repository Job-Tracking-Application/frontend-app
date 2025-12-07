import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";
import PageHero from "../../components/common/PageHero";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getMyApplications();
      setApplications(data);
    };
    loadData();
  }, []);

  return (
    <div>
      <PageHero title="My Applications" subtitle="Track the status of your job applications." />

      <div className="container pb-5">
        <div className="row g-4">
          {applications.map((app) => (
            <div key={app.id} className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">{app.jobTitle}</h5>
                      <h6 className="text-secondary">{app.company}</h6>
                    </div>
                    <span className={`badge rounded-pill px-3 py-2 ${app.status === 'Hired' ? 'bg-success' :
                        app.status === 'Rejected' ? 'bg-danger' : 'bg-primary'
                      }`}>
                      {app.status}
                    </span>
                  </div>

                  <hr className="my-3 opacity-10" />

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <p className="text-muted small mb-1 fw-bold text-uppercase">Applied On</p>
                      <p className="fw-medium mb-0">{app.appliedDate}</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="text-muted small mb-1 fw-bold text-uppercase">Resume</p>
                      <a href={app.resume} target="_blank" rel="noreferrer" className="text-decoration-none">
                        View Resume <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="col-12 mt-4 text-center">
              <div className="p-5 bg-light rounded-3">
                <i className="bi bi-clipboard-x display-4 text-muted mb-3 d-block"></i>
                <h4 className="text-muted">No applications found</h4>
                <p className="mb-0">Start applying to jobs to see them here!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
