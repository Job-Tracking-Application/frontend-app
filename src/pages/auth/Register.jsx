import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { getValidationErrors, formatPhoneNumber } from "../../utils/validators";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useLanguage } from "../../context/useLanguage";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";

const roleMap = {
    jobseeker: 3,  // JOB_SEEKER
    recruiter: 2   // RECRUITER
    // Admin accounts are created via backend/database only
};

export default function Register() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "jobseeker"
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === "phone") {
            processedValue = formatPhoneNumber(value);
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = getValidationErrors(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showErrorToast(t("Please fix the errors in the form"));
            return;
        }

        setIsSubmitting(true);

        try {
            await registerUser({
                ...formData,
                phone: formData.phone.replace(/\s/g, ""),
                roleId: roleMap[formData.role]
            });

            showSuccessToast(t("Registration successful! Please login."));
            navigate("/login");
        } catch (error) {
            showErrorToast(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
        >
            {/* Language Switcher - Top Right */}
            <div className="position-absolute top-0 end-0 p-3">
                <LanguageSwitcher />
            </div>
            
            <div className="card shadow-lg border-0" style={{ maxWidth: "460px", width: "100%" }}>
                <div className="card-body p-4">
                    <div className="text-center mb-3">
                        <h4 className="fw-bold">{t("Create Account")}</h4>
                        <p className="text-muted small mb-0">
                            {t("Join us to find your dream job")}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-2">
                            <div className="col-md-6">
                                <label className="form-label small fw-medium">{t("Full Name")}</label>
                                <input
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className={`form-control form-control-sm ${errors.fullname ? "is-invalid" : ""}`}
                                    placeholder={t("eg. Rahul Patil")}
                                />
                                {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
                            </div>

                            <div className="col-md-6">
                                <label className="form-label small fw-medium">{t("Username")}</label>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`form-control form-control-sm ${errors.username ? "is-invalid" : ""}`}
                                    placeholder={t("eg. rahul_patil")}
                                />
                                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                            </div>
                        </div>

                        <div className="mb-2 mt-2">
                            <label className="form-label small fw-medium">{t("Email")}</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                                placeholder={t("eg. rahul.patil@gmail.com")}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label small fw-medium">{t("Phone")}</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`form-control form-control-sm ${errors.phone ? "is-invalid" : ""}`}
                                placeholder={t("+91 9876543210")}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label small fw-medium">{t("Password")}</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
                                placeholder={t("Create password")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-medium">{t("I am a...")}</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-select form-select-sm"
                            >
                                <option value="jobseeker">{t("Job Seeker")}</option>
                                <option value="recruiter">{t("Recruiter")}</option>
                            </select>
                        </div>

                        <button
                            className="btn btn-primary w-100 mb-2"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t("Creating...") : t("Sign Up")}
                        </button>
                    </form>

                    <div className="text-center small">
                        <span className="text-muted">{t("Already have an account?")} </span>
                        <Link to="/login" className="fw-bold text-decoration-none">
                            {t("Sign In")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
