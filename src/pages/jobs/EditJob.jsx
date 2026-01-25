import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../../services/jobService";
import { getCompanies } from "../../services/companyService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/LanguageContext";
import Loader from "../../components/common/Loader";

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [companies, setCompanies] = useState([]);
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
    const [companiesLoading, setCompaniesLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);

            const [companiesResponse, jobResponse] = await Promise.all([
                getCompanies(),
                getJobById(id)
            ]);

            setCompanies(companiesResponse.data || []);

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
                deadline: job.deadline ? job.deadline.split("T")[0] : ""
            });

        } catch (error) {
            console.error("Error loading data:", error);
            showErrorToast(t("edit_job_load_error"));
        } finally {
            setLoading(false);
            setCompaniesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                deadline: formData.deadline
                    ? new Date(formData.deadline).toISOString()
                    : null
            };

            await updateJob(id, jobData, skillIds);
            showSuccessToast(t("edit_job_success"));
            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error("Error updating job:", error);
            showErrorToast(t("edit_job_error"));
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

                                {/* Job Title */}
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

                                {/* Company & Location */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("company")} *</label>
                                        <select
                                            name="companyId"
                                            className="form-select"
                                            required
                                            value={formData.companyId}
                                            onChange={handleChange}
                                            disabled={companiesLoading}
                                        >
                                            <option value="">
                                                {companiesLoading ? t("loading_companies") : t("select_company")}
                                            </option>
                                            {companies.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
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

                                {/* Job Type & Deadline */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("job_type")} *</label>
                                        <select
                                            name="jobType"
                                            className="form-select"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                        >
                                            <option value="Full-time">{t("job_type_full_time")}</option>
                                            <option value="Part-time">{t("job_type_part_time")}</option>
                                            <option value="Contract">{t("job_type_contract")}</option>
                                            <option value="Internship">{t("job_type_internship")}</option>
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

                                {/* Salary */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("min_salary")} *</label>
                                        <input
                                            type="number"
                                            name="minSalary"
                                            className="form-control"
                                            required
                                            value={formData.minSalary}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("max_salary")} *</label>
                                        <input
                                            type="number"
                                            name="maxSalary"
                                            className="form-control"
                                            required
                                            value={formData.maxSalary}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">{t("min_experience")}</label>
                                        <input
                                            type="number"
                                            name="minExperience"
                                            className="form-control"
                                            value={formData.minExperience}
                                            onChange={handleChange}
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
                                        />
                                    </div>
                                </div>

                                {/* Description */}
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
                                    />
                                </div>

                                {/* Buttons */}
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
                                        disabled={saving || companiesLoading}
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
