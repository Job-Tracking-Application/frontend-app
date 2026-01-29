import React from 'react';
import { Link } from 'react-router-dom';
import Chatbot from "../components/common/Chatbot";
import "./LandingPage.css";

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-light bg-transparent pt-4">
                <div className="container">
                    <Link className="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center gap-2" to="/">
                        <i className="bi bi-briefcase-fill"></i> JobSync
                    </Link>
                    <div className="d-flex align-items-center gap-3">
                        <Link to="/login" className="nav-link-landing">Log In</Link>
                        <Link to="/register" className="cta-button">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="landing-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title animate-float">
                                Find Your <span>Dream Job</span>. <br />
                                Unlock Your Potential.
                            </h1>
                            <p className="hero-subtitle">
                                Join JobSync to connect with top employers and fast-track your career.
                                Our powerful matching tools find the perfect roles for your skills.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/register" className="cta-button">Get Started</Link>
                                <Link to="/jobs" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-medium">Explore Jobs</Link>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-block">
                            <div className="position-relative">
                                <div className="glass-card text-center position-relative z-1">
                                    <img
                                        src="/hero-image.png"
                                        alt="Professional working"
                                        className="img-fluid rounded-3 mb-4 shadow-sm"
                                        style={{ maxHeight: '320px', objectFit: 'cover', width: '100%' }}
                                    />
                                    <div className="text-start">
                                        <div className="badge bg-primary mb-2 shadow-sm">Hot Job</div>
                                        <h4 className="text-dark fw-bold mb-1">Senior Frontend Developer</h4>
                                        <p className="text-muted small mb-0">Remote • Full-time • $120k+</p>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="position-absolute top-50 start-50 translate-middle w-100 h-100 bg-primary opacity-5 rounded-circle blur-3xl" style={{ filter: 'blur(80px)', zIndex: 0 }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="feature-grid">
                        <div className="feature-item glass-card">
                            <div className="feature-icon">
                                <i className="bi bi-search"></i>
                            </div>
                            <h3>Smart Search</h3>
                            <p className="text-muted">Easily find jobs that match your skills and experience with our advanced search filters.</p>
                        </div>
                        <div className="feature-item glass-card">
                            <div className="feature-icon">
                                <i className="bi bi-building"></i>
                            </div>
                            <h3>Top Companies</h3>
                            <p className="text-muted">Direct access to leading tech firms and innovative startups worldwide.</p>
                        </div>
                        <div className="feature-item glass-card">
                            <div className="feature-icon">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <h3>Career Growth</h3>
                            <p className="text-muted">Resources and tools to help you level up your skills and climb the career ladder.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-5 text-center text-muted border-top mt-5 bg-light">
                <div className="container">
                    <p className="mb-0">&copy; 2026 JobSync Recruitment App. All rights reserved.</p>
                </div>
            </footer>

            {/* Chatbot Assistant */}
            <Chatbot />
        </div>
    );
};

export default LandingPage;
