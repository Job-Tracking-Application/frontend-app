// services/companyService.js

// import axios from "axios";

// export const getCompanyProfile = async () => {
//   const res = await axios.get("http://localhost:8080/company/profile");
//   return res.data;
// };
// companyService.js

export const getCompanyProfile = async () => {
  return {
    companyName: "TechSoft Innovations Pvt. Ltd.",
    address: "2nd Floor, Cyber Park, Pune, Maharashtra, India",
    email:"techsoft@gmail.com",
    website: "https://techsoft.in",
    description:
      "TechSoft Innovations is a leading provider of enterprise software solutions, specializing in cloud products, AI-driven automation, and scalable web applications."
  };
};


