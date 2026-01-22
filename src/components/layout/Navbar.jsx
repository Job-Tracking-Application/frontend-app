import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { menuItems } from "../../utils/menuItems";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { lang, toggle, t } = useLanguage();
  const navigate = useNavigate();
  const role = user?.role || "guest";
  const menu = menuItems[role] || menuItems.guest;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white me-3 p-0 text-decoration-none d-lg-none"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            <i className={`bi ${isSidebarOpen ? 'bi-list-nested' : 'bi-list'} fs-3`}></i>
          </button>

          <a className="navbar-brand d-flex align-items-center gap-2" href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <i className="bi bi-briefcase-fill"></i> JobSync
          </a>

          {/* Desktop Menu Links */}
          <div className="d-none d-lg-flex ms-4 gap-4">
            {menu.map((item) => (
              <a
                key={item.path}
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(item.path); }}
                className="text-white text-decoration-none opacity-75 hover-opacity-100 fw-medium d-flex align-items-center gap-2"
                style={{ transition: 'opacity 0.2s' }}
              >
                <i className={`bi ${item.icon}`}></i>
                {t(item.label)}
              </a>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-sm btn-outline-light opacity-75" onClick={toggle} title="Switch Language">
            {lang.toUpperCase()}
          </button>

          {user ? (
            <div className="dropdown">
              <button className="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "32px", height: "32px" }}>
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="d-none d-sm-inline opacity-90">{user.email?.split('@')[0] || 'User'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                <li><h6 className="dropdown-header text-muted">Signed in as <br /><strong>{user.email}</strong></h6></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={() => navigate('/dashboard')}><i className="bi bi-speedometer2 me-2"></i> {t('nav_dashboard')}</button></li>
                <li><button className="dropdown-item" onClick={() => navigate('/profile')}><i className="bi bi-person me-2"></i> {t('nav_profile')}</button></li>
                <li><button className="dropdown-item" onClick={() => navigate('/settings')}><i className="bi bi-gear me-2"></i> {t('nav_settings')}</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i> {t('nav_logout')}</button></li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light" onClick={() => navigate('/login')}>{t('nav_login')}</button>
              <button className="btn btn-light text-primary fw-bold" onClick={() => navigate('/register')}>{t('nav_register')}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
