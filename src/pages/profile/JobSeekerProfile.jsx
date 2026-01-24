import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import "./JobSeekerProfile.css";

const JobSeekerProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: [],
    resume: "",
    about: "",
    education: "",
  });

  // Load user profile from API
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      
      setProfile(data);

      const educationString = data.education 
        ? (typeof data.education === 'string' 
            ? data.education 
            : `${data.education.degree} from ${data.education.college} (${data.education.year})`)
        : "";

      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        skills: data.skills || [],
        resume: data.resume || "",
        about: data.about || "",
        education: educationString,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile");
      showErrorToast("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const fields = [
      profile.fullName,
      profile.email,
      profile.phone,
      profile.about,
      profile.education, // This is now an EducationDTO object or null
      profile.resume,
      profile.skills && profile.skills.length > 0
    ];
    
    const completedFields = fields.filter(field => {
      if (field === null || field === undefined) return false;
      if (typeof field === 'string') return field.trim() !== "";
      if (typeof field === 'boolean') return field;
      if (typeof field === 'object') return true; // EducationDTO object exists
      return false;
    }).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setFormData((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  // Save handler
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        resume: formData.resume,
        about: formData.about,
        education: formData.education,
      };

      await updateUserProfile(updateData);

      // Update local state
      setProfile({ ...profile, ...updateData });
      setIsEditing(false);
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };



  if (loading) return <Loader />;

  if (error) {
    return (
      <div>
        <PageHero title="Job Seeker Profile" subtitle="Manage your personal information and resume." />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Profile</h4>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadProfile}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <PageHero title="Job Seeker Profile" subtitle="Manage your personal information and resume." />
        <div className="container py-5">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">Profile Not Found</h4>
            <p>Your profile hasn't been created yet. Click "Create Profile" to set up your profile.</p>
            <button className="btn btn-primary" onClick={toggleEdit}>
              <i className="bi bi-pencil me-2"></i>
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="Job Seeker Profile" subtitle="Manage your personal information and resume." />

      <div className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Welcome, {profile.fullName || authUser?.fullname || 'Job Seeker'}!</h4>
            <p className="text-muted mb-0">Keep your profile updated to attract better job opportunities</p>
          </div>
          {isEditing ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={toggleEdit}
                disabled={saving}
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
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-person-circle me-2 text-primary"></i>
                  Basic Information
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Full Name</label>
                    {isEditing ? (
                      <input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        className="form-control"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="fw-medium">{profile.fullName || "Not provided"}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Email</label>
                    {isEditing ? (
                      <input 
                        name="email" 
                        type="email"
                        value={formData.email} 
                        onChange={handleChange} 
                        className="form-control"
                        placeholder="Enter your email"
                        disabled // Email usually shouldn't be editable
                      />
                    ) : (
                      <p className="fw-medium">{profile.email || "Not provided"}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Phone</label>
                    {isEditing ? (
                      <input 
                        name="phone" 
                        type="tel"
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="form-control"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="fw-medium">{profile.phone || "Not provided"}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Role</label>
                    <p className="fw-medium">
                      <span className="badge bg-primary">Job Seeker</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-person-lines-fill me-2 text-info"></i>
                  About Me
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <textarea 
                    name="about" 
                    rows={4} 
                    value={formData.about} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Tell us about yourself, your experience, and career goals..."
                  />
                ) : (
                  <p className="text-secondary">
                    {profile.about || "No description provided. Add information about your experience, skills, and career goals."}
                  </p>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-mortarboard me-2 text-success"></i>
                  Education
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <textarea 
                    name="education" 
                    rows={3} 
                    value={formData.education} 
                    onChange={handleChange} 
                    className="form-control"
                    placeholder="Enter your educational background..."
                  />
                ) : (
                  <div>
                    <p className="text-secondary">
                      {profile.education 
                        ? (typeof profile.education === 'string' 
                            ? profile.education 
                            : `${profile.education.degree} from ${profile.education.college} (${profile.education.year})`)
                        : "No education details provided."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="col-lg-4">
            {/* Profile Completion Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-speedometer2 me-2 text-primary"></i>
                  Profile Completion
                </h5>
              </div>
              <div className="card-body p-4">
                {(() => {
                  const completion = calculateProfileCompletion();
                  const color = getCompletionColor(completion);
                  return (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-medium">{completion}% Complete</span>
                        <span className={`badge bg-${color}`}>{completion >= 80 ? 'Excellent' : completion >= 50 ? 'Good' : 'Needs Work'}</span>
                      </div>
                      <div className="progress mb-3" style={{height: '8px'}}>
                        <div 
                          className={`progress-bar bg-${color}`} 
                          role="progressbar" 
                          style={{width: `${completion}%`}}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {completion < 100 ? 
                          "Complete your profile to attract more recruiters!" :
                          "Your profile is complete! Great job!"
                        }
                      </small>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-tools me-2 text-warning"></i>
                  Skills
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <div>
                    <input 
                      name="skills" 
                      value={formData.skills.join(", ")} 
                      onChange={handleSkillsChange} 
                      className="form-control" 
                      placeholder="React, Node.js, Python, etc."
                    />
                    <small className="form-text text-muted">
                      Separate skills with commas
                    </small>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {profile.skills && profile.skills.length > 0 ? 
                        profile.skills.map((skill, i) => (
                          <span key={i} className="badge bg-light text-dark border">
                            {skill}
                          </span>
                        )) : 
                        <span className="text-muted small">
                          No skills listed. Add your technical skills to attract recruiters.
                        </span>
                      }
                    </div>
                    {(!profile.skills || profile.skills.length === 0) && (
                      <span className="text-muted small">
                        No skills listed. Add your technical skills to attract recruiters.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-file-earmark-text me-2 text-danger"></i>
                  Resume
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <div>
                    <input 
                      type="url"
                      name="resume"
                      value={formData.resume}
                      onChange={handleChange}
                      className="form-control" 
                      placeholder="https://drive.google.com/your-resume-link"
                    />
                    <small className="form-text text-muted">
                      Provide a link to your resume (Google Drive, LinkedIn, etc.)
                    </small>
                  </div>
                ) : (
                  <div className="p-3 bg-light rounded text-center">
                    <i className="bi bi-file-earmark-pdf fs-3 text-danger d-block mb-2"></i>
                    {profile.resume ? (
                      <div>
                        <a 
                          href={profile.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Resume
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted small">
                        No resume uploaded. Add your resume link to increase your chances of getting hired.
                      </span>
                    )}
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

export default JobSeekerProfile;