import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../context/useLanguage";
import Chatbot from "../components/common/Chatbot";
import "./LandingPage.css";

const LandingPage = () => {
    const { t } = useTranslation();
    const { language, changeLanguage } = useLanguage();

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-light bg-transparent pt-4">
                <div className="container">
                    <Link className="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center gap-2" to="/">
                        <i className="bi bi-briefcase-fill"></i> JobSync
                    </Link>
                    <div className="d-flex align-items-center gap-3">
                        {/* Language Switcher */}
                        <button
                            className="lang-toggle-btn"
                            onClick={() => changeLanguage(language === 'en' ? 'mr' : 'en')}
                            title={t('switch_language', 'Switch Language')}
                        >
                            <i className="bi bi-globe me-1"></i>
                            {language.toUpperCase()}
                        </button>

                        <Link to="/login" className="nav-link-landing">{t('nav_login')}</Link>
                        <Link to="/register" className="cta-button">{t('nav_register')}</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="landing-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="hero-title animate-float">
                                {t('landing_hero_title')} <span>{t('landing_hero_span')}</span>. <br />
                                {t('landing_hero_title_line2', 'Unlock Your Potential.')}
                            </h1>
                            <p className="hero-subtitle">
                                {t('landing_hero_subtitle')}
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/register" className="cta-button">{t('landing_cta_get_started')}</Link>
                                <Link to="/jobs" className="btn btn-outline-primary rounded-pill px-4 py-2 fw-medium">{t('landing_cta_browse')}</Link>
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
                            <h3>{t('landing_feature_search_title')}</h3>
                            <p className="text-muted">{t('landing_feature_search_desc')}</p>
                        </div>
                        <div className="feature-item glass-card">
                            <div className="feature-icon">
                                <i className="bi bi-building"></i>
                            </div>
                            <h3>{t('landing_feature_verified_title')}</h3>
                            <p className="text-muted">{t('landing_feature_verified_desc')}</p>
                        </div>
                        <div className="feature-item glass-card">
                            <div className="feature-icon">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <h3>{t('landing_feature_apply_title')}</h3>
                            <p className="text-muted">{t('landing_feature_apply_desc')}</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-5 text-center text-muted border-top mt-5 bg-light">
                <div className="container">
                    <p className="mb-0">&copy; 2026 JobSync Recruitment App. {t('all_rights_reserved', 'All rights reserved.')}</p>
                </div>
            </footer>

            {/* Chatbot Assistant */}
            <Chatbot />
        </div>
    );
};

export default LandingPage;
