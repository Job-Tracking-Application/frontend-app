import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import PageHero from "../../components/common/PageHero";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchCompanies = async () => {
      try {
        const res = await adminService.getCompanies();
        if (mounted) setCompanies(res.data || []);
      } catch (err) {
        console.error("Failed to load companies:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCompanies();
    return () => (mounted = false);
  }, []);

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this company?")) {
      setCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (company) => {
    alert(`Edit feature for ${company.name} coming soon!`);
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHero title="Manage Companies" subtitle="Oversee registered companies and employers." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-0 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Registered Companies ({filteredCompanies.length})</h5>
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Company</th>
                  <th className="py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Location</th>
                  <th className="py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Jobs Posted</th>
                  <th className="pe-4 py-3 text-end text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((c) => (
                  <tr key={c.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-light border rounded-3 d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                          <i className="bi bi-building text-secondary fs-5"></i>
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-dark">{c.name}</p>
                          <small className="text-muted">ID: {c.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10">
                        <i className="bi bi-geo-alt me-1"></i>{c.location}
                      </span>
                    </td>
                    <td>
                      <span className="fw-medium">{c.jobs} Active Jobs</span>
                    </td>
                    <td className="pe-4 text-end">
                      <button onClick={() => handleEdit(c)} className="btn btn-sm btn-light border me-2" title="Edit Company"><i className="bi bi-pencil"></i></button>
                      <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-light border text-danger" title="Delete Company"><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {filteredCompanies.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No companies found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;
