import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
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
    education: "",
  });

  // Load user from API
  useEffect(() => {
    async function loadUser() {
      const data = await getUserProfile();
      setUser(data);

      setFormData({
        fullName: data.fullName,
        email: data.email,
        userName: data.userName,
        phone: data.phone,
        skills: data.skills,
        resume: null,
        about: data.about,
        education: data.education,
      });
    }

    loadUser();
  }, []);

  if (!user) return <div className="text-center mt-4">Loading...</div>;

  const toggleEdit = () => setIsEditing(!isEditing);

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files?.[0] || null,
    }));
  };

  // Save handler
  const handleSave = async () => {
    setSaving(true);

    const updatedUser = {
      ...formData,
      resume: formData.resume ? formData.resume.name : user.resume,
    };

    await updateUserProfile(updatedUser);

    setUser(updatedUser);
    setIsEditing(false);
    setSaving(false);
  };

  return (
    <div className="profile-page container my-4">
      {/* Header */}
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div>
          <h1 className="mb-1 me-5">My Profile</h1>
          <div className="text-muted small">
          </div>
        </div>

        {isEditing ? (
          <div>
            <button
              className="btn btn-success me-2"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={toggleEdit}
            >
              Cancel
            </button>
          </div>
        ) : (
             <div class="d-flex justify-content-end">
          <button className="btn btn-primary " onClick={toggleEdit}>
            Edit Profile
          </button>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="card profile-card p-4">
        <h6 className="card-title mb-3">Basic Information</h6>

        <div className="row">
          {/* Full Name */}
          <div className="col-md-6 mb-3">
            <label className="field-label">Full Name</label>
            {isEditing ? (
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-control soft-box"
              />
            ) : (
              <div className="soft-box">{user.fullName}</div>
            )}
          </div>

          {/* Email */}
          <div className="col-md-6 mb-3">
            <label className="field-label">Email</label>
            {isEditing ? (
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control soft-box"
              />
            ) : (
              <div className="soft-box">{user.email}</div>
            )}
          </div>

          {/* Username */}
          <div className="col-md-6 mb-3">
            <label className="field-label">Username</label>
            {isEditing ? (
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="form-control soft-box"
              />
            ) : (
              <div className="soft-box">{user.userName}</div>
            )}
          </div>

          {/* Phone */}
          <div className="col-md-6 mb-3">
            <label className="field-label">Phone</label>
            {isEditing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control soft-box"
              />
            ) : (
              <div className="soft-box">{user.phone}</div>
            )}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card profile-card p-4 mt-4">
        <h6 className="card-title mb-3">About Me</h6>
        {isEditing ? (
          <textarea
            name="about"
            rows={3}
            value={formData.about}
            onChange={handleChange}
            className="form-control soft-box"
          />
        ) : (
          <div className="soft-box">{user.about}</div>
        )}
      </div>

      {/* Education */}
      <div className="card profile-card p-4 mt-4">
        <h6 className="card-title mb-3">Education</h6>
        {isEditing ? (
          <textarea
            name="education"
            rows={2}
            value={formData.education}
            onChange={handleChange}
            className="form-control soft-box"
          />
        ) : (
          <div className="soft-box">{user.education}</div>
        )}
      </div>

      {/* Skills */}
      <div className="card profile-card p-4 mt-4">
        <h6 className="card-title mb-3">Skills</h6>
        {isEditing ? (
          <input
            name="skills"
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
            className="form-control soft-box"
          />
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {user.skills.map((skill, i) => (
              <span key={i} className="badge skill-badge">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Resume */}
      <div className="card profile-card p-4 mt-4">
        <h6 className="card-title mb-3">Resume</h6>

        {isEditing ? (
          <input type="file" className="form-control" onChange={handleFileChange} />
        ) : (
          <div className="text-muted">
            {user.resume ? user.resume : "No Resume Uploaded"}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
