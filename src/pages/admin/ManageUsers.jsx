import { useEffect, useState } from "react";
import { getUsers, toggleUserStatus, changeUserRole }
  from "../../services/adminService";
import { useTranslation } from "react-i18next";
import PageHero from "../../components/common/PageHero";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { getRoleName, getRoleOptions } from "../../utils/roleMap";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import UserType from "../../components/common/UserType";

const ManageUsers = () => {
  const { t } = useTranslation();
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
        showErrorToast(t("Failed to load users"));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => (mounted = false);
  }, [t]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showStatusConfirmation = (id, active, username) => {
    const action = active ? t("disable") : t("enable");
    setConfirmModal({
      show: true,
      title: t("Confirm Status Change"),
      message: t("Are you sure you want to {{action}} user '{{username}}'?", { action, username }),
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
        const action = confirmModal.active ? t("disabled") : t("enabled");
        showSuccessToast(t("User {{action}} successfully", { action }));
      }
    } catch (err) {
      console.error("Error updating user:", err);
      showErrorToast(t("Failed to update user status"));
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
      showSuccessToast(t("User role updated successfully"));
      setEditingRoleId(null);
      setSelectedRole(null);
    } catch (err) {
      console.error("Error changing role:", err);
      showErrorToast(t("Failed to update user role"));
    }
  };

  if (loading) return <div className="text-center py-5">{t("Loading...")}</div>;

  return (
    <div>
      <PageHero title={t("Manage Users")} subtitle={t("View and manage system users.")} />

      <div className="container pb-5">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white p-4 border-bottom">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-6">
                <h5 className="fw-bold mb-0">{t("All Users")} ({filteredUsers.length})</h5>
              </div>
              <div className="col-12 col-md-6">
                <input
                  className="form-control"
                  placeholder={t("Search users...")}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="table-responsive-mobile">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-3 py-3">{t("User")}</th>
                    <th className="px-3 py-3">{t("Role")}</th>
                    <th className="px-3 py-3">{t("Status")}</th>
                    <th className="text-end px-3 py-3">{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td className="px-3 py-3">
                        <div>
                          <strong className="d-block">{u.username}</strong>
                          <small className="text-muted">{u.email}</small>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {editingRoleId === u.id ? (
                          <div className="d-flex gap-2">
                            <select
                              className="form-select form-select-sm"
                              value={selectedRole || ""}
                              onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                            >
                              <option value="">{t("Select role")}</option>
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
                              {t("Save")}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => {
                                setEditingRoleId(null);
                                setSelectedRole(null);
                              }}
                            >
                              {t("Cancel")}
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <UserType role={parseInt(u.role)} />
                            <button
                              className="btn btn-sm btn-outline-primary ms-2"
                              onClick={() => {
                                setEditingRoleId(u.id);
                                setSelectedRole(parseInt(u.role));
                              }}
                            >
                              {t("Edit")}
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`badge ${u.active ? "bg-success" : "bg-danger"}`}>
                          {u.active ? t("Active") : t("Disabled")}
                        </span>
                      </td>
                      <td className="text-end px-3 py-3">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => showStatusConfirmation(u.id, u.active, u.username)}
                        >
                          {u.active ? t("Disable") : t("Enable")}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        {searchTerm ? (
                          <>
                            <i className="bi bi-search mb-2 fs-4 d-block"></i>
                            {t("No users match your search criteria")}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-people mb-2 fs-4 d-block"></i>
                            {t("No users found")}
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-card-view">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5 text-muted">
                {searchTerm ? (
                  <>
                    <i className="bi bi-search mb-2 fs-4 d-block"></i>
                    {t("No users match your search criteria")}
                  </>
                ) : (
                  <>
                    <i className="bi bi-people mb-2 fs-4 d-block"></i>
                    {t("No users found")}
                  </>
                )}
              </div>
            ) : (
              <div className="p-3">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="mobile-card-item">
                    <div className="mobile-card-header">
                      <div className="flex-grow-1">
                        <h6 className="mobile-card-title">{u.username}</h6>
                        <div className="mobile-card-details">
                          <div className="text-break-mobile">
                            <i className="bi bi-envelope me-1"></i>
                            {u.email}
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${u.active ? "bg-success" : "bg-danger"} ms-2`}>
                        {u.active ? t("Active") : t("Disabled")}
                      </span>
                    </div>

                    {/* Role Section */}
                    <div className="mt-3">
                      {editingRoleId === u.id ? (
                        <div className="d-flex flex-column gap-2">
                          <select
                            className="form-select form-select-sm"
                            value={selectedRole || ""}
                            onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                          >
                            <option value="">{t("Select role")}</option>
                            {getRoleOptions().map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success flex-grow-1 touch-target"
                              onClick={() => handleChangeRole(u.id)}
                            >
                              <i className="bi bi-check-lg me-1"></i>
                              {t("Save")}
                            </button>
                            <button
                              className="btn btn-sm btn-secondary flex-grow-1 touch-target"
                              onClick={() => {
                                setEditingRoleId(null);
                                setSelectedRole(null);
                              }}
                            >
                              <i className="bi bi-x-lg me-1"></i>
                              {t("Cancel")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded">
                          <span className="text-muted small">{t("Role")}:</span>
                          <div className="d-flex align-items-center gap-2">
                            <UserType role={parseInt(u.role)} />
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setEditingRoleId(u.id);
                                setSelectedRole(parseInt(u.role));
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mobile-card-actions">
                      <button
                        className="btn btn-sm btn-warning btn-mobile-full touch-target"
                        onClick={() => showStatusConfirmation(u.id, u.active, u.username)}
                      >
                        <i className={`bi ${u.active ? 'bi-slash-circle' : 'bi-check-circle'} me-1`}></i>
                        {u.active ? t("Disable") : t("Enable")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ show: false, title: "", message: "", action: null, userId: null })}
        confirmText={t("Yes, Confirm")}
        cancelText={t("Cancel")}
        variant="warning"
      />
    </div>
  );
};

export default ManageUsers;