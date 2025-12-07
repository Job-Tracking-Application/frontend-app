import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="bg-dark text-white vh-100 p-3">
      <h2 className="h5 mb-3">Admin Panel</h2>

      <ul className="nav flex-column gap-2">
        <li className="nav-item"><Link className="nav-link text-white p-0" to="/admin">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link text-white p-0" to="/admin/users">Manage Users</Link></li>
        <li className="nav-item"><Link className="nav-link text-white p-0" to="/admin/companies">Manage Companies</Link></li>
        <li className="nav-item"><Link className="nav-link text-white p-0" to="/admin/jobs">Manage Jobs</Link></li>
        <li className="nav-item"><Link className="nav-link text-white p-0" to="/admin/logs">System Logs</Link></li>
        <li className="nav-item"><Link className="nav-link text-white p-0" to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;