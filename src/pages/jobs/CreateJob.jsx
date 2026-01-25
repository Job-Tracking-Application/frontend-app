import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addJob } from "../../services/jobService";
import { getMyCompanyProfile } from "../../services/companyService";
import { getSkills } from "../../services/skillService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/useLanguage";

export default function CreateJob() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [company, setCompany] = useState(null); // Single company instead of array
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        minExperience: "",
        maxExperience: "",
        jobType: t("full_time"),
        companyId: "", // Will be set automatically
        deadline: ""
    });
    const [skillIds, setSkillIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [skillsLoading, setSkillsLoading] = useState(true);

    useEffect(() => {
        loadCompany();
        loadSkills();
    }, []);

    const loadCompany = async () => {
        try {
            setCompanyLoading(true);
            const response = await getMyCompanyProfile();
            
            if (response && response.data && response.data.data) {
                const companyData = response.data.data;
                setCompany(companyData);
                // Automatically set the company ID in form data
                setFormData(prev => ({ ...prev, companyId: companyData.id }));
            } else {
                setCompany(null);
            }
        } catch (error) {
            console.error("Error loading company:", error);
            setCompany(null);
            
            if (error.response?.status === 401) {
                showErrorToast("Authentication required. Please login again.");
            } else {
                showErrorToast("Error loading company profile");
            }
        } finally {
            setCompanyLoading(false);
        }
    };

    const loadSkills = async () => {
        try {
            setSkillsLoading(true);
            const response = await getSkills();
            setSkills(response.data || []);
        } catch (error) {
            console.error("Error loading skills:", error);
            showErrorToast("Error loading skills");
            setSkills([]);
        } finally {
            setSkillsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (skillId) => {
        setSkillIds(prev => {
            if (prev.includes(skillId)) {
                return prev.filter(id => id !== skillId);
            } else {
                return [...prev, skillId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!company) {
            showErrorToast(t("no_company_profile_error"));
            return;
        }
        
        if (parseFloat(formData.minSalary) >= parseFloat(formData.maxSalary)) {
            showErrorToast(t("salary_validation_error"));
            return;
        }

        setLoading(true);
        try {
            const jobData = {
                ...formData,
                minSalary: parseFloat(formData.minSalary),
                maxSalary: parseFloat(formData.maxSalary),
                minExperience: formData.minExperience ? parseInt(formData.minExperience) : null,
                maxExperience: formData.maxExperience ? parseInt(formData.maxExperience) : null,
                companyId: company.id, // Use the company ID directly
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
            };
            
            await addJob(jobData, skillIds);
            showSuccessToast(t("job_post_success"));
            navigate('/jobs/my-jobs');
        } catch (error) {
            console.error("Error creating job:", error);
            const errorMessage = error.response?.data?.message || error.message || t("job_post_error");
            showErrorToast(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mb-4">{t("post_new_job_title")}</h2>
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">{t("job_title")} *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder={t("job_title_placeholder")}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("company")} *</label>
                                        {companyLoading ? (
                                            <div className="form-control d-flex align-items-center">
                                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                {t("loading_company")}
                                            </div>
                                        ) : company ? (
                                            <>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={company.name}
                                                        disabled
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => navigate('/profile')}
                                                        title={t("edit_company_profile")}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                </div>
                                                <small className="text-muted">{t("company_profile_edit_hint")}</small>
                                            </>
                                        ) : (
                                            <div className="border rounded p-3 bg-light text-center">
                                                <div className="text-muted mb-2">
                                                    <i className="bi bi-building me-2"></i>
                                                    {t("no_company_profile")}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate('/profile')}
                                                >
                                                    {t("create_company_profile")}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("job_location")}</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder={t("job_location_placeholder")}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("job_type")} *</label>
                                        <select
                                            name="jobType"
                                            className="form-select"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                        >
                                            <option value="Full-time">{t("full_time")}</option>
                                            <option value="Part-time">{t("part_time")}</option>
                                            <option value="Contract">{t("contract")}</option>
                                            <option value="Internship">{t("internship")}</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("application_deadline")}</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            className="form-control"
                                            value={formData.deadline}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("min_salary")} (₹) *</label>
                                        <input
                                            type="number"
                                            name="minSalary"
                                            className="form-control"
                                            required
                                            value={formData.minSalary}
                                            onChange={handleChange}
                                            placeholder="e.g. 300000"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("max_salary")} (₹) *</label>
                                        <input
                                            type="number"
                                            name="maxSalary"
                                            className="form-control"
                                            required
                                            value={formData.maxSalary}
                                            onChange={handleChange}
                                            placeholder="e.g. 600000"
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("min_experience")}</label>
                                        <input
                                            type="number"
                                            name="minExperience"
                                            className="form-control"
                                            value={formData.minExperience}
                                            onChange={handleChange}
                                            placeholder={t("min_experience_placeholder")}
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("max_experience")}</label>
                                        <input
                                            type="number"
                                            name="maxExperience"
                                            className="form-control"
                                            value={formData.maxExperience}
                                            onChange={handleChange}
                                            placeholder={t("max_experience_placeholder")}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">{t("required_skills")}</label>
                                    <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {skillsLoading ? (
                                            <div className="text-center">
                                                <small className="text-muted">Loading skills...</small>
                                            </div>
                                        ) : skills.length === 0 ? (
                                            <small className="text-muted">No skills available</small>
                                        ) : (
                                            <div className="row">
                                                {skills.map(skill => (
                                                    <div key={skill.id} className="col-md-6 col-lg-4 mb-2">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`skill-${skill.id}`}
                                                                checked={skillIds.includes(skill.id)}
                                                                onChange={() => handleSkillChange(skill.id)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`skill-${skill.id}`}>
                                                                {skill.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <small className="text-muted">
                                        {skillIds.length > 0 ? `${skillIds.length} skills selected` : "Select skills required for this job"}
                                    </small>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">{t("job_description")} *</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="5"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder={t("job_description_placeholder")}
                                    ></textarea>
                                </div>

                                <div className="d-flex justify-content-end gap-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => navigate('/jobs/my-jobs')}
                                        disabled={loading}
                                    >
                                        {t("cancel")}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={loading || companyLoading || skillsLoading || !company}
                                    >
                                        {loading ? t("posting") : t("post_job")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}