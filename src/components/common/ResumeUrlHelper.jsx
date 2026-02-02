import { useState } from "react";

export default function ResumeUrlHelper() {
    const [activeTab, setActiveTab] = useState("google-drive");

    const platforms = {
        "google-drive": {
            name: "Google Drive",
            icon: "bi-google",
            steps: [
                "Upload your resume to Google Drive",
                "Right-click on the file",
                "Select 'Share' from the menu",
                "Click 'Change to anyone with the link'",
                "Copy the link and paste it in the resume URL field"
            ],
            example: "https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing"
        },
        "linkedin": {
            name: "LinkedIn Profile",
            icon: "bi-linkedin",
            steps: [
                "Go to your LinkedIn profile",
                "Click 'Contact info' below your profile picture",
                "Copy your LinkedIn profile URL",
                "Paste it in the resume URL field",
                "Note: Make sure your profile is public"
            ],
            example: "https://www.linkedin.com/in/your-name/"
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h6 className="mb-0">
                    <i className="bi bi-question-circle me-2"></i>
                    How to get your resume URL
                </h6>
            </div>
            <div className="card-body">
                {/* Platform Tabs */}
                <ul className="nav nav-pills nav-fill mb-3">
                    {Object.entries(platforms).map(([key, platform]) => (
                        <li key={key} className="nav-item">
                            <button
                                className={`nav-link ${activeTab === key ? 'active' : ''}`}
                                onClick={() => setActiveTab(key)}
                            >
                                <i className={`${platform.icon} me-1`}></i>
                                {platform.name}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Active Platform Instructions */}
                {Object.entries(platforms).map(([key, platform]) => (
                    activeTab === key && (
                        <div key={key}>
                            <h6 className="text-primary mb-3">
                                <i className={`${platform.icon} me-2`}></i>
                                {platform.name} Instructions
                            </h6>
                            
                            <ol className="mb-3">
                                {platform.steps.map((step, index) => (
                                    <li key={index} className="mb-1">{step}</li>
                                ))}
                            </ol>

                            <div className="alert alert-light">
                                <strong>Example URL:</strong>
                                <br />
                                <code className="text-primary">{platform.example}</code>
                            </div>

                            {key === 'google-drive' && (
                                <div className="alert alert-warning">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    <strong>Important:</strong> Make sure the sharing permission is set to "Anyone with the link can view" for recruiters to access your resume.
                                </div>
                            )}

                            {key === 'linkedin' && (
                                <div className="alert alert-info">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>Note:</strong> LinkedIn profiles work well as resume links, but consider also uploading a traditional PDF resume to Google Drive for a more professional presentation.
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}