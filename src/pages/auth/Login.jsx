import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || t("Login failed. Please check your credentials."));
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            {/* Language Switcher - Top Right */}
            <div className="position-absolute top-0 end-0 p-3">
                <LanguageSwitcher />
            </div>
            
            <div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="bi bi-person-circle fs-1 text-primary"></i>
                        <h3 className="fw-bold mt-2">{t("Welcome Back")}</h3>
                        <p className="text-muted">{t("Sign in to continue")}</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-medium">{t("Email Address")}</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="name@example.com"
                                type="email"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-medium">{t("Password")}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder={t("Enter password")}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100 btn-lg mb-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? t("Signing in...") : t("Sign In")}
                        </button>
                    </form>

                    <div className="text-center">
                        <span className="text-muted">{t("New here?")} </span>
                        <Link to="/register" className="text-decoration-none fw-bold">{t("Create Account")}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}