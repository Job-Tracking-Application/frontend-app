import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import JobList from "./pages/jobs/JobList";
import JobDetails from "./pages/jobs/JobDetails";
import CreateJob from "./pages/jobs/CreateJob";
import ApplyJob from "./pages/jobs/ApplyJob";

function App() {
  return (
    <Routes>

      <Route path="/" element={<h1 style={{ textAlign: "center", marginTop: "200px" }}>
        Job Tracking Application
      </h1>} />
      <Route path="/" element={<Navigate to="/jobs" />} />

      <Route path="/jobs" element={<JobList />} />
      <Route path="/jobs/:id" element={<JobDetails />} />

      <Route path="/apply/:id" element={<ApplyJob />} />

      <Route path="/create-job" element={<CreateJob />} />
    </Routes>
  );
}

export default App;
