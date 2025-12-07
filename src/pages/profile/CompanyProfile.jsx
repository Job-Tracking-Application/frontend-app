import React, { useEffect, useState } from "react";
import { getCompanyProfile } from "../../services/companyService";
import PageHero from "../../components/common/PageHero";
// Re-using UserProfile CSS is fine, but new global styles should persist

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getCompanyProfile();
      setCompany(data);
    }
    loadData();
  }, []);

  if (!company) return <div className="p-5 text-center">Loading company details...</div>;

  return (
    <div>
      <PageHero title="Company Profile" subtitle="Manage your company's public information." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
            <h5 className="fw-bold mb-0">Company Information</h5>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Company Name</label>
                <p className="fw-medium">{company.companyName}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Email</label>
                <p className="fw-medium">{company.email}</p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Website</label>
                <p>
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-decoration-none">
                    {company.website}
                  </a>
                </p>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Address</label>
                <p className="fw-medium">{company.address}</p>
              </div>
              <div className="col-12">
                <label className="form-label text-muted small fw-bold">Description</label>
                <p className="text-secondary">{company.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
