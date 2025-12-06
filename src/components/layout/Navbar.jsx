import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="p-4 bg-gray-100 flex gap-6">
    <Link to="/applications">My Applications</Link>
    <Link to="/applications/manage">Manage Applications</Link>
    <Link to="/profile/user">User Profile</Link>
    <Link to="/profile/company">Company Profile</Link>
  </nav>
);

export default Navbar;
