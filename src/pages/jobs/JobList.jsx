import React, { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/cards/JobCard";

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Solutions",
    location: "Pune",
    salary: "₹6,00,000 / yr",
    tags: ["React", "JavaScript", "CSS"]
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "CloudNine",
    location: "Bangalore",
    salary: "₹15,00,000 / yr",
    tags: ["React", "Node.js", "MongoDB"]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelWorks",
    location: "Hyderabad",
    salary: "₹8,20,000 / yr",
    tags: ["Figma", "UX", "Wireframes"]
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "SoftLogic",
    location: "Mumbai",
    salary: "₹12,50,000 / yr",
    tags: ["Node.js", "SQL", "API"]
  }
];

export default function JobList() {
  const [q, setQ] = useState("");

  const filtered = JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(q.toLowerCase()) ||
      j.company.toLowerCase().includes(q.toLowerCase()) ||
      j.tags.join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>

      <div
        className="container p-4 d-flex flex-column justify-content-center"
        style={{
          maxWidth: 1100,
          marginTop: "20px",
          background: "#fff",
          borderRadius: "16px",
          padding: "40px",
          height: "180px",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.05)"
        }}
      >
        <h3 className="fw-bold text-center mb-4" style={{ fontSize: "22px" }}>
          Find Your Dream Job!!!
        </h3>

        <div className="d-flex gap-3 justify-content-center">
          <div
            className="d-flex align-items-center px-3"
            style={{
              background: "#fff",
              border: "1px solid #d3dae3",
              borderRadius: "10px",
              height: "40px",
              width: "90%",
              maxWidth: "520px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
          >
            <i className="bi bi-search text-muted" style={{ fontSize: "16px", marginRight: "8px" }}></i>
            <input
              className="form-control border-0 shadow-none"
              placeholder="Search role, skills, company..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ fontSize: "13px" }}
            />
          </div>


          <Link
            to="/create-job"
            className="btn text-white"
            style={{
              background: "linear-gradient(90deg, #1669ff, #0053d1)",
              borderRadius: "10px",
              padding: "6px 18px",
              fontSize: "12px",
              height: "35px",
              display: "flex",
              alignItems: "center"
            }}
          >
            + Post
          </Link>
        </div>
      </div>

      <div className="container py-4" style={{ maxWidth: 1100 }}>
        <div className="row">

          <aside className="col-md-3">
            <div
              className="p-3 shadow-sm"
              style={{
                background: "#fff",
                borderRadius: "10px",
                fontSize: "13px",
                border: "1px solid #e4e5e7"
              }}
            >
              <h6 className="fw-bold mb-2">Filters</h6>

              <label className="small text-muted">Experience</label>
              <input type="range" className="form-range" min="0" max="20" />

              <div className="mt-2">
                {["Full-time", "Part-time", "Contract", "Internship"].map((t, i) => (
                  <div className="form-check mb-1" key={i}>
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label" style={{ fontSize: "12px" }}>
                      {t}
                    </label>
                  </div>
                ))}
              </div>

              <button
                className="btn btn-light w-100 mt-2"
                style={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d0d5dd"
                }}
              >
                Reset
              </button>
            </div>
          </aside>

          <main className="col-md-9">
            {filtered.length === 0 ? (
              <div className="text-center text-muted py-5">No jobs found</div>
            ) : (
              filtered.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </main>

        </div>
      </div>

    </div>
  );
}
