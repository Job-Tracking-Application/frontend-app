import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";


export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, toggle } = useLanguage();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">MyJobs</a>


        <div className="d-flex align-items-center">
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={toggle}>
            {lang.toUpperCase()}
          </button>


          {user ? (
            <>
              <div className="me-2">{user.name}</div>
              <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}
