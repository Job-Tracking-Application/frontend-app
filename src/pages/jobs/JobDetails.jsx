import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../../services/jobService";

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobById(id).then((data) => {
            setJob(data);
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-5 text-center">Loading details...</div>;

    if (!job) {
        return (
            <div className="container py-5 text-center">
                <h3>Job not found</h3>
                <button className="btn btn-secondary mt-3" onClick={() => navigate('/jobs')}>Back to Jobs</button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/jobs')}>
                &larr; Back to Listings
            </button>

            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white p-4">
                    <h1 className="h3 mb-0">{job.title}</h1>
                    <p className="mb-0 opacity-75">{job.company} &bull; {job.location}</p>
                </div>
                <div className="card-body p-4">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h5 className="text-secondary">Job Type</h5>
                            <p className="fs-5">{job.type}</p>
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-secondary">Salary</h5>
                            <p className="fs-5">{job.salary}</p>
                        </div>
                    </div>

                    <h4 className="mb-3">Description</h4>
                    <div className="p-3 bg-light rounded mb-4">
                        {job.description}
                    </div>

                    <div className="d-flex gap-3">
                        <button className="btn btn-primary btn-lg px-4" onClick={() => alert("Application submitted!")}>
                            Apply Now
                        </button>
                        <button className="btn btn-outline-dark btn-lg px-4">
                            Save Job
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
