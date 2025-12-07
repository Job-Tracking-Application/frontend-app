import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function Login(){
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const { login } = useAuth();
const navigate = useNavigate();


const handleSubmit = (e) => {
e.preventDefault();
console.log({ email, password });
// dummy login default role jobseeker
login({ email, password, role: 'jobseeker' });
navigate('/dashboard');
};


return (
<div className="container mt-5">
<div className="row justify-content-center">
<div className="col-md-6">
<div className="card">
<div className="card-body">
<h4 className="card-title mb-4">Login</h4>
<form onSubmit={handleSubmit}>
<div className="mb-3">
<label className="form-label">Email</label>
<input value={email} onChange={(e)=>setEmail(e.target.value)} className="form-control" placeholder="Enter email" />
</div>
<div className="mb-3">
<label className="form-label">Password</label>
<input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="form-control" placeholder="Enter password" />
</div>


<button className="btn btn-primary w-100" type="submit">Login</button>
</form>


<div className="mt-3 text-center">
<span>Don't have an account? </span>
<Link to="/register">Register</Link>
</div>
</div>
</div>
</div>
</div>
</div>
);
}