export const getUserProfile = async () => {
  return {
    fullName: "Tushar Hardas",
    email: "tushar@mail.com",
    phone: "9876543210",
    userName:"tushar@9011",
    skills: ["React", "Node"],
    resume: null,
    about:"Experienced software developer with 5+ years in full-stack development. Passionate about building scalable web applications and learning new technologies.",
    education:"B.Tech in Computer Science from IIT Delhi",
    company: {
      companyName: "ABC Pvt Ltd",
      address: "Pune",
      website: "https://company.com",
      description: "Tech company",
    }
  };
};

export const updateUserProfile = async (data) => {
  console.log("Profile Updated:", data);
  return true;
};
