import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRegClock,
  FaBriefcase,
  FaRupeeSign,
} from "react-icons/fa";

export default function JobCard({ job }) {
  return (
    <div
      className="p-3 mb-3 d-flex justify-content-between"
      style={{
        background: "#fff",
        borderRadius: "10px",
        border: "1px solid #e3e6ea",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
      }}
    >
      <div style={{ flex: 1 }}>
        <h5 className="fw-semibold mb-1" style={{ fontSize: "15px" }}>
          {job.title}
        </h5>

        <div className="text-muted mb-2" style={{ fontSize: "12px" }}>
          {job.company}
        </div>

        <div className="d-flex gap-3 text-muted" style={{ fontSize: "12px" }}>
          <span className="d-flex align-items-center">
            <FaBriefcase size={11} className="me-1" />
            {job.experience || "2-5 years"}
          </span>

          <span className="d-flex align-items-center">
            <FaMapMarkerAlt size={11} className="me-1" />
            {job.location}
          </span>

          <span className="d-flex align-items-center">
            <FaRegClock size={11} className="me-1" />
            {job.posted || "2 months ago"}
          </span>
        </div>

        <div className="d-flex flex-wrap gap-1 mt-2">
          {job.tags.map((t, i) => (
            <span
              key={i}
              className="px-2 py-1"
              style={{
                background: "#eef1f6",
                borderRadius: "5px",
                fontSize: "11px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <div
          className="mt-2 fw-semibold"
          style={{ color: "#0f7d63", fontSize: "13px" }}
        >
          <FaRupeeSign size={11} className="me-1" />
          {job.salary}
        </div>
      </div>

      <div className="d-flex align-items-start">
        <Link
          to={`/jobs/${job.id}`}
          className="btn btn-outline-primary btn-sm"
          style={{
            fontSize: "11px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            height: "28px",
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
