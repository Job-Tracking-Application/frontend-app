import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import "./JobSeekerProfile.css";

const JobSeekerProfile = () => {
  const { user: authUser } = useAuth();
  const { t } = useLanguage();
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
    education: {
      degree: "",
      college: "",
      year: ""
    },
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

      // Handle education data properly
      let educationObj = { degree: "", college: "", year: "" };
      if (data.education) {
        if (typeof data.education === 'string') {
          // If it's a string, put it in the degree field
          educationObj.degree = data.education;
        } else {
          // If it's an object, use the individual fields
          educationObj = {
            degree: data.education.degree || "",
            college: data.education.college || "",
            year: data.education.year ? String(data.education.year) : ""
          };
        }
      }

      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        skills: data.skills || [],
        resume: data.resume || "",
        about: data.about || "",
        education: educationObj,
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      setError(t("failed_load_profile"));
      showErrorToast(t("profile_update_failed"));
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

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value
      }
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
        education: JSON.stringify(formData.education), // Convert education object to JSON string
      };

      await updateUserProfile(updateData);

      // Update local state with the correct education object (not the JSON string)
      const updatedProfile = {
        ...profile,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills,
        resume: formData.resume,
        about: formData.about,
        education: formData.education, // Keep as object for display
      };
      
      setProfile(updatedProfile);
      setIsEditing(false);
      showSuccessToast(t("profile_updated_success"));
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast(t("profile_update_failed"));
    } finally {
      setSaving(false);
    }
  };



  if (loading) return <Loader />;

  if (error) {
    return (
      <div>
        <PageHero title={t("job_seeker_profile_title")} subtitle={t("job_seeker_profile_subtitle")} />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">{t("error_loading_profile")}</h4>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadProfile}>
              {t("try_again")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <PageHero title={t("job_seeker_profile_title")} subtitle={t("job_seeker_profile_subtitle")} />
        <div className="container py-5">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">{t("profile_not_found")}</h4>
            <p>{t("profile_not_created")}</p>
            <button className="btn btn-primary" onClick={toggleEdit}>
              <i className="bi bi-pencil me-2"></i>
              {t("create_profile")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero title={t("job_seeker_profile_title")} subtitle={t("job_seeker_profile_subtitle")} />

      <div className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">{t("welcome_message", { name: profile.fullName || authUser?.fullname || t("job_seeker") })}</h4>
            <p className="text-muted mb-0">{t("job_seeker_profile_subtitle")}</p>
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
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    {t("save_changes")}
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={toggleEdit}
                disabled={saving}
              >
                {t("cancel")}
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={toggleEdit}>
              <i className="bi bi-pencil me-2"></i> {t("edit_profile")}
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
                  {t("basic_information")}
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">{t("full_name")}</label>
                    {isEditing ? (
                      <input 
                        name="fullName" 
                        value={formData.fullName} 
                        onChange={handleChange} 
                        className="form-control"
                        placeholder={t("enter_full_name")}
                      />
                    ) : (
                      <p className="fw-medium">{profile.fullName || t("not_provided")}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">{t("username")}</label>
                    <p className="fw-medium">
                      <span className="badge bg-secondary">{profile.userName || t("not_set")}</span>
                    </p>
                    <small className="text-muted">{t("username_cannot_change")}</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">{t("email")}</label>
                    {isEditing ? (
                      <input 
                        name="email" 
                        type="email"
                        value={formData.email} 
                        onChange={handleChange} 
                        className="form-control"
                        placeholder={t("enter_email")}
                        disabled // Email usually shouldn't be editable
                      />
                    ) : (
                      <p className="fw-medium">{profile.email || t("not_provided")}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">{t("phone")}</label>
                    {isEditing ? (
                      <input 
                        name="phone" 
                        type="tel"
                        value={formData.phone} 
                        onChange={handleChange} 
                        className="form-control"
                        placeholder={t("enter_phone")}
                      />
                    ) : (
                      <p className="fw-medium">{profile.phone || t("not_provided")}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-person-lines-fill me-2 text-info"></i>
                  {t("about_me")}
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
                    placeholder={t("about_placeholder")}
                  />
                ) : (
                  <p className="text-secondary">
                    {profile.about || t("no_description_provided")}
                  </p>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-mortarboard me-2 text-success"></i>
                  {t("education")}
                </h5>
              </div>
              <div className="card-body p-4">
                {isEditing ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">{t("degree")}</label>
                      <input 
                        name="degree" 
                        value={formData.education.degree} 
                        onChange={handleEducationChange} 
                        className="form-control"
                        placeholder={t("degree_placeholder")}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t("college_university")}</label>
                      <input 
                        name="college" 
                        value={formData.education.college} 
                        onChange={handleEducationChange} 
                        className="form-control"
                        placeholder={t("college_placeholder")}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">{t("year_of_graduation")}</label>
                      <input 
                        name="year" 
                        type="number"
                        value={formData.education.year} 
                        onChange={handleEducationChange} 
                        className="form-control"
                        placeholder={t("year_placeholder")}
                        min="1950"
                        max="2030"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    {profile.education ? (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label text-muted small fw-bold">{t("degree")}</label>
                          <p className="fw-medium">
                            {typeof profile.education === 'string' 
                              ? profile.education 
                              : (profile.education.degree || t("not_specified"))}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small fw-bold">{t("college_university")}</label>
                          <p className="fw-medium">
                            {typeof profile.education === 'object' && profile.education.college && profile.education.college.trim() !== ""
                              ? profile.education.college 
                              : t("not_specified")}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label text-muted small fw-bold">{t("year_of_graduation")}</label>
                          <p className="fw-medium">
                            {typeof profile.education === 'object' && profile.education.year && profile.education.year > 0
                              ? profile.education.year 
                              : t("not_specified")}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-secondary">{t("no_education_details")}</p>
                    )}
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
                  {t("profile_completion")}
                </h5>
              </div>
              <div className="card-body p-4">
                {(() => {
                  const completion = calculateProfileCompletion();
                  const color = getCompletionColor(completion);
                  return (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-medium">{completion}{t("percent_complete")}</span>
                        <span className={`badge bg-${color}`}>
                          {completion >= 80 ? t("profile_completion_excellent") : 
                           completion >= 50 ? t("profile_completion_good") : 
                           t("profile_completion_needs_work")}
                        </span>
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
                          t("complete_profile_message") :
                          t("profile_complete_message")
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
                  {t("skills")}
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
                      placeholder={t("skills_placeholder")}
                    />
                    <small className="form-text text-muted">
                      {t("separate_skills_comma")}
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
                          {t("no_skills_listed")}
                        </span>
                      }
                    </div>
                    {(!profile.skills || profile.skills.length === 0) && (
                      <span className="text-muted small">
                        {t("no_skills_listed")}
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
                  {t("resume")}
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
                      placeholder={t("resume_placeholder")}
                    />
                    <small className="form-text text-muted">
                      {t("resume_link_helper")}
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
                          {t("view_resume")}
                        </a>
                      </div>
                    ) : (
                      <span className="text-muted small">
                        {t("no_resume_uploaded")}
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