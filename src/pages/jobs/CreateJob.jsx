import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addJob } from "../../services/jobService";

export default function CreateJob() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        type: "Full-time",
        salary: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await addJob(formData);
        setLoading(false);
        navigate('/jobs');
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mb-4">Post a New Job</h2>
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Company Name</label>
                                        <input
                                            type="text"
                                            name="company"
                                            className="form-control"
                                            required
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-control"
                                            required
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Job Type</label>
                                        <select
                                            name="type"
                                            className="form-select"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Salary Range</label>
                                        <input
                                            type="text"
                                            name="salary"
                                            className="form-control"
                                            placeholder="e.g. ₹3L - ₹6L"
                                            required
                                            value={formData.salary}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-control"
                                        rows="5"
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="d-flex justify-content-end gap-3">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Posting..." : "Post Job"}
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
