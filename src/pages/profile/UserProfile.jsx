import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import PageHero from "../../components/common/PageHero";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userName: "",
    phone: "",
    skills: [],
    resume: null,
    about: "",
    education: {
      degree: "",
      college: "",
      year: "",
    },
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadUser = async () => {
      const data = await getUserProfile();

      setUser(data);

      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        userName: data.userName || "",
        phone: data.phone || "",
        skills: data.skills || [],
        resume: null,
        about: data.about || "",
        education: data.education || {
          degree: "",
          college: "",
          year: "",
        },
      });
    };

    loadUser();
  }, []);

  if (!user) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  const toggleEdit = () => setIsEditing(!isEditing);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files?.[0] || null,
    }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setSaving(true);

    const payload = {
      ...formData,
      education: {
        ...formData.education,
        year: Number(formData.education.year) || null,
      },
      resume: formData.resume ? formData.resume.name : user.resume,
    };

    await updateUserProfile(payload);

    // reload from backend to stay in sync
    const fresh = await getUserProfile();
    setUser(fresh);
    setFormData({
      ...fresh,
      resume: null,
    });

    setIsEditing(false);
    setSaving(false);
  };

  /* ================= UI ================= */
  return (
    <div>
      <PageHero
        title="My Profile"
        subtitle="Manage your personal information and resume."
      />

      <div className="container pb-5">
        <div className="d-flex justify-content-end mb-4">
          {isEditing ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={toggleEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={toggleEdit}>
              <i className="bi bi-pencil me-2"></i> Edit Profile
            </button>
          )}
        </div>

        <div className="row g-4">
          {/* LEFT */}
          <div className="col-lg-8">
            {/* BASIC INFO */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Basic Information</h5>

                <div className="row g-3">
                  {["fullName", "email", "userName", "phone"].map((field) => (
                    <div key={field} className="col-md-6">
                      <label className="form-label text-muted small fw-bold">
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      {isEditing ? (
                        <input
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="form-control"
                          type={field === "phone" ? "tel" : "text"}
                        />
                      ) : (
                        <p className="fw-medium">{user[field] || "Not provided"}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">About Me</h5>
                {isEditing ? (
                  <textarea
                    name="about"
                    rows={4}
                    value={formData.about}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  <p className="text-secondary">
                    {user.about || "No description provided."}
                  </p>
                )}
              </div>
            </div>

            {/* EDUCATION */}
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Education</h5>

                {isEditing ? (
                  <>
                    <input
                      name="degree"
                      placeholder="Degree"
                      value={formData.education.degree}
                      onChange={handleEducationChange}
                      className="form-control mb-2"
                    />
                    <input
                      name="college"
                      placeholder="College"
                      value={formData.education.college}
                      onChange={handleEducationChange}
                      className="form-control mb-2"
                    />
                    <input
                      name="year"
                      placeholder="Year"
                      value={formData.education.year}
                      onChange={handleEducationChange}
                      className="form-control"
                    />
                  </>
                ) : user.education ? (
                  <div className="text-secondary">
                    <p><strong>Degree:</strong> {user.education.degree}</p>
                    <p><strong>College:</strong> {user.education.college}</p>
                    <p><strong>Year:</strong> {user.education.year}</p>
                  </div>
                ) : (
                  <p className="text-muted">No education details.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-lg-4">
            {/* SKILLS */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Skills</h5>
                {isEditing ? (
                  <input
                    value={formData.skills.join(", ")}
                    onChange={handleSkillsChange}
                    className="form-control"
                    placeholder="Comma separated"
                  />
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {user.skills?.length ? (
                      user.skills.map((s, i) => (
                        <span
                          key={i}
                          className="badge bg-light text-dark border"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small">No skills</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RESUME */}
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Resume</h5>
                {isEditing ? (
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                ) : (
                  <div className="p-3 bg-light rounded text-center">
                    {user.resume || "No resume uploaded"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
