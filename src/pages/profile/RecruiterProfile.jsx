import React, { useEffect, useState } from "react";
import { getMyCompanyProfile, createCompanyProfile, updateCompanyProfile, hasCompanyProfile } from "../../services/companyService";
import { getRecruiterProfile, updateRecruiterProfile } from "../../services/recruiterProfileService";
import PageHero from "../../components/common/PageHero";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import "./RecruiterProfile.css";

const RecruiterProfile = () => {
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [creatingCompany, setCreatingCompany] = useState(false);
  
  const [personalFormData, setPersonalFormData] = useState({
    fullName: "",
    bio: "",
    phone: "",
    linkedinUrl: "",
    yearsExperience: "",
    specialization: ""
  });
  
  const [companyFormData, setCompanyFormData] = useState({
    name: "",
    website: "",
    city: "",
    contactEmail: "",
    description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load recruiter profile
      const recruiterResponse = await getRecruiterProfile();
      const recruiterData = recruiterResponse; // The service already returns response.data
      
      // Add null checking for recruiterData
      if (recruiterData) {
        setRecruiterProfile(recruiterData);
        setPersonalFormData({
          fullName: recruiterData.fullName || "",
          bio: recruiterData.bio || "",
          phone: recruiterData.phone || "",
          linkedinUrl: recruiterData.linkedinUrl || "",
          yearsExperience: recruiterData.yearsExperience || "",
          specialization: recruiterData.specialization || ""
        });
      } else {
        // Handle case where no recruiter profile exists
        setRecruiterProfile(null);
        setPersonalFormData({
          fullName: "",
          bio: "",
          phone: "",
          linkedinUrl: "",
          yearsExperience: "",
          specialization: ""
        });
      }

      // Load company profile
      const hasCompany = await hasCompanyProfile();
      
      if (hasCompany.data.data) {
        const response = await getMyCompanyProfile();
        const companyData = response.data.data; // This is correct for company service
        setCompany(companyData);
        setCompanyFormData({
          name: companyData.name || "",
          website: companyData.website || "",
          city: companyData.city || "",
          contactEmail: companyData.contactEmail || "",
          description: companyData.description || ""
        });
      } else {
        setCreatingCompany(true);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showErrorToast("Failed to load profile data");
      setCreatingCompany(true); // Allow creation if loading fails
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateRecruiterProfile(personalFormData);
      
      // Now the response should be the updated profile object
      if (response && typeof response === 'object' && response.fullName) {
        setRecruiterProfile(response);
        // Update the form data with the fresh data from server
        setPersonalFormData({
          fullName: response.fullName || "",
          bio: response.bio || "",
          phone: response.phone || "",
          linkedinUrl: response.linkedinUrl || "",
          yearsExperience: response.yearsExperience || "",
          specialization: response.specialization || ""
        });
      }
      
      setEditingPersonal(false);
      showSuccessToast("Personal profile updated successfully");
    } catch (error) {
      console.error("Error updating personal profile:", error);
      showErrorToast(error.response?.data?.message || "Failed to update personal profile");
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      if (creatingCompany) {
        const response = await createCompanyProfile(companyFormData);
        setCompany(response.data.data); // Company service returns full axios response
        setCreatingCompany(false);
        showSuccessToast("Company profile created successfully");
      } else {
        const response = await updateCompanyProfile(company.id, companyFormData);
        setCompany(response.data.data); // Company service returns full axios response
        setEditingCompany(false);
        showSuccessToast("Company profile updated successfully");
      }
    } catch (error) {
      console.error("Error saving company profile:", error);
      showErrorToast(error.response?.data?.message || "Failed to save company profile");
    }
  };

  const handlePersonalCancel = () => {
    setPersonalFormData({
      fullName: recruiterProfile.fullName || "",
      bio: recruiterProfile.bio || "",
      phone: recruiterProfile.phone || "",
      linkedinUrl: recruiterProfile.linkedinUrl || "",
      yearsExperience: recruiterProfile.yearsExperience || "",
      specialization: recruiterProfile.specialization || ""
    });
    setEditingPersonal(false);
  };

  const handleCompanyCancel = () => {
    if (creatingCompany) {
      // Reset form for creation
      setCompanyFormData({
        name: "",
        website: "",
        city: "",
        contactEmail: "",
        description: ""
      });
    } else {
      // Reset form to original company data
      setCompanyFormData({
        name: company.name || "",
        website: company.website || "",
        city: company.city || "",
        contactEmail: company.contactEmail || "",
        description: company.description || ""
      });
      setEditingCompany(false);
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading company details...</div>;
  }

  return (
    <div>
      <PageHero 
        title="Recruiter Profile" 
        subtitle="Manage your personal and company information." 
      />

      <div className="container pb-5">
        {/* Personal Profile Section */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-person me-2 text-primary"></i>
                Personal Information
              </h5>
              {!editingPersonal && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditingPersonal(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="card-body p-4">
            {editingPersonal ? (
              <form onSubmit={handlePersonalSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Input
                      label="Full Name *"
                      name="fullName"
                      value={personalFormData.fullName}
                      onChange={handlePersonalInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Phone"
                      name="phone"
                      value={personalFormData.phone}
                      onChange={handlePersonalInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="LinkedIn URL"
                      name="linkedinUrl"
                      value={personalFormData.linkedinUrl}
                      onChange={handlePersonalInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Years of Experience"
                      name="yearsExperience"
                      type="number"
                      value={personalFormData.yearsExperience}
                      onChange={handlePersonalInputChange}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Specialization"
                      name="specialization"
                      value={personalFormData.specialization}
                      onChange={handlePersonalInputChange}
                      placeholder="e.g., Technical Recruiting, HR"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      name="bio"
                      value={personalFormData.bio}
                      onChange={handlePersonalInputChange}
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
                
                <div className="d-flex gap-2 mt-4">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                  <Button type="button" variant="secondary" onClick={handlePersonalCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : recruiterProfile ? (
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Full Name</label>
                  <p className="fw-medium">{recruiterProfile.fullName || "Not provided"}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Phone</label>
                  <p className="fw-medium">{recruiterProfile.phone || "Not provided"}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">LinkedIn</label>
                  <p>
                    {recruiterProfile.linkedinUrl ? (
                      <a href={recruiterProfile.linkedinUrl} target="_blank" rel="noreferrer" className="text-decoration-none">
                        View Profile
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Experience</label>
                  <p className="fw-medium">{recruiterProfile.yearsExperience ? `${recruiterProfile.yearsExperience} years` : "Not provided"}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Specialization</label>
                  <p className="fw-medium">{recruiterProfile.specialization || "Not provided"}</p>
                </div>
                <div className="col-12">
                  <label className="form-label text-muted small fw-bold">Bio</label>
                  <p className="text-secondary">{recruiterProfile.bio || "No bio provided"}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">Loading personal profile...</p>
              </div>
            )}
          </div>
        </div>

        {/* Company Profile Section */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">
                <i className="bi bi-building me-2 text-primary"></i>
                Company Information
              </h5>
              {!creatingCompany && !editingCompany && company && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditingCompany(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="card-body p-4">
            {(editingCompany || creatingCompany) ? (
              <form onSubmit={handleCompanySubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <Input
                      label="Company Name *"
                      name="name"
                      value={companyFormData.name}
                      onChange={handleCompanyInputChange}
                      required
                      placeholder="Enter company name"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      value={companyFormData.contactEmail}
                      onChange={handleCompanyInputChange}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Website"
                      name="website"
                      value={companyFormData.website}
                      onChange={handleCompanyInputChange}
                      placeholder="https://company.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="City"
                      name="city"
                      value={companyFormData.city}
                      onChange={handleCompanyInputChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={companyFormData.description}
                      onChange={handleCompanyInputChange}
                      rows="4"
                      placeholder="Describe your company..."
                    />
                  </div>
                </div>
                
                <div className="d-flex gap-2 mt-4">
                  <Button type="submit" variant="primary">
                    {creatingCompany ? "Create Profile" : "Save Changes"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleCompanyCancel}>
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
                <p className="text-muted mb-3">No company profile found</p>
                <Button
                  variant="primary"
                  onClick={() => setCreatingCompany(true)}
                >
                  <i className="bi bi-plus me-2"></i>
                  Create Company Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;