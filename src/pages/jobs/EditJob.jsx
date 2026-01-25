import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, updateJob } from "../../services/jobService";
import { getCompanies } from "../../services/companyService";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import Loader from "../../components/common/Loader";

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
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
    const [skillIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [companiesLoading, setCompaniesLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            // Load companies and job data in parallel
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
                deadline: job.deadline ? job.deadline.split('T')[0] : ""
            });

        } catch (error) {
            console.error("Error loading data:", error);
            showErrorToast("Failed to load job data. Please try again.");
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
        
        // Validation
        if (!formData.companyId) {
            showErrorToast("Please select a company");
            return;
        }
        
        if (parseFloat(formData.minSalary) >= parseFloat(formData.maxSalary)) {
            showErrorToast("Maximum salary must be greater than minimum salary");
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
            showSuccessToast("Job updated successfully!");
            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error("Error updating job:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update job";
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
                    <h2 className="mb-4">Edit Job</h2>
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Job Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Developer"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Company *</label>
                                        <select
                                            name="companyId"
                                            className="form-select"
                                            required
                                            value={formData.companyId}
                                            onChange={handleChange}
                                            disabled={companiesLoading}
                                        >
                                            <option value="">
                                                {companiesLoading ? "Loading companies..." : "Select Company"}
                                            </option>
                                            {companies.map(company => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai, Remote"
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Job Type *</label>
                                        <select
                                            name="jobType"
                                            className="form-select"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Application Deadline</label>
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
                                        <label className="form-label">Minimum Salary (₹) *</label>
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
                                        <label className="form-label">Maximum Salary (₹) *</label>
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
                                        <label className="form-label">Minimum Experience (years)</label>
                                        <input
                                            type="number"
                                            name="minExperience"
                                            className="form-control"
                                            value={formData.minExperience}
                                            onChange={handleChange}
                                            placeholder="e.g. 0"
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Maximum Experience (years)</label>
                                        <input
                                            type="number"
                                            name="maxExperience"
                                            className="form-control"
                                            value={formData.maxExperience}
                                            onChange={handleChange}
                                            placeholder="e.g. 5"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Job Description *</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="5"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe the job responsibilities, requirements, and benefits..."
                                    ></textarea>
                                </div>

                                <div className="d-flex justify-content-end gap-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => navigate(`/jobs/${id}`)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary" 
                                        disabled={saving || companiesLoading}
                                    >
                                        {saving ? "Updating..." : "Update Job"}
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