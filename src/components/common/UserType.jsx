const UserType = ({ role }) => {
  // Role configuration mapping
  const roleConfig = {
    0: {
      label: 'Admin',
      icon: 'bi-shield-lock',
      bgColor: 'bg-light-purple',
      textColor: 'text-purple',
      borderColor: 'border-purple'
    },
    1: {
      label: 'Recruiter',
      icon: 'bi-building',
      bgColor: 'bg-light-blue',
      textColor: 'text-primary',
      borderColor: 'border-primary'
    },
    2: {
      label: 'Job Seeker',
      icon: 'bi-person-circle',
      bgColor: 'bg-light',
      textColor: 'text-dark',
      borderColor: 'border-secondary'
    }
  };

  // Get role configuration or default to Job Seeker
  const config = roleConfig[role] || roleConfig[2];

  return (
    <>
      <style>{`
        .user-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid;
          white-space: nowrap;
        }

        .bg-light-purple {
          background-color: #f3e8ff;
        }

        .text-purple {
          color: #7c3aed;
        }

        .border-purple {
          border-color: #c4b5fd;
        }

        .bg-light-blue {
          background-color: #dbeafe;
        }

        .border-primary {
          border-color: #93c5fd;
        }

        .bg-light {
          background-color: #f8f9fa;
        }

        .border-secondary {
          border-color: #dee2e6;
        }

        .user-type-badge i {
          font-size: 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .user-type-badge {
            font-size: 0.8125rem;
            padding: 5px 10px;
          }
          
          .user-type-badge i {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <span 
        className={`user-type-badge ${config.bgColor} ${config.textColor} ${config.borderColor}`}
        role="status"
        aria-label={`User role: ${config.label}`}
      >
        <i className={`bi ${config.icon}`}></i>
        <span>{config.label}</span>
      </span>
    </>
  );
};

export default UserType;