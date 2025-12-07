import React, { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import JobCard from "../../components/cards/JobCard";
import PageHero from "../../components/common/PageHero";

export default function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");

    useEffect(() => {
        getJobs().then((data) => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "All" || job.type === filterType;
        return matchesSearch && matchesType;
    });

    if (loading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="job-list-page">
            <PageHero
                title="Find Your Dream Job"
                subtitle="Discover opportunities that match your skills and aspirations."
            >
                <div className="bg-white p-2 rounded-pill shadow-lg d-inline-flex align-items-center w-100 mx-auto" style={{ maxWidth: "600px" }}>
                    <i className="bi bi-search text-muted ms-3 fs-5"></i>
                    <input
                        type="text"
                        className="form-control border-0 shadow-none ms-2"
                        placeholder="Search by job title or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ fontSize: "1.1rem" }}
                    />
                </div>
            </PageHero>

            <div className="container pb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold mb-0 text-dark">Latest Openings</h3>
                    <select
                        className="form-select w-auto shadow-sm border-0 bg-light"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ fontWeight: "500" }}
                    >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>

                {filteredJobs.length === 0 ? (
                    <div className="alert alert-info border-0 shadow-sm rounded-3 p-4">
                        <i className="bi bi-info-circle me-2"></i> No jobs found matching your criteria.
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredJobs.map((job) => (
                            <div key={job.id} className="col-md-6 col-lg-4">
                                <JobCard job={job} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
