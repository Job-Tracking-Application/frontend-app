import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const userData = await login({
                email: formData.email,
                password: formData.password
            });

            // Check if user is actually an admin
            if (userData.role !== 'ADMIN') {
                showErrorToast("Access denied. Admin credentials required.");
                return;
            }

            showSuccessToast("Admin login successful!");
            navigate('/dashboard/admin');
        } catch (error) {
            showErrorToast(
                error.response?.data?.message ||
                error.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <div className="mb-3">
                            <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                        <h3 className="fw-bold">Admin Access</h3>
                        <p className="text-muted">Authorized personnel only</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Admin Email</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="admin@company.com"
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-medium">Admin Password</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Enter admin password"
                                required
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <button 
                            className="btn btn-primary w-100 btn-lg mb-3" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-shield-check me-2"></i>
                                    Admin Login
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mb-3">
                        <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            For security reasons, admin accounts are pre-created by system administrators.
                        </small>
                    </div>

                    <hr className="my-3" />

                    <div className="text-center">
                        <span className="text-muted small">Not an admin? </span>
                        <Link to="/login" className="text-decoration-none fw-bold small">Regular Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}