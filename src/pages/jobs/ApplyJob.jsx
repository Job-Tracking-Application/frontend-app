import React, { useState } from "react";

export default function ApplyJob() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    resume: null,
    coverLetter: ""
  });

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const submit = (e) => {
    e.preventDefault();
    alert("Application Submitted (Demo)");
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
          background: "#e8f1ff",   
          width: "100%",
          maxWidth: 500,
          fontSize: "14px",
        }}
      >
        <h5 className="mb-1 text-center text-primary">Apply for this Job</h5>
        <p className="text-muted text-center mb-3" style={{ fontSize: "13px" }}>
          Fill in your details and submit your application
        </p>

        <form onSubmit={submit}>
          <div className="row g-2">

            <div className="col-12">
              <input
                name="name"
                className="form-control form-control-sm"
                placeholder="Full Name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="col-12">
              <input
                name="email"
                type="email"
                className="form-control form-control-sm"
                placeholder="Email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div className="col-12">
              <input
                name="phone"
                className="form-control form-control-sm"
                placeholder="Phone Number"
                value={form.phone}
                onChange={onChange}
                required
              />
            </div>

            <div className="col-12">
              <select
                name="qualification"
                className="form-select form-select-sm"
                value={form.qualification}
                onChange={onChange}
                required
              >
                <option value="">Select Highest Qualification</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's">Bachelor's</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div className="col-12">
              <input
                name="experience"
                type="number"
                className="form-control form-control-sm"
                placeholder="Total Experience (Years)"
                value={form.experience}
                onChange={onChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small text-muted">Upload Resume</label>
              <input
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="form-control form-control-sm"
                onChange={onChange}
                required
              />
            </div>

            <div className="col-12">
              <textarea
                name="coverLetter"
                className="form-control form-control-sm"
                rows={3}
                placeholder="Cover Letter (Optional)"
                value={form.coverLetter}
                onChange={onChange}
              />
            </div>
          </div>

          <button
            className="btn btn-primary w-100 mt-3 btn-sm"
            style={{
              borderRadius: "8px",
              padding: "8px",
              fontSize: "14px"
            }}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
