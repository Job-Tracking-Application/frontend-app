import React from "react";

export default function ApplicationCard({ app }) {
  return (
    <div
      className="card border-0 shadow-sm rounded-4 p-3 mb-3"
      style={{ fontSize: "13px", borderRadius: "16px" }}
    >
      <h6 className="fw-bold mb-1">{app.name}</h6>
      <p className="text-muted mb-1">{app.email}</p>
      <p className="mb-1">Experience: {app.experience} yrs</p>

      <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-3">
        Applied for Job #{app.jobId}
      </span>
    </div>
  );
}
