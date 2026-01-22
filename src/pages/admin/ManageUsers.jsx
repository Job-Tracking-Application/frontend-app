import React, { useEffect, useState } from "react";
import { getUsers, toggleUserStatus, changeUserRole }
  from "../../services/adminService";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { getRoleName, getRoleOptions } from "../../utils/roleMap";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    action: null,
    userId: null
  });

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        if (mounted) setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        showErrorToast("Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => (mounted = false);
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showStatusConfirmation = (id, active) => {
    setConfirmModal({
      show: true,
      title: "Confirm Status Change",
      message: `Are you sure you want to ${active ? "disable" : "enable"} this user?`,
      action: "toggle-status",
      userId: id,
      active: active
    });
  };

  const handleConfirm = async () => {
    try {
      if (confirmModal.action === "toggle-status") {
        await toggleUserStatus(confirmModal.userId, !confirmModal.active);
        setUsers(prev =>
          prev.map(u =>
            u.id === confirmModal.userId
              ? { ...u, active: !confirmModal.active }
              : u
          )
        );
        showSuccessToast(`User ${confirmModal.active ? "disabled" : "enabled"} successfully`);
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showErrorToast("Failed to update user status");
    }
    setConfirmModal({ show: false, title: "", message: "", action: null, userId: null });
  };

  const handleChangeRole = async (id) => {
    if (selectedRole === null) return;
    try {
      await changeUserRole(id, selectedRole);
      setUsers(prev =>
        prev.map(u => (u.id === id ? { ...u, role: selectedRole.toString() } : u))
      );
      showSuccessToast("User role updated successfully");
      setEditingRoleId(null);
      setSelectedRole(null);
    } catch (err) {
      console.error("Error changing role:", err);
      showErrorToast("Failed to update user role");
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div>
      <PageHero title="Manage Users" subtitle="View and manage system users." />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="d-flex justify-content-between">
              <h5 className="fw-bold mb-0">All Users ({filteredUsers.length})</h5>
              <input
                className="form-control w-25"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.username}</strong>
                    <br />
                    <small>{u.email}</small>
                  </td>
                  <td>
                    {editingRoleId === u.id ? (
                      <div className="d-flex gap-2">
                        <select
                          className="form-select form-select-sm"
                          value={selectedRole || ""}
                          onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                        >
                          <option value="">Select role</option>
                          {getRoleOptions().map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleChangeRole(u.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setEditingRoleId(null);
                            setSelectedRole(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{getRoleName(parseInt(u.role))}</span>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setEditingRoleId(u.id);
                            setSelectedRole(parseInt(u.role));
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${u.active ? "bg-success" : "bg-danger"}`}>
                      {u.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => showStatusConfirmation(u.id, u.active)}
                    >
                      {u.active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ show: false, title: "", message: "", action: null, userId: null })}
        confirmText="Yes, Confirm"
        cancelText="Cancel"
        variant="warning"
      />
    </div>
  );
};

export default ManageUsers;