import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4">Loading companies…</div>;

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Manage Companies</h1>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Location</th>
              <th>Jobs Posted</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.location}</td>
                <td>{c.jobs}</td>
                <td>
                  <button className="btn btn-link p-0 me-3">Edit</button>
                  <button className="btn btn-link text-danger p-0">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCompanies;
