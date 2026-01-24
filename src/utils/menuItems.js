export const menuItems = {
    JOB_SEEKER: [
        { label: "nav_dashboard", path: "/dashboard", icon: "bi-speedometer2" },
        { label: "nav_jobs", path: "/jobs", icon: "bi-search" },
        { label: "nav_applications", path: "/applications", icon: "bi-file-earmark-text" },
        { label: "nav_profile", path: "/profile", icon: "bi-person" },
        { label: "nav_settings", path: "/settings", icon: "bi-gear" },
    ],
    RECRUITER: [
        { label: "nav_dashboard", path: "/dashboard", icon: "bi-speedometer2" },
        { label: "nav_my_jobs", path: "/jobs/my-jobs", icon: "bi-briefcase" },
        { label: "nav_create_job", path: "/jobs/create", icon: "bi-plus-circle" },
        { label: "nav_manage_apps", path: "/applications/manage", icon: "bi-people" },
        { label: "nav_profile", path: "/profile", icon: "bi-building" },
        { label: "nav_settings", path: "/settings", icon: "bi-gear" },
    ],
    ADMIN: [
        { label: "nav_dashboard", path: "/dashboard/admin", icon: "bi-speedometer2" },
        { label: "nav_manage_users", path: "/admin/users", icon: "bi-people" },
        { label: "nav_manage_companies", path: "/admin/companies", icon: "bi-building" },
        { label: "nav_manage_jobs", path: "/admin/jobs", icon: "bi-briefcase" },
        { label: "nav_manage_applications", path: "/admin/applications", icon: "bi-file-earmark-text" },
        { label: "nav_view_logs", path: "/admin/logs", icon: "bi-journal-text" },
        { label: "nav_settings", path: "/settings", icon: "bi-gear" },
    ],
    guest: [
        { label: "nav_login", path: "/login", icon: "bi-box-arrow-in-right" },
        { label: "nav_register", path: "/register", icon: "bi-person-plus" },
    ],
};
