import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "",
    openings: "",
    skills: "",
    category: "",
    deadline: "",
    description: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    alert("Job Posted Successfully (Demo)");
    navigate("/jobs");
  };

  return (
    <div
      style={{
        background: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="shadow-sm p-4 rounded-3"
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 700,
          fontSize: "14px",
        }}
      >
        <h5 className="mb-3 text-center text-primary">Post a Job</h5>

        <form onSubmit={submit}>
          <div className="row g-2">

            <div className="col-md-6">
              <input
                name="title"
                className="form-control form-control-sm"
                placeholder="Job Title"
                value={form.title}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <input
                name="company"
                className="form-control form-control-sm"
                placeholder="Company Name"
                value={form.company}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <input
                name="location"
                className="form-control form-control-sm"
                placeholder="Location"
                value={form.location}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <input
                name="salary"
                className="form-control form-control-sm"
                placeholder="Salary (CTC)"
                value={form.salary}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <select
                name="jobType"
                className="form-select form-select-sm"
                value={form.jobType}
                onChange={onChange}
              >
                <option value="">Job Type</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div className="col-md-6">
              <select
                name="category"
                className="form-select form-select-sm"
                value={form.category}
                onChange={onChange}
              >
                <option value="">Category</option>
                <option>Software Development</option>
                <option>UI/UX Design</option>
                <option>Management</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Finance</option>
              </select>
            </div>

            <div className="col-md-6">
              <input
                name="experience"
                className="form-control form-control-sm"
                placeholder="Experience"
                value={form.experience}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <input
                name="openings"
                type="number"
                className="form-control form-control-sm"
                placeholder="Openings"
                value={form.openings}
                onChange={onChange}
              />
            </div>

            <div className="col-12">
              <input
                name="skills"
                className="form-control form-control-sm"
                placeholder="Skills"
                value={form.skills}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <input
                name="deadline"
                type="date"
                className="form-control form-control-sm"
                value={form.deadline}
                onChange={onChange}
              />
            </div>

            <div className="col-12">
              <textarea
                name="description"
                rows={3}
                className="form-control form-control-sm"
                placeholder="Job Description"
                value={form.description}
                onChange={onChange}
              />
            </div>

          </div>

          <div className="mt-3 d-flex justify-content-end gap-2">
            <button className="btn btn-primary btn-sm">Post</button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
