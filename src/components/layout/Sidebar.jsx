import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


export default function Sidebar() {
const { user } = useAuth();
const role = user?.role || "guest";


const lists = {
jobseeker: [
["Dashboard", "/dashboard"],
["Jobs", "/jobs"],
["My Applications", "/applications"],
["Profile", "/profile"],
["Settings", "/settings"],
],
recruiter: [
["Dashboard", "/dashboard"],
["Create Job", "/jobs/create"],
["Manage Applications", "/applications/manage"],
["Profile", "/profile"],
["Settings", "/settings"],
],
admin: [
["Dashboard", "/admin"],
["Manage Users", "/admin/users"],
["Manage Companies", "/admin/companies"],
["Manage Jobs", "/admin/jobs"],
["View Logs", "/admin/logs"],
["Settings", "/settings"],
],
guest: [
["Login", "/login"],
["Register", "/register"],
],
};


const menu = lists[role] || lists.guest;


return (
<div className="bg-light" style={{ minHeight: "100vh" }}>
<ul className="nav flex-column p-3">
{menu.map(([label, path]) => (
<li key={path} className="nav-item mb-2">
<Link className="nav-link" to={path}>{label}</Link>
</li>
))}
</ul>
</div>
);
}