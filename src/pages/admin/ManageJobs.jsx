import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import PageHero from "../../components/common/PageHero";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      try {
        const res = await adminService.getJobs();
        if (mounted) setJobs(res.data || []);
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchJobs();
    return () => (mounted = false);
  }, []);

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <PageHero title="Manage Jobs" subtitle="Review and moderate job postings." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-0 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Job Postings ({filteredJobs.length})</h5>
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Search jobs..."
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
                  <th className="ps-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Job Title</th>
                  <th className="py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Company</th>
                  <th className="py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Applicants</th>
                  <th className="pe-4 py-3 text-end text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((j) => (
                  <tr key={j.id}>
                    <td className="ps-4 py-3">
                      <p className="mb-0 fw-bold text-dark">{j.title}</p>
                      <small className="text-muted">ID: {j.id}</small>
                    </td>
                    <td>
                      <span className="text-dark fw-medium"><i className="bi bi-building me-1 text-muted"></i>{j.company}</span>
                    </td>
                    <td>
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                        {j.applicants} Applicants
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light border me-2"><i className="bi bi-eye"></i></button>
                      <button className="btn btn-sm btn-light border text-danger"><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No jobs found matching "{searchTerm}"
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

export default ManageJobs;
