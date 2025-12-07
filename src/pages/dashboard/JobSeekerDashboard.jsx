import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../../components/common/PageHero";
import JobCard from "../../components/cards/JobCard";
import { getJobs } from "../../services/jobService";
import { getMyApplications } from "../../services/applicationService";

export default function JobSeekerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allJobs, myApps] = await Promise.all([getJobs(), getMyApplications()]);

                setJobs(allJobs);
                setAppliedJobs(myApps);

                // Simple Recommendation Engine
                // Extract keywords from applied job titles
                const keywords = myApps.map(app => app.jobTitle.split(" ")).flat().map(k => k.toLowerCase());

                // Filter jobs that match keywords but aren't in applied list (by ID similarity or just title for now)
                // Note: In real app, we'd check job IDs. Here we simulate.
                const recommendations = allJobs.filter(job => {
                    const jobTitleLower = job.title.toLowerCase();
                    return keywords.some(k => jobTitleLower.includes(k)) &&
                        !myApps.some(app => app.jobTitle === job.title); // Avoid re-recommending applied jobs
                });

                // If no recommendations found, fallback to random 2 jobs
                setRecommendedJobs(recommendations.length > 0 ? recommendations : allJobs.slice(0, 2));

            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <PageHero title="Smart Dashboard" subtitle="Jobs curated just for you." />

            <div className="container pb-5">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Recent Activity Section */}
                        <section className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold"><i className="bi bi-clock-history me-2 text-primary"></i>Recent Activity</h4>
                                <Link to="/applications" className="text-decoration-none fw-medium">View All</Link>
                            </div>
                            <div className="row g-3">
                                {appliedJobs.slice(0, 3).map((app) => (
                                    <div key={app.id} className="col-md-4">
                                        <div className="card shadow-sm border-0 h-100">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <div>
                                                    <h6 className="fw-bold mb-1">{app.jobTitle}</h6>
                                                    <small className="text-muted">{app.company}</small>
                                                </div>
                                                <span className={`badge rounded-pill ${app.status === 'Selected' ? 'bg-success' :
                                                        app.status === 'Pending' ? 'bg-warning text-dark' : 'bg-secondary'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Recommended Jobs Section */}
                        <section className="mb-5">
                            <div className="d-flex align-items-center mb-3">
                                <h4 className="fw-bold"><i className="bi bi-stars me-2 text-warning"></i>Recommended for You</h4>
                            </div>
                            <div className="row g-4">
                                {recommendedJobs.map((job) => (
                                    <div key={job.id} className="col-md-6 col-lg-4">
                                        <JobCard job={job} />
                                    </div>
                                ))}
                                {recommendedJobs.length === 0 && <p className="text-muted">Apply to more jobs to get better recommendations!</p>}
                            </div>
                        </section>

                        {/* Explore All Jobs Section */}
                        <section>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold">Explore All Jobs</h4>
                                <Link to="/jobs" className="btn btn-outline-primary btn-sm">See More</Link>
                            </div>
                            <div className="row g-4">
                                {jobs.map((job) => (
                                    <div key={job.id} className="col-md-6 col-lg-4">
                                        <JobCard job={job} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}