import React, { useEffect, useState } from "react";
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
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/LanguageContext";

export default function RecruiterProfile() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
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
      if (hasCompany.data.data) {
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
    } catch (err) {
      showErrorToast(t("load_profile_error"));
    } finally {
      setLoading(false);
    }
  };

  const savePersonalProfile = async () => {
    try {
      await updateRecruiterProfile(personalForm);
      showSuccessToast(t("profile_updated"));
      setEditingPersonal(false);
    } catch {
      showErrorToast(t("profile_update_error"));
    }
  };

  const saveCompanyProfile = async () => {
    try {
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
    } catch {
      showErrorToast(t("company_profile_error"));
    }
  };

  if (loading) {
    return <div className="text-center py-5">{t("loading")}</div>;
  }

  return (
    <div>
      <PageHero
        title={t("recruiter_profile_title")}
        subtitle={t("recruiter_profile_subtitle")}
      />

      <div className="container pb-5">

        {/* PERSONAL INFORMATION */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white d-flex justify-content-between">
            <h5 className="fw-bold">{t("personal_information")}</h5>
            {!editingPersonal && (
              <Button size="sm" onClick={() => setEditingPersonal(true)}>
                {t("edit_profile")}
              </Button>
            )}
          </div>

          <div className="card-body">
            {editingPersonal ? (
              <>
                <Input label={t("full_name")} value={personalForm.fullName}
                  onChange={e => setPersonalForm({ ...personalForm, fullName: e.target.value })} />
                <Input label={t("phone")} value={personalForm.phone}
                  onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })} />
                <Input label={t("linkedin")} value={personalForm.linkedinUrl}
                  onChange={e => setPersonalForm({ ...personalForm, linkedinUrl: e.target.value })} />
                <Input type="number" label={t("experience")} value={personalForm.yearsExperience}
                  onChange={e => setPersonalForm({ ...personalForm, yearsExperience: e.target.value })} />
                <Input label={t("specialization")} value={personalForm.specialization}
                  onChange={e => setPersonalForm({ ...personalForm, specialization: e.target.value })} />

                <label className="fw-bold">{t("bio")}</label>
                <textarea className="form-control mb-3"
                  value={personalForm.bio}
                  onChange={e => setPersonalForm({ ...personalForm, bio: e.target.value })} />

                <Button onClick={savePersonalProfile}>{t("save")}</Button>
                <Button variant="secondary" className="ms-2"
                  onClick={() => setEditingPersonal(false)}>
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <div className="row g-3">
                <div className="col-md-6"><b>{t("full_name")}</b><p>{personalForm.fullName || t("not_provided")}</p></div>
                <div className="col-md-6"><b>{t("phone")}</b><p>{personalForm.phone || t("not_provided")}</p></div>
                <div className="col-md-6"><b>{t("linkedin")}</b>
                  <p>{personalForm.linkedinUrl ? <a href={personalForm.linkedinUrl} target="_blank" rel="noreferrer">{t("view_profile")}</a> : t("not_provided")}</p>
                </div>
                <div className="col-md-6"><b>{t("experience")}</b>
                  <p>{personalForm.yearsExperience ? `${personalForm.yearsExperience} ${t("years")}` : t("not_provided")}</p>
                </div>
                <div className="col-md-6"><b>{t("specialization")}</b><p>{personalForm.specialization || t("not_provided")}</p></div>
                <div className="col-12"><b>{t("bio")}</b><p>{personalForm.bio || t("no_bio")}</p></div>
              </div>
            )}
          </div>
        </div>

        {/* COMPANY INFORMATION */}
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between">
            <h5 className="fw-bold">{t("company_information")}</h5>
            {!editingCompany && (
              <Button size="sm" onClick={() => setEditingCompany(true)}>
                {t("edit_profile")}
              </Button>
            )}
          </div>

          <div className="card-body">
            {editingCompany || creatingCompany ? (
              <>
                <Input label={t("company_name")} value={companyForm.name}
                  onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} />
                <Input label={t("contact_email")} value={companyForm.contactEmail}
                  onChange={e => setCompanyForm({ ...companyForm, contactEmail: e.target.value })} />
                <Input label={t("website")} value={companyForm.website}
                  onChange={e => setCompanyForm({ ...companyForm, website: e.target.value })} />
                <Input label={t("city")} value={companyForm.city}
                  onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })} />

                <label className="fw-bold">{t("description")}</label>
                <textarea className="form-control mb-3"
                  value={companyForm.description}
                  onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })} />

                <Button onClick={saveCompanyProfile}>{t("save")}</Button>
                <Button variant="secondary" className="ms-2"
                  onClick={() => setEditingCompany(false)}>
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <div className="row g-3">
                <div className="col-md-6"><b>{t("company_name")}</b><p>{companyForm.name}</p></div>
                <div className="col-md-6"><b>{t("contact_email")}</b><p>{companyForm.contactEmail || t("not_provided")}</p></div>
                <div className="col-md-6"><b>{t("website")}</b><p>{companyForm.website || t("not_provided")}</p></div>
                <div className="col-md-6"><b>{t("city")}</b><p>{companyForm.city || t("not_provided")}</p></div>
                <div className="col-md-6"><b>{t("verification_status")}</b>
                  <span className={`badge ${verified ? "bg-success" : "bg-warning"}`}>
                    {verified ? t("verified") : t("pending")}
                  </span>
                </div>
                <div className="col-12"><b>{t("description")}</b><p>{companyForm.description || t("no_description")}</p></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
