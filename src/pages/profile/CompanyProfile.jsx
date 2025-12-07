import React, { useEffect, useState } from "react";
import { getCompanyProfile } from "../../services/companyService";
import "./UserProfile.css";

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCompanyProfile();
      setCompany(data);
    }
    loadData();
  }, []);

  if (!company) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="profile-page container my-4">

      <h1>Company Profile</h1>

      <div className="card profile-card">
        <h6 className="card-title">Company Information</h6>

        <div className="mb-3">
          <label className="field-label">Company Name</label>
          <div className="soft-box">{company.companyName}</div>
        </div>

        <div className="mb-3">
          <label className="field-label">Email</label>
          <div className="soft-box">{company.email}</div>
        </div>

        <div className="mb-3">
          <label className="field-label">Website</label>
          <div className="soft-box">
            <a href={company.website} target="_blank" rel="noreferrer">
              {company.website}
            </a>
          </div>
        </div>

        <div className="mb-3">
          <label className="field-label">Address</label>
          <div className="soft-box">{company.address}</div>
        </div>

        <div>
          <label className="field-label">Description</label>
          <div className="soft-box">{company.description}</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
