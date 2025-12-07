// src/services/adminService.js (Mocked version for testing)

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const adminService = {
  getDashboardStats: async () => {
    await wait(500);
    return {
      data: {
        totalUsers: 120,
        totalCompanies: 30,
        totalJobs: 85,
        totalApplications: 400,
      }
    };
  },

  getUsers: async () => {
    await wait(400);
    return {
      data: [
        { id: 1, name: "Vivek", email: "vivek@mail.com", role: "Job Seeker" },
        { id: 2, name: "Kiran", email: "kiran@mail.com", role: "Recruiter" }
      ]
    };
  },

  getCompanies: async () => {
    await wait(400);
    return {
      data: [
        { id: 1, name: "Google", location: "Pune", jobs: 12 },
        { id: 2, name: "Infosys", location: "Bangalore", jobs: 8 }
      ]
    };
  },

  getJobs: async () => {
    await wait(400);
    return {
      data: [
        { id: 1, title: "Frontend Dev", company: "Google", applicants: 45 },
        { id: 2, title: "Backend Dev", company: "Infosys", applicants: 30 }
      ]
    };
  },

  getLogs: async () => {
    await wait(400);
    return {
      data: [
        { id: 1, action: "User Login", date: "2025-02-20" },
        { id: 2, action: "Company Update", date: "2025-02-19" }
      ]
    };
  }
};

export default adminService;
