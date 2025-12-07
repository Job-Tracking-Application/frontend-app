export const menuItems = {
    jobseeker: [
        { label: "Dashboard", path: "/dashboard", icon: "bi-speedometer2" },
        { label: "Jobs", path: "/jobs", icon: "bi-search" },
        { label: "My Applications", path: "/applications", icon: "bi-file-earmark-text" },
        { label: "Profile", path: "/profile", icon: "bi-person" },
        { label: "Settings", path: "/settings", icon: "bi-gear" },
    ],
    recruiter: [
        { label: "Dashboard", path: "/dashboard", icon: "bi-speedometer2" },
        { label: "Create Job", path: "/jobs/create", icon: "bi-plus-circle" },
        { label: "Manage Applications", path: "/applications/manage", icon: "bi-people" },
        { label: "Profile", path: "/profile", icon: "bi-building" },
        { label: "Settings", path: "/settings", icon: "bi-gear" },
    ],
    admin: [
        { label: "Dashboard", path: "/admin", icon: "bi-speedometer2" },
        { label: "Manage Users", path: "/admin/users", icon: "bi-people" },
        { label: "Manage Companies", path: "/admin/companies", icon: "bi-building" },
        { label: "Manage Jobs", path: "/admin/jobs", icon: "bi-briefcase" },
        { label: "View Logs", path: "/admin/logs", icon: "bi-journal-text" },
        { label: "Settings", path: "/settings", icon: "bi-gear" },
    ],
    guest: [
        { label: "Login", path: "/login", icon: "bi-box-arrow-in-right" },
        { label: "Register", path: "/register", icon: "bi-person-plus" },
    ],
};
