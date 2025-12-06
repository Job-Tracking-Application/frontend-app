import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";
import "./MyApplications.css"; // separate CSS file

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
    <div className="myapps-page container my-4">

      <h1 className="page-title mb-4">My Applications</h1>

      {applications.map((app) => (
        <div key={app.id} className="app-card">

          {/* Header */}
          <div className="card-header-row">
            <h6 className="card-title">Application Details</h6>
            <span className={`status-badge ${app.status.toLowerCase()}`}>
              {app.status}
            </span>
          </div>

          {/* Job Title */}
          <div className="info-block">
            <label className="info-label">Job Title</label>
            <div className="info-box">{app.jobTitle}</div>
          </div>

          {/* Company */}
          <div className="info-block">
            <label className="info-label">Company</label>
            <div className="info-box">{app.company}</div>
          </div>

          {/* Date */}
          <div className="info-block">
            <label className="info-label">Applied On</label>
            <div className="info-box">{app.appliedDate}</div>
          </div>

          {/* Resume */}
          <div className="info-block">
            <label className="info-label">Resume</label>

            <a
              href={app.resume}
              target="_blank"
              rel="noreferrer"
              className="info-box resume-link"
            >
              View Resume
            </a>
          </div>


        </div>
      ))}
    </div>
  );
};

export default MyApplications;
