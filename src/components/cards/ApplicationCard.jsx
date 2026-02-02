import React from "react";

const ApplicationCard = ({ app }) => {
  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">{app.jobTitle}</h3>
      <p className="text-gray-600">{app.company}</p>

      <div className="mt-2 flex justify-between">
        <span
          className={`px-2 py-1 rounded text-sm ${
            app.status === "Selected"
              ? "bg-green-100 text-green-700"
              : app.status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {app.status}
        </span>

        <span className="text-gray-500 text-sm">{app.appliedDate}</span>
      </div>
    </div>
  );
};

export default ApplicationCard;
