import React, { useEffect, useState } from "react";
import { getMyCompanyProfile, createCompanyProfile, updateCompanyProfile, hasCompanyProfile } from "../../services/companyService";
import PageHero from "../../components/common/PageHero";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import "./RecruiterProfile.css";

const RecruiterProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    city: "",
    contactEmail: "",
    description: ""
  });

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const hasCompany = await hasCompanyProfile();
      
      if (hasCompany.data.data) {
        const response = await getMyCompanyProfile();
        const companyData = response.data.data;
        setCompany(companyData);
        setFormData({
          name: companyData.name || "",
          website: companyData.website || "",
          city: companyData.city || "",
          contactEmail: companyData.contactEmail || "",
          description: companyData.description || ""
        });
      } else {
        setCreating(true);
      }
    } catch (error) {
      console.error("Error loading company data:", error);
      showErrorToast("Failed to load company profile");
      setCreating(true); // Allow creation if loading fails
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (creating) {
        const response = await createCompanyProfile(formData);
        setCompany(response.data.data);
        setCreating(false);
        showSuccessToast("Company profile created successfully");
      } else {
        const response = await updateCompanyProfile(company.id, formData);
        setCompany(response.data.data);
        setEditing(false);
        showSuccessToast("Company profile updated successfully");
      }
    } catch (error) {
      console.error("Error saving company profile:", error);
      showErrorToast(error.response?.data?.message || "Failed to save company profile");
    }
  };

  const handleCancel = () => {
    if (creating) {
      // Reset form for creation
      setFormData({
        name: "",
        website: "",
        city: "",
        contactEmail: "",
        description: ""
      });
    } else {
      // Reset form to original company data
      setFormData({
        name: company.name || "",
        website: company.website || "",
        city: company.city || "",
        contactEmail: company.contactEmail || "",
        description: company.description || ""
      });
      setEditing(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading company details...</div>;
  }

  return (
    <div>
      <PageHero 
        title={creating ? "Create Company Profile" : "Recruiter Profile"} 
        subtitle={creating ? "Set up your company's public information." : "Manage your company's public information."} 
      />

      <div className="container pb-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-building me-2 text-primary"></i>
                Company Information
              </h5>
              {!creating && !editing && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="card-body p-4">
            {(editing || creating) ? (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Input
                      label="Company Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://company.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe your company..."
                    />
                  </div>
                </div>
                
                <div className="d-flex gap-2 mt-4">
                  <Button type="submit" variant="primary">
                    {creating ? "Create Profile" : "Save Changes"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : company ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Company Name</label>
                  <p className="fw-medium">{company.name}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Contact Email</label>
                  <p className="fw-medium">{company.contactEmail || "Not provided"}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Website</label>
                  <p>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" className="text-decoration-none">
                        {company.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">City</label>
                  <p className="fw-medium">{company.city || "Not provided"}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Verification Status</label>
                  <p>
                    <span className={`badge ${company.verified ? "bg-success" : "bg-warning"}`}>
                      {company.verified ? "Verified" : "Pending Verification"}
                    </span>
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Created</label>
                  <p className="fw-medium">
                    {company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "Not available"}
                  </p>
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">Description</label>
                  <p className="text-secondary">{company.description || "No description provided"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">No company profile found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;