import React from "react";
import { useParams, Link } from "react-router-dom";

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Solutions",
    location: "Pune",
    salary: "₹6,00,000 / yr",
    experience: "1 - 3 yrs",
    jobType: "Full-time",
    postedDate: "2025-11-28",
    skills: ["React", "JavaScript", "CSS", "HTML", "Bootstrap"],
    description: "We are looking for a creative frontend developer skilled in React. You will work on responsive web applications, implement UI components, and collaborate with backend developers to integrate APIs.",
    perks: ["Work from home", "Health insurance", "Flexible hours"],
    companyWebsite: "https://techcorp.com"
  },
  {
    id: 2,
    title: "Senior Full Stack Developer",
    company: "CloudNine",
    location: "Bangalore",
    salary: "₹15,00,000 / yr",
    experience: "4 - 8 yrs",
    jobType: "Full-time",
    postedDate: "2025-11-20",
    skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
    description: "A senior developer role focusing on scalable full-stack applications. Responsibilities include designing APIs, optimizing backend performance, mentoring junior developers, and leading project modules.",
    perks: ["Performance bonus", "Remote work", "Health & wellness programs"],
    companyWebsite: "https://cloudnine.com"
  }
];

export default function JobDetails() {
  const { id } = useParams();
  const job = JOBS.find((j) => j.id === Number(id));

  if (!job) return <div className="text-center py-5" style={{ fontSize: "14px" }}>Job not found</div>;

  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="card p-4 rounded-4 shadow-sm" style={{ fontSize: "14px", lineHeight: "1.5" }}>
          
          
          <h2 className="fw-bold mb-2" style={{ fontSize: "18px" }}>{job.title}</h2>
          <p className="text-muted mb-3" style={{ fontSize: "13px" }}>
            {job.company} • {job.location} • <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Company Website</a>
          </p>

          
          <ul className="d-flex gap-3 mb-3 flex-wrap" style={{ fontSize: "13px", paddingLeft: "20px" }}>
            <li>Experience: {job.experience}</li>
            <li>Salary: {job.salary}</li>
            <li>Job Type: {job.jobType}</li>
            <li>Posted on: {new Date(job.postedDate).toLocaleDateString()}</li>
          </ul>

         
          <div className="mb-3">
            {job.skills.map((skill, i) => (
              <span key={i} className="badge bg-primary-subtle text-primary me-2 px-2 py-1 rounded-3" style={{ fontSize: "12px" }}>
                {skill}
              </span>
            ))}
          </div>

          
          <h5 className="mb-2 fw-semibold" style={{ fontSize: "14px" }}>Job Description</h5>
          <p style={{ fontSize: "13px", marginBottom: "1.2rem" }}>{job.description}</p>

          
          {job.perks && job.perks.length > 0 && (
            <>
              <h5 className="mb-2 fw-semibold" style={{ fontSize: "14px" }}>Perks & Benefits</h5>
              <div style={{ fontSize: "13px", marginBottom: "1.5rem" }}>
                {job.perks.map((perk, i) => (
                  <div key={i} className="mb-1">• {perk}</div>
                ))}
              </div>
            </>
          )}

          
          <div className="d-flex gap-2 mt-3">
            <Link to={`/apply/${job.id}`} className="btn btn-primary btn-sm rounded-3" style={{ fontSize: "13px", padding: "5px 12px" }}>
              Apply Now
            </Link>
            <Link to="/jobs" className="btn btn-outline-secondary btn-sm rounded-3" style={{ fontSize: "13px", padding: "5px 12px" }}>
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
