export const ROLE_MAP = {
    1: "Admin",
    2: "Recruiter",
    3: "Job Seeker"
};

export const getRoleName = (roleId) => {
    return ROLE_MAP[roleId] || "Unknown";
};

export const getRoleOptions = () => {
    return [
        { value: 1, label: "Admin" },
        { value: 2, label: "Recruiter" },
        { value: 3, label: "Job Seeker" }
    ];
};
