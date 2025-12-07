import React, { useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../../components/cards/JobCard";

const JOBS = [
  { id: 1, title: "Frontend Developer", company: "TechCorp Solutions", location: "Pune", salary: "₹6,00,000 / yr", tags: ["React", "JavaScript", "CSS"], type: "Full-time" },
  { id: 2, title: "Full Stack Developer", company: "CloudNine", location: "Bangalore", salary: "₹15,00,000 / yr", tags: ["React", "Node.js", "MongoDB"], type: "Full-time" },
  { id: 3, title: "UI/UX Designer", company: "PixelWorks", location: "Hyderabad", salary: "₹8,20,000 / yr", tags: ["Figma", "UX", "Wireframes"], type: "Part-time" },
  { id: 4, title: "Backend Engineer", company: "SoftLogic", location: "Mumbai", salary: "₹12,50,000 / yr", tags: ["Node.js", "SQL", "API"], type: "Contract" }
];

export default function JobList() {
  const [q, setQ] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = JOBS.filter(
    (j) =>
      (j.title.toLowerCase().includes(q.toLowerCase()) ||
        j.company.toLowerCase().includes(q.toLowerCase()) ||
        j.tags.join(" ").toLowerCase().includes(q.toLowerCase())) &&
      (locationFilter ? j.location === locationFilter : true) &&
      (typeFilter ? j.type === typeFilter : true)
  );

  const uniqueLocations = [...new Set(JOBS.map(j => j.location))];
  const uniqueTypes = [...new Set(JOBS.map(j => j.type))];

  return (
    <div style={{ background: "#e8f1ff", minHeight: "100vh", paddingTop: "20px" }}>

      
      <div
        className="container p-4 d-flex flex-column justify-content-center"
        style={{
          maxWidth: 1100,
          marginTop: "20px",
          background: "#0d6efd", 
          borderRadius: "16px",
          padding: "40px",
          height: "180px",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.05)"
        }}
      >
        <h3 className="fw-bold text-center mb-3" style={{ fontSize: "22px", color: "white" }}>
          Find Your Dream Job!!!
        </h3>

        <div className="d-flex gap-2 justify-content-center flex-wrap">

          <div
            className="d-flex align-items-center px-2"
            style={{
              background: "#fff",
              border: "1px solid #d3dae3",
              borderRadius: "10px",
              height: "35px",
              width: "90%",
              maxWidth: "280px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
          >
            <i className="bi bi-search text-muted" style={{ fontSize: "14px", marginRight: "6px" }}></i>
            <input
              className="form-control border-0 shadow-none"
              placeholder="Search role, skills, company..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ fontSize: "12px", height: "30px" }}
            />
          </div>

          <select
            className="form-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{ maxWidth: "140px", height: "35px", fontSize: "12px" }}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ maxWidth: "140px", height: "35px", fontSize: "12px" }}
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          <Link
  to="/create-job"
  className="btn"
  style={{
    background: "white",
    color: "#0846ad",   
    border: "1px solid #0846ad",
    borderRadius: "10px",
    padding: "4px 14px",
    fontSize: "12px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    fontWeight: "500"
  }}
>
  Post Job
</Link>

        </div>
      </div>

      
      <div className="container py-4" style={{ maxWidth: 1100 }}>
        <div className="row">

          
          <aside className="col-md-3 mb-4">
            <div
              className="p-3 shadow-sm"
              style={{
                background: "#ffffff",
                borderRadius: "10px",
                fontSize: "13px",
                border: "1px solid #e4e5e7"
              }}
            >
              <h6 className="fw-bold mb-3">Filters</h6>

              <label className="small text-muted">Experience</label>
              <input type="range" className="form-range mb-3" min="0" max="20" style={{ height: "3px" }} />

              <label className="small text-muted">Job Type</label>
              <select
                className="form-select mb-3"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ fontSize: "12px", height: "32px" }}
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>

              <label className="small text-muted">Location</label>
              <select
                className="form-select mb-3"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ fontSize: "12px", height: "32px" }}
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>

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
                className="btn btn-primary w-100 mt-2"
                style={{
                  fontSize: "12px",
                  borderRadius: "8px",
                  padding: "4px 0"
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
              <div className="row g-3">
                {filtered.map((job) => (
                  <div className="col-12" key={job.id}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
