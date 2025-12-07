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
    <div>
      <PageHero title="My Profile" subtitle="Manage your personal information and resume." />

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
          {/* Basic Info */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">Basic Information</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Full Name</label>
                    {isEditing ? (
                      <input name="fullName" value={formData.fullName} onChange={handleChange} className="form-control" />
                    ) : (
                      <p className="fw-medium">{user.fullName}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Email</label>
                    {isEditing ? (
                      <input name="email" value={formData.email} onChange={handleChange} className="form-control" />
                    ) : (
                      <p className="fw-medium">{user.email}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Username</label>
                    {isEditing ? (
                      <input name="userName" value={formData.userName} onChange={handleChange} className="form-control" />
                    ) : (
                      <p className="fw-medium">{user.userName}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Phone</label>
                    {isEditing ? (
                      <input name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
                    ) : (
                      <p className="fw-medium">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">About Me</h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <textarea name="about" rows={4} value={formData.about} onChange={handleChange} className="form-control" />
                ) : (
                  <p className="text-secondary">{user.about || "No description provided."}</p>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">Education</h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <textarea name="education" rows={3} value={formData.education} onChange={handleChange} className="form-control" />
                ) : (
                  <p className="text-secondary">{user.education || "No education details."}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar like Cards */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">Skills</h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <input name="skills" value={formData.skills.join(", ")} onChange={handleSkillsChange} className="form-control" placeholder="Comma separated" />
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? user.skills.map((skill, i) => (
                      <span key={i} className="badge bg-light text-dark border">{skill}</span>
                    )) : <span className="text-muted small">No skills listed</span>}
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">Resume</h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <input type="file" className="form-control" onChange={handleFileChange} />
                ) : (
                  <div className="p-3 bg-light rounded text-center">
                    <i className="bi bi-file-earmark-pdf fs-3 text-danger d-block mb-2"></i>
                    {user.resume ? <span>{user.resume}</span> : <span className="text-muted small">No resume uploaded</span>}
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
