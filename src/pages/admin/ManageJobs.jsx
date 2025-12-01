import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-4">Loading jobs…</div>;

  return (
    <div className="p-4">
      <h1 className="h3 mb-4">Manage Jobs</h1>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Company</th>
              <th>Applicants</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>{j.id}</td>
                <td>{j.title}</td>
                <td>{j.company}</td>
                <td>{j.applicants}</td>
                <td>
                  <button className="btn btn-link p-0 me-3">View</button>
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

export default ManageJobs;
