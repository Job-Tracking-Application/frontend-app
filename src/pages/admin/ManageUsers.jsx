import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import PageHero from "../../components/common/PageHero";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        const res = await adminService.getUsers();
        if (mounted) setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      <PageHero title="Manage Users" subtitle="View and manage system users." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-0 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">All Users ({filteredUsers.length})</h5>
              <div className="input-group" style={{ maxWidth: '300px' }}>
                <span className="input-group-text bg-light border-0"><i className="bi bi-search text-muted"></i></span>
                <input
                  type="text"
                  className="form-control bg-light border-0 shadow-none"
                  placeholder="Search users..."
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
                  <th className="ps-4 py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>User</th>
                  <th className="py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Role</th>
                  <th className="py-3 text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Status</th>
                  <th className="pe-4 py-3 text-end text-secondary text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="mb-0 fw-bold text-dark">{u.name}</p>
                          <small className="text-muted">{u.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-danger bg-opacity-10 text-danger' :
                        u.role === 'recruiter' ? 'bg-info bg-opacity-10 text-info' :
                          'bg-success bg-opacity-10 text-success'
                        }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-success rounded-pill">Active</span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light border me-2"><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-sm btn-light border text-danger"><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No users found matching "{searchTerm}"
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

export default ManageUsers;
