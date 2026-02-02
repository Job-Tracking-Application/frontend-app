import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";
import PageHero from "../../components/common/PageHero";
import JobCard from "../../components/cards/JobCard";
import { getJobs } from "../../services/jobService";
import { getMyApplications } from "../../services/applicationService";
import { showErrorToast } from "../../utils/toast";

export default function JobSeekerDashboard() {
    const { t } = useLanguage();

    const [jobs, setJobs] = useState([]);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [allJobsResponse, myAppsResponse] = await Promise.all([
                getJobs().catch(() => ({ data: [] })),
                getMyApplications().catch(() => ({ data: [] }))
            ]);

            const allJobs = allJobsResponse.data || [];
            const myApps = myAppsResponse.data || [];

            setJobs(allJobs);

            if (myApps.length > 0) {
                const keywords = myApps
                    .map(app => app.jobTitle?.split(" ") || [])
                    .flat()
                    .map(k => k.toLowerCase());

                const recommendations = allJobs.filter(job => {
                    const jobTitleLower = job.title?.toLowerCase() || "";
                    return (
                        keywords.some(k => jobTitleLower.includes(k)) &&
                        !myApps.some(app => app.jobTitle === job.title)
                    );
                });

                setRecommendedJobs(
                    recommendations.length > 0
                        ? recommendations.slice(0, 3)
                        : allJobs.slice(0, 3)
                );
            } else {
                setRecommendedJobs(allJobs.slice(0, 3));
            }
        } catch (err) {
            console.error("Error loading dashboard data", err);
            setError("Failed to load dashboard data");
            showErrorToast("Failed to load dashboard data from backend");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (error) {
        return (
            <div>
                <PageHero title={t("hero_title")} subtitle={t("hero_subtitle")} />
                <div className="container pb-5">
                    <div className="alert alert-danger border-0 shadow-sm rounded-3 p-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                        <button
                            className="btn btn-outline-danger btn-sm ms-3"
                            onClick={fetchData}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHero title={t("hero_title")} subtitle={t("hero_subtitle")} />

            <div className="container pb-5">
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">{t("loading")}</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Recommended Jobs */}
                        <section className="mb-5">
                            <div className="d-flex align-items-center mb-3">
                                <h4 className="fw-bold">
                                    <i className="bi bi-stars me-2 text-warning"></i>
                                    {t("recommended_jobs")}
                                </h4>
                            </div>
                            <div className="row g-4">
                                {recommendedJobs.map(job => (
                                    <div key={job.id} className="col-md-6 col-lg-4">
                                        <JobCard job={job} />
                                    </div>
                                ))}
                                {recommendedJobs.length === 0 && (
                                    <p className="text-muted">{t("apply_more_msg")}</p>
                                )}
                            </div>
                        </section>

                        {/* All Jobs */}
                        <section>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="fw-bold">{t("explore_jobs")}</h4>
                                <Link
                                    to="/jobs"
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    {t("see_more")}
                                </Link>
                            </div>
                            <div className="row g-4">
                                {jobs.map(job => (
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