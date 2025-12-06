import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MyApplications from "./pages/applications/MyApplications";
import ManageApplications from "./pages/applications/ManageApplications";

import UserProfile from "./pages/profile/UserProfile";
import CompanyProfile from "./pages/profile/CompanyProfile";

function App() {
  return (
    <Router> 

      <Routes>
        {/* APPLICATION SCREENS */}
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/applications/manage" element={<ManageApplications />} />

        {/* PROFILE SCREENS */}
        <Route path="/profile/user" element={<UserProfile />} />
        <Route path="/profile/company" element={<CompanyProfile />} />

        {/* DEFAULT ROUTE */}
        <Route path="*" element={<MyApplications />} />
      </Routes>
    </Router>
  );
}
export default App;
