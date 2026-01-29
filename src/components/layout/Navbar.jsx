import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import { getInitials } from "../../utils/helpers";

import { useTranslation } from "react-i18next";
import { menuItems } from "../../utils/menuItems";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { user, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const role = user?.role || "guest";
  const menu = menuItems[role] || menuItems.guest;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white me-3 p-0 d-lg-none"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            <i className={`bi ${isSidebarOpen ? "bi-list-nested" : "bi-list"} fs-3`} />
          </button>

          <a
            className="navbar-brand d-flex align-items-center gap-2"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/dashboard");
            }}
          >
            <i className="bi bi-briefcase-fill"></i> JobSync
          </a>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex ms-4 gap-4">
            {menu.map((item) => (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className="text-white text-decoration-none opacity-75 fw-medium d-flex align-items-center gap-2"
              >
                <i className={`bi ${item.icon}`} />
                {t(item.label)}
              </a>
            ))}
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Language switch */}
          <button
            className="btn btn-sm btn-outline-light opacity-75"
            onClick={() => changeLanguage(language === "en" ? "mr" : "en")}
            title="Switch Language"
          >
            {language.toUpperCase()}
          </button>

          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-link text-white dropdown-toggle d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
              >
                <div
                  className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: "32px", height: "32px" }}
                >
                  {getInitials(user.fullname || user.email)}
                </div>
                <span className="d-none d-sm-inline">
                  {user.fullname || user.email}
                </span>
              </button>

              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/dashboard")}>
                    {t("nav_dashboard")}
                  </button>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    {t("nav_logout")}
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light" onClick={() => navigate("/login")}>
                {t("nav_login")}
              </button>
              <button className="btn btn-light text-primary" onClick={() => navigate("/register")}>
                {t("nav_register")}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
