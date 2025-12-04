import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div
      className="shadow-sm p-2 mb-3"
      style={{
        background: "#fff",
        borderRadius: "10px",
        border: "1px solid #e6e6e6",
        fontSize: "12px",
      }}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h6 className="fw-semibold mb-1" style={{ fontSize: "14px" }}>
            {job.title}
          </h6>

          <span className="text-muted d-block" style={{ fontSize: "11px" }}>
            {job.company}
          </span>

          <span className="text-muted d-block mb-1" style={{ fontSize: "11px" }}>
            {job.location}
          </span>

          <div className="d-flex gap-1 flex-wrap">
            {job.tags.map((t, i) => (
              <span
                key={i}
                className="px-2 py-1"
                style={{
                  background: "#f1f3f5",
                  borderRadius: "6px",
                  fontSize: "10px",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="text-end">
          <span
            className="fw-bold"
            style={{ color: "#1669ff", fontSize: "12px" }}
          >
            {job.salary}
          </span>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-2">
        <Link
          to={`/apply/${job.id}`}
          className="btn btn-outline-primary btn-sm"
          style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "6px" }}
        >
          Apply
        </Link>

        <Link
          to={`/jobs/${job.id}`}
          className="btn btn-primary btn-sm"
          style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "6px" }}
        >
          View
        </Link>
      </div>
    </div>
  );
}
