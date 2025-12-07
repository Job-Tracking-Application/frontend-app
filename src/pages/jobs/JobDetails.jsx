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
    description:
      "We are looking for a creative Frontend Developer skilled in React and modern web technologies. You will build responsive UI components, implement designs from Figma, and ensure high performance and accessibility standards. You will collaborate closely with designers and backend developers to create seamless user experiences.",
    companyWebsite: "https://techcorp.com"
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "CloudNine",
    location: "Bangalore",
    salary: "₹15,00,000 / yr",
    experience: "3 - 6 yrs",
    jobType: "Full-time",
    postedDate: "2025-11-25",
    skills: ["React", "Node.js", "MongoDB", "Express", "REST APIs"],
    description:
      "We are seeking a Full Stack Developer proficient in React for frontend and Node.js for backend. You will design, develop, and maintain web applications, integrate APIs, optimize database queries, and ensure scalable architecture. Ideal candidates have experience with cloud services and agile workflows.",
    companyWebsite: "https://cloudnine.com"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "PixelWorks",
    location: "Hyderabad",
    salary: "₹8,20,000 / yr",
    experience: "1 - 4 yrs",
    jobType: "Part-time",
    postedDate: "2025-11-22",
    skills: ["Figma", "Sketch", "Wireframes", "Prototyping", "User Research"],
    description:
      "PixelWorks is looking for a talented UI/UX Designer to craft intuitive and visually appealing digital experiences. Responsibilities include creating wireframes, prototypes, and high-fidelity designs, conducting user research, and collaborating with developers to implement design solutions.",
    companyWebsite: "https://pixelworks.com"
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: "SoftLogic",
    location: "Mumbai",
    salary: "₹12,50,000 / yr",
    experience: "2 - 5 yrs",
    jobType: "Contract",
    postedDate: "2025-11-20",
    skills: ["Node.js", "SQL", "API Development", "Microservices", "Docker"],
    description:
      "SoftLogic is hiring a Backend Engineer to design, implement, and maintain server-side applications and APIs. The role involves working with databases, ensuring system scalability, integrating third-party services, and writing clean and maintainable code. Experience with microservices architecture and Docker is a plus.",
    companyWebsite: "https://softlogic.com"
  }
];

export default function JobDetails() {
  const { id } = useParams();
  const job = JOBS.find((j) => j.id === Number(id));

  if (!job) return <div className="text-center py-5">Job not found</div>;

  return (
    <div
      style={{
        backgroundColor: "#eef4ff",
        minHeight: "100vh",
        paddingTop: "40px",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          maxWidth: "650px",
          padding: "20px 24px",
          borderRadius: "12px",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        
        <h2
          style={{
            color: "#0d6efd",
            marginBottom: "4px",
            fontSize: "20px",
            textAlign: "center"
          }}
        >
          {job.title}
        </h2>

        <p
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "16px",
            textAlign: "center"
          }}
        >
          {job.company}
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
            fontSize: "13px",
            color: "#444",
            marginBottom: "10px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="14" height="14" fill="none" stroke="gray" strokeWidth="2">
              <path d="M2 10h12M2 6h12M4 2h8v12H4z" />
            </svg>
            {job.experience}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="14" height="14" fill="none" stroke="gray" strokeWidth="2">
              <path d="M8 2v12M4 5h6a2 2 0 010 4H4a2 2 0 100 4h6" />
            </svg>
            {job.salary}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="14" height="14" fill="none" stroke="gray" strokeWidth="2">
              <path d="M8 15s5-4.5 5-8.5A5 5 0 003 6.5C3 10.5 8 15 8 15z" />
              <circle cx="8" cy="6.5" r="2" />
            </svg>
            {job.location}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="14" height="14" fill="none" stroke="gray" strokeWidth="2">
              <rect x="3" y="3" width="10" height="10" rx="2" />
            </svg>
            {job.jobType}
          </div>

  
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="14" height="14" fill="none" stroke="gray" strokeWidth="2">
              <rect x="2" y="3" width="12" height="11" rx="2" />
              <path d="M2 7h12" />
            </svg>
            {job.postedDate}
          </div>
        </div>

        <hr style={{ margin: "14px 0" }} />

        <h4 style={{ fontSize: "15px", marginBottom: "6px", textAlign: "center" }}>
          Description
        </h4>

        <p style={{ lineHeight: "1.4", fontSize: "13px", color: "#333" }}>
          {job.description}
        </p>

        <h4 style={{ fontSize: "15px", marginTop: "12px", textAlign: "center" }}>
          Skills Required
        </h4>

        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          {job.skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                background: "#eef4ff",
                color: "#0d6efd",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "11px",
                marginRight: "5px",
                marginBottom: "5px"
              }}
            >
              {skill}
            </span>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Link
            to={`/apply/${job.id}`}
            style={{
              background: "#0d6efd",
              color: "white",
              padding: "8px 18px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500"
            }}
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
