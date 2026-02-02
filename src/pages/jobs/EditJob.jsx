import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getJobById, updateJob } from "../../services/jobService";
import { getMyCompanyProfile } from "../../services/companyService";
import { getSkills } from "../../services/skillService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [company, setCompany] = useState(null);
    const [skills, setSkills] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        minExperience: "",
        maxExperience: "",
        jobType: "Full-time",
        companyId: "",
        deadline: ""
    });
    const [skillIds, setSkillIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [skillsLoading, setSkillsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load company, skills, and job data in parallel
            const [companyResponse, skillsResponse, jobResponse] = await Promise.all([
                getMyCompanyProfile(),
                getSkills(),
                getJobById(id)
            ]);

            // Set company
            if (companyResponse && companyResponse.data && companyResponse.data.data) {
                setCompany(companyResponse.data.data);
            }
            
            setSkills(skillsResponse.data || []);
            
            const job = jobResponse.data;
            setFormData({
                title: job.title || "",
                description: job.description || "",
                location: job.location || "",
                minSalary: job.minSalary || "",
                maxSalary: job.maxSalary || "",
                minExperience: job.minExperience || "",
                maxExperience: job.maxExperience || "",
                jobType: job.jobType || "Full-time",
                companyId: job.companyId || "",
                deadline: job.deadline ? job.deadline.split('T')[0] : ""
            });

            // Load existing job skills
            if (job.skills && Array.isArray(job.skills)) {
                const existingSkillIds = job.skills.map(skill => skill.id);
                setSkillIds(existingSkillIds);
            }

        } catch (error) {
            console.error("Error loading data:", error);
            showErrorToast(t("job_load_error"));
        } finally {
            setLoading(false);
            setCompanyLoading(false);
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
        if (!formData.companyId) {
            showErrorToast(t("select_company_error"));
            return;
        }
        
        if (parseFloat(formData.minSalary) >= parseFloat(formData.maxSalary)) {
            showErrorToast(t("salary_validation_error"));
            return;
        }

        setSaving(true);
        try {
            const jobData = {
                ...formData,
                minSalary: parseFloat(formData.minSalary),
                maxSalary: parseFloat(formData.maxSalary),
                minExperience: formData.minExperience ? parseInt(formData.minExperience) : null,
                maxExperience: formData.maxExperience ? parseInt(formData.maxExperience) : null,
                companyId: parseInt(formData.companyId),
                deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
            };
            
            await updateJob(id, jobData, skillIds);
            showSuccessToast(t("edit_job_success"));
            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error("Error updating job:", error);
            const errorMessage = error.response?.data?.message || error.message || t("edit_job_error");
            showErrorToast(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mb-4">{t("edit_job")}</h2>
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
                                        <label className="form-label">{t("edit_min_salary")} *</label>
                                        <input
                                            type="number"
                                            name="minSalary"
                                            className="form-control"
                                            required
                                            value={formData.minSalary}
                                            onChange={handleChange}
                                            placeholder={t("edit_min_salary_placeholder")}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("edit_max_salary")} *</label>
                                        <input
                                            type="number"
                                            name="maxSalary"
                                            className="form-control"
                                            required
                                            value={formData.maxSalary}
                                            onChange={handleChange}
                                            placeholder={t("edit_max_salary_placeholder")}
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
                                        onClick={() => navigate(`/jobs/${id}`)}
                                        disabled={saving}
                                    >
                                        {t("cancel")}
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={saving || companyLoading || skillsLoading || !company}
                                    >
                                        {saving ? t("updating") : t("update_job")}
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