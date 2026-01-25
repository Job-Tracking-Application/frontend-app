import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addJob } from "../../services/jobService";
import { getCompanies } from "../../services/companyService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { useLanguage } from "../../context/useLanguage";

export default function CreateJob() {
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
        jobType: t("full_time"),
        companyId: "",
        deadline: ""
    });
    const [skillIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    useEffect(() => {
        loadCompanies();
    }, []);

    const loadCompanies = async () => {
        try {
            setCompaniesLoading(true);
            const response = await getCompanies();
            setCompanies(response.data || []);
        } catch (error) {
            console.error("Error loading companies:", error);
            showErrorToast(t("load_companies_error"));
            setCompanies([]);
        } finally {
            setCompaniesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        setLoading(true);
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
                                            {companies.map(company => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                        {companiesLoading && (
                                            <small className="text-muted">{t("loading_companies_hint")}</small>
                                        )}
                                        {!companiesLoading && companies.length === 0 && (
                                            <small className="text-danger">{t("no_companies_error")}</small>
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
                                        disabled={loading || companiesLoading || companies.length === 0}
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