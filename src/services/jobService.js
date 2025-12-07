export const dummyJobs = [
    {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Corp",
        location: "Remote",
        type: "Full-time",
        salary: "₹8,00,000 - ₹12,00,000",
        description: "We are looking for a skilled React developer..."
    },
    {
        id: 2,
        title: "Backend Engineer",
        company: "Data Systems",
        location: "New York, NY",
        type: "Full-time",
        salary: "₹9L - ₹13L",
        description: "Experience with Node.js and MongoDB required."
    },
    {
        id: 3,
        title: "UI/UX Designer",
        company: "Creative Studio",
        location: "San Francisco, CA",
        type: "Contract",
        salary: "₹800/hr",
        description: "Design beautiful interfaces for mobile apps."
    }
];

export const getJobs = () => {
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(dummyJobs), 500));
};

export const getJobById = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const job = dummyJobs.find(j => j.id === parseInt(id));
            resolve(job);
        }, 500);
    });
};

export const addJob = (job) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newJob = { ...job, id: dummyJobs.length + 1 };
            dummyJobs.push(newJob);
            resolve(newJob);
        }, 500);
    });
};
