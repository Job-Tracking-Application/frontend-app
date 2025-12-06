import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function Register(){
const [fullname, setFullname] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [role, setRole] = useState("jobseeker");


const { login } = useAuth();
const navigate = useNavigate();


const handleSubmit = (e) => {
e.preventDefault();
// For now, register simply logs and sets user
console.log({ fullname, email, password, role });
login({ email, password, role });
navigate('/dashboard');
};


return (
<div className="container mt-5">
<div className="row justify-content-center">
<div className="col-md-6">
<div className="card">
<div className="card-body">
<h4 className="card-title mb-4">Register</h4>
<form onSubmit={handleSubmit}>
<div className="mb-3">
<label className="form-label">Full Name</label>
<input value={fullname} onChange={(e)=>setFullname(e.target.value)} className="form-control" placeholder="Enter full name" />
</div>
<div className="mb-3">
<label className="form-label">Email</label>
<input value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" placeholder="Enter email" />
</div>
<div className="mb-3">
<label className="form-label">Password</label>
<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" placeholder="Enter password" />
</div>
<div className="mb-3">
<label className="form-label">Role</label>
<select value={role} onChange={(e)=>setRole(e.target.value)} className="form-select">
<option value="jobseeker">Job Seeker</option>
<option value="recruiter">Recruiter</option>
<option value="admin">Admin</option>
</select>
</div>


<button className="btn btn-success w-100" type="submit">Register</button>
</form>


<div className="mt-3 text-center">
<span>Already have an account? </span>
<Link to="/login">Login</Link>
</div>
</div>
</div>
</div>
</div>
</div>
);
}