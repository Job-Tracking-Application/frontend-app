import React, { useEffect, useState } from "react";
import { getApplicationsForJob, updateApplicationStatus } from "../../services/applicationService";
import "./ManageApplications.css"
const ManageApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await getApplicationsForJob(1);
      setApplications(data);
    };
    load();
  }, []);

  const handleAction = (id, status) => {
    console.log(`Application ${id} → ${status}`);
    updateApplicationStatus(id, status);
  };

  return (
    <div className="applications-page container my-4">

      <h1 className="page-title mb-4">Manage Applications</h1>

      {applications.map((app) => (
        <div key={app.id} className="app-card">

          {/* Header row */}
          <div className="app-card-header">
            <h6 className="card-subtitle">Applicant Details</h6>

            <div className="actions-wrap">
              <button
                onClick={() => handleAction(app.id, "Shortlisted")}
                className="btn btn-warning action-btn"
              >
                Shortlist
              </button>

              <button
                onClick={() => handleAction(app.id, "Rejected")}
                className="btn btn-danger action-btn"
              >
                Reject
              </button>

              <button
                onClick={() => handleAction(app.id, "Hired")}
                className="btn btn-success text-white action-btn"
              >
                Hire
              </button>
            </div>
          </div>

          {/* NAME */}
          <div className="info-block">
            <label className="info-label">Name</label>
            <div className="info-box">{app.name}</div>
          </div>

          {/* EMAIL */}
          <div className="info-block">
            <label className="info-label">Email</label>
            <div className="info-box">{app.email}</div>
          </div>

          {/* SKILLS */}
          <div className="info-block">
            <label className="info-label">Skills</label>
            <div className="info-box">{app.skills.join(", ")}</div>
          </div>

          {/* RESUME */}
          <div className="info-block">
            <label className="info-label">Resume</label>
            <div className="info-box">
              <a href={app.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ManageApplications;
