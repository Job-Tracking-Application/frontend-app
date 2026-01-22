import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: "400px", width: "100%" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="bi bi-person-circle fs-1 text-primary"></i>
                        <h3 className="fw-bold mt-2">Welcome Back</h3>
                        <p className="text-muted">Sign in to continue</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Email Address</label>
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
                            <label className="form-label fw-medium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            className="btn btn-primary w-100 btn-lg mb-3"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="text-center">
                        <span className="text-muted">New here? </span>
                        <Link to="/register" className="text-decoration-none fw-bold">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}