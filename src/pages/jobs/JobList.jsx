import React, { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";
import JobCard from "../../components/cards/JobCard";

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

    if (loading) return <div className="p-5 text-center">Loading jobs...</div>;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Find Your Dream Job</h2>
                {/* Simple Filter UI */}
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="form-select w-auto"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                    </select>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="alert alert-info">No jobs found matching your criteria.</div>
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
    );
}
