export const getMyApplications = async () => {
  return [
    {
      id: 1,
      jobTitle: "UI/UX Designer",
      company: "Adobe",
      status: "Selected",
      appliedDate: "24 Feb 2025",
    },
    {
      id: 2,
      jobTitle: "Frontend Developer",
      company: "Google",
      status: "Pending",
      appliedDate: "20 Feb 2025",
    },
  ];
};

export const getApplicationsForJob = async (jobId) => {
  return [
    {
      id: 1,
      name: "Vivek",
      email: "test@mail.com",
      skills: ["React", "Node"],
      status: "Pending",
      resume: "#",
    },
    {
      id: 2,
      name: "Ravi",
      email: "ravi@mail.com",
      skills: ["JavaScript", "Express"],
      status: "Shortlisted",
      resume: "#",
    },
  ];
};

export const updateApplicationStatus = async (id, status) => {
  console.log(`Status Updated: ${id} → ${status}`);
  return true;
};
