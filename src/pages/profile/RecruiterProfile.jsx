import { useEffect, useState, useCallback } from "react";
import {
  getMyCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  hasCompanyProfile
} from "../../services/companyService";
import {
  getRecruiterProfile,
  updateRecruiterProfile
} from "../../services/recruiterProfileService";
import PageHero from "../../components/common/PageHero";
import Loader from "../../components/common/Loader";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/useLanguage";
import { useAuth } from "../../context/useAuth";
import "./RecruiterProfile.css";

export default function RecruiterProfile() {
  const { t } = useLanguage();
  const { user: authUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    fullName: "",
    phone: "",
    linkedinUrl: "",
    yearsExperience: "",
    specialization: "",
    bio: ""
  });

  const [companyForm, setCompanyForm] = useState({
    name: "",
    contactEmail: "",
    website: "",
    city: "",
    description: ""
  });

  const [companyId, setCompanyId] = useState(null);
  const [verified, setVerified] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const recruiter = await getRecruiterProfile();
      if (recruiter) {
        setPersonalForm({
          fullName: recruiter.fullName || "",
          phone: recruiter.phone || "",
          linkedinUrl: recruiter.linkedinUrl || "",
          yearsExperience: recruiter.yearsExperience || "",
          specialization: recruiter.specialization || "",
          bio: recruiter.bio || ""
        });
      }

      const hasCompany = await hasCompanyProfile();
      if (hasCompany.data?.data) {
        const res = await getMyCompanyProfile();
        const c = res.data.data;

        setCompanyId(c.id);
        setVerified(c.verified);
        setCompanyForm({
          name: c.name || "",
          contactEmail: c.contactEmail || "",
          website: c.website || "",
          city: c.city || "",
          description: c.description || ""
        });
      } else {
        setCreatingCompany(true);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setError(t("load_profile_error"));
      showErrorToast(t("load_profile_error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const savePersonalProfile = async () => {
    try {
      setSaving(true);
      await updateRecruiterProfile(personalForm);
      showSuccessToast(t("profile_updated"));
      setEditingPersonal(false);
    } catch (error) {
      console.error("Error updating personal profile:", error);
      showErrorToast(t("profile_update_error"));
    } finally {
      setSaving(false);
    }
  };

  const saveCompanyProfile = async () => {
    try {
      setSaving(true);
      if (creatingCompany) {
        const res = await createCompanyProfile(companyForm);
        setCompanyId(res.data.data.id);
        setVerified(res.data.data.verified);
        setCreatingCompany(false);
      } else {
        await updateCompanyProfile(companyId, companyForm);
      }
      showSuccessToast(t("company_profile_updated"));
      setEditingCompany(false);
    } catch (error) {
      console.error("Error updating company profile:", error);
      showErrorToast(t("company_profile_error"));
    } finally {
      setSaving(false);
    }
  };

  const calculateProfileCompletion = () => {
    const personalFields = [
      personalForm.fullName,
      personalForm.phone,
      personalForm.linkedinUrl,
      personalForm.yearsExperience,
      personalForm.specialization,
      personalForm.bio
    ];

    const companyFields = [
      companyForm.name,
      companyForm.contactEmail,
      companyForm.website,
      companyForm.city,
      companyForm.description
    ];

    const allFields = [...personalFields, ...companyFields];
    const completedFields = allFields.filter(field => 
      field && field.toString().trim() !== ""
    ).length;

    return Math.round((completedFields / allFields.length) * 100);
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div>
        <PageHero title={t("recruiter_profile_title")} subtitle={t("recruiter_profile_subtitle")} />
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">{t("error_loading_profile")}</h4>
            <p>{error}</p>
            <button className="btn btn-outline-danger" onClick={loadData}>
              {t("try_again")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHero
        title={t("recruiter_profile_title")}
        subtitle={t("recruiter_profile_subtitle")}
      />

      <div className="container pb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">{t("welcome_message", { name: personalForm.fullName || authUser?.fullname || t("recruiter") })}</h4>
            <p className="text-muted mb-0">{t("recruiter_profile_subtitle")}</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Personal Information Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    {t("personal_information")}
                  </h5>
                  {!editingPersonal && (
                    <button className="btn btn-primary btn-sm" onClick={() => setEditingPersonal(true)}>
                      <i className="bi bi-pencil me-2"></i>
                      {t("edit_profile")}
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body p-4">
                {editingPersonal ? (
                  <div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("full_name")}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={personalForm.fullName}
                          onChange={e => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                          placeholder={t("enter_full_name")}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("phone")}</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={personalForm.phone}
                          onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                          placeholder={t("enter_phone")}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("linkedin")}</label>
                        <input
                          type="url"
                          className="form-control"
                          value={personalForm.linkedinUrl}
                          onChange={e => setPersonalForm({ ...personalForm, linkedinUrl: e.target.value })}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("experience")}</label>
                        <input
                          type="number"
                          className="form-control"
                          value={personalForm.yearsExperience}
                          onChange={e => setPersonalForm({ ...personalForm, yearsExperience: e.target.value })}
                          placeholder={t("years_of_experience")}
                          min="0"
                          max="50"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold">{t("specialization")}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={personalForm.specialization}
                          onChange={e => setPersonalForm({ ...personalForm, specialization: e.target.value })}
                          placeholder={t("your_specialization")}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold">{t("bio")}</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={personalForm.bio}
                          onChange={e => setPersonalForm({ ...personalForm, bio: e.target.value })}
                          placeholder={t("tell_about_yourself")}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        className="btn btn-success"
                        onClick={savePersonalProfile}
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
                        onClick={() => setEditingPersonal(false)}
                        disabled={saving}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("full_name")}</label>
                      <p className="fw-medium">{personalForm.fullName || t("not_provided")}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("phone")}</label>
                      <p className="fw-medium">{personalForm.phone || t("not_provided")}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("linkedin")}</label>
                      <p className="fw-medium">
                        {personalForm.linkedinUrl ? (
                          <a href={personalForm.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <i className="bi bi-linkedin me-2"></i>
                            {t("view_profile")}
                          </a>
                        ) : (
                          t("not_provided")
                        )}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("experience")}</label>
                      <p className="fw-medium">
                        {personalForm.yearsExperience ? `${personalForm.yearsExperience} ${t("years")}` : t("not_provided")}
                      </p>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">{t("specialization")}</label>
                      <p className="fw-medium">{personalForm.specialization || t("not_provided")}</p>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">{t("bio")}</label>
                      <p className="text-secondary">{personalForm.bio || t("no_bio")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Information Card */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">
                    <i className="bi bi-building me-2 text-info"></i>
                    {t("company_information")}
                  </h5>
                  {!editingCompany && !creatingCompany && (
                    <button className="btn btn-primary btn-sm" onClick={() => setEditingCompany(true)}>
                      <i className="bi bi-pencil me-2"></i>
                      {t("edit_profile")}
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body p-4">
                {editingCompany || creatingCompany ? (
                  <div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("company_name")}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={companyForm.name}
                          onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                          placeholder={t("enter_company_name")}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("contact_email")}</label>
                        <input
                          type="email"
                          className="form-control"
                          value={companyForm.contactEmail}
                          onChange={e => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
                          placeholder={t("enter_contact_email")}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("website")}</label>
                        <input
                          type="url"
                          className="form-control"
                          value={companyForm.website}
                          onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })}
                          placeholder="https://company.com"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">{t("city")}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={companyForm.city}
                          onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })}
                          placeholder={t("enter_city")}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold">{t("description")}</label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={companyForm.description}
                          onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })}
                          placeholder={t("company_description_placeholder")}
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        className="btn btn-success"
                        onClick={saveCompanyProfile}
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
                            {creatingCompany ? t("create_company") : t("save_changes")}
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEditingCompany(false);
                          if (creatingCompany && !companyId) {
                            setCreatingCompany(true);
                          }
                        }}
                        disabled={saving}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("company_name")}</label>
                      <p className="fw-medium">{companyForm.name || t("not_provided")}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("contact_email")}</label>
                      <p className="fw-medium">{companyForm.contactEmail || t("not_provided")}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("website")}</label>
                      <p className="fw-medium">
                        {companyForm.website ? (
                          <a href={companyForm.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            <i className="bi bi-globe me-2"></i>
                            {t("visit_website")}
                          </a>
                        ) : (
                          t("not_provided")
                        )}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("city")}</label>
                      <p className="fw-medium">{companyForm.city || t("not_provided")}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">{t("verification_status")}</label>
                      <p className="fw-medium">
                        <span className={`badge ${verified ? "bg-success" : "bg-warning"}`}>
                          <i className={`bi ${verified ? "bi-check-circle" : "bi-clock"} me-1`}></i>
                          {verified ? t("verified") : t("pending")}
                        </span>
                      </p>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">{t("description")}</label>
                      <p className="text-secondary">{companyForm.description || t("no_description")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
                      <div className="progress mb-3" style={{ height: '8px' }}>
                        <div
                          className={`progress-bar bg-${color}`}
                          role="progressbar"
                          style={{ width: `${completion}%` }}
                        ></div>
                      </div>
                      <small className="text-muted">
                        {completion < 100 ?
                          t("complete_recruiter_profile_message") :
                          t("recruiter_profile_complete_message")
                        }
                      </small>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Verification Status Card */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-shield-check me-2 text-success"></i>
                  {t("verification_status")}
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="text-center">
                  <div className={`mb-3 ${verified ? 'text-success' : 'text-warning'}`}>
                    <i className={`bi ${verified ? 'bi-check-circle-fill' : 'bi-clock-fill'} fs-1`}></i>
                  </div>
                  <h6 className="fw-bold mb-2">
                    {verified ? t("company_verified") : t("verification_pending")}
                  </h6>
                  <p className="text-muted small mb-0">
                    {verified 
                      ? t("company_verified_message")
                      : t("verification_pending_message")
                    }
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}