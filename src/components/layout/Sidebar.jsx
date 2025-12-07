import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { menuItems } from "../../utils/menuItems";

export default function Sidebar() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const role = user?.role || "guest";

  const menu = menuItems[role] || menuItems.guest;

  return (
    <div className="bg-white h-100" style={{ boxShadow: "inset -1px 0 0 rgba(0,0,0,0.1)" }}>
      <div className="p-3">
        <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Menu</small>
      </div>
      <ul className="nav flex-column px-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <li key={item.path} className="nav-item mb-1">
              <Link
                className={`nav-link d-flex align-items-center rounded ${isActive ? 'bg-primary text-white' : 'text-dark'}`}
                to={item.path}
                style={{ transition: 'all 0.2s' }}
              >
                <i className={`bi ${item.icon} me-3`}></i>
                {t(item.label)}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
