import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("jobseeker");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ fullname, email, password, role });
        login({ email, password, role });
        navigate('/dashboard');
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: "450px", width: "100%" }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">Create Account</h3>
                        <p className="text-muted">Join us to find your dream job</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Full Name</label>
                            <input
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="form-control"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Email Address</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                placeholder="name@example.com"
                                type="email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label fw-medium">I am a...</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="form-select"
                            >
                                <option value="jobseeker">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button className="btn btn-primary w-100 btn-lg mb-3" type="submit">
                            Sign Up
                        </button>
                    </form>

                    <div className="text-center">
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" className="text-decoration-none fw-bold">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}