# 💼 **JobSync — Your Career Partner**

**JobSync** is a modern, responsive, and feature-rich Job Tracking Application designed to connect Job Seekers, Recruiters, and Administrators. 
Built with **React 19**, it offers a premium user experience with role-based dashboards, multi-language support (English & Marathi), and comprehensive job management tools.

---

## ✨ **Key Features**

### 🔹 **Core Functionality**
*   **Role-Based Access**: Specialized dashboards for **Job Seekers**, **Recruiters**, and **Admins**.
*   **Smart Dashboards**: Personalized recommendations, recent activity tracking, and dynamic stats.
*   **Job Management**: Create, edit, view, and apply for jobs with detailed descriptions and salary ranges (₹).
*   **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile with a smart **Toggleable Sidebar**.

### 🔹 **Premium Features**
*   **Admin Portal**: A "Premium" redesign with card-based tables, search filters, badges, and timeline logs.
*   **Localization 🇮🇳**: Full support for **Marathi (मराठी)** translation and **Indian Currency (₹)** formatting.
*   **Demo Profiles**: One-click mock login for Admin (`admin@...`), Recruiter (`recruiter@...`), and User.
*   **System Logs**: Visual audit trails for all system activities.

---

## 🛠️ **Tech Stack**

*   **Frontend**: React 19, Vite
*   **Styling**: Bootstrap 5, Bootstrap Icons, Custom CSS
*   **State Management**: React Context API (Auth & Language)
*   **Routing**: React Router v6 (Future Flags Enabled)
*   **HTTP Client**: Axios (Modular Service Layer)
*   **Internationalization**: Custom i18n implementation

---

## 🚀 **Getting Started**

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Run Development Server
```bash
npm run dev
```

### 3️⃣ Build for Production
```bash
npm run build
```

---

## 🔐 **Demo Credentials**

To test different roles without registration, simply use the following email patterns (password can be anything):

| Role | Email Pattern | Access |
| :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | Manage Users, Companies, Jobs, Logs |
| **Recruiter** | `recruiter@demo.com` | Post Jobs, View Applicants |
| **Job Seeker** | `user@demo.com` | Apply for Jobs, Recommendations |

*(Note: Any email containing "admin" becomes Admin, "recruiter" becomes Recruiter, else Job Seeker)*

---

## 📁 **Project Structure**

```
src/
├── assets/            # Static assets (images, fonts)
├── components/        # Reusable UI components
│   ├── cards/         # JobCard, ApplicationCard, etc.
│   ├── common/        # Buttons, PageHero, Loaders
│   └── layout/        # Navbar, Sidebar, Layout wrappers
├── context/           # Global State (Auth, Language)
├── hooks/             # Custom hooks (useAuth, etc.)
├── i18n/              # Translation files (en.json, mr.json)
├── pages/             # Route Components
│   ├── admin/         # Admin Panel (Manage Users, Jobs, Logs)
│   ├── applications/  # My Applications, Manage Apps
│   ├── auth/          # Login, Register
│   ├── dashboard/     # Role-specific Dashboards
│   ├── jobs/          # Job Listings, Create Job, Details
│   └── profile/       # User/Company Profiles
├── services/          # API Service Layer
├── routes/            # Route Definitions & Protection Logic
└── main.jsx           # Entry Point
```

---

## 🌍 **Localization (i18n)**

Switch languages easily using the toggle in the top-right corner.
*   **EN**: English (Default)
*   **FMR**: Marathi

Currency is localized to **Rupees (₹)** with Lakhs formatting (e.g., `₹5L`).

---

## 📝 **License**


---

## 📂 **Detailed File Documentation**

### **Contexts (`/src/context`)**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `AuthContext.jsx` | Manages global authentication state, storing current user and login/logout methods. | `useState`, `useContext`, `createContext` |
| `LanguageContext.jsx` | Manages global language state (switches between English/Marathi) and provides translation helper `t()`. | `useState`, `useContext`, `createContext` |

### **Custom Hooks**
*(Note: Custom hooks are currently exported directly from their respective Context files)*
| Hook | Source | Purpose |
| :--- | :--- | :--- |
| `useAuth` | `AuthContext.jsx` | Provides access to `user` object, `login()`, `logout()`, and `isAuthenticated` flag. |
| `useLanguage` | `LanguageContext.jsx` | Provides access to `lang` (current language), `setLang`, and `t` (translate function). |

### **Pages (`/src/pages`)**
#### **Auth**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `Login.jsx` | Handles user login with email/password and redirects based on role. | `useState`, `useAuth`, `useNavigate` |
| `Register.jsx` | Handles new user registration (job seeker/recruiter). | `useState`, `useNavigate` |

#### **Dashboard**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `JobSeekerDashboard.jsx` | Main view for candidates; shows recommended & applied jobs. | `useState`, `useEffect`, `useLanguage` |
| `RecruiterDashboard.jsx` | Main view for recruiters; shows posted jobs and applicant stats. | `useState`, `useEffect`, `useLanguage` |
| `AdminDashboard.jsx` | Overview for admins; statistics on users, jobs, and system health. | `useState`, `useEffect` |

#### **Jobs**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `JobList.jsx` | Displays all available jobs with Search and Category filters. | `useState`, `useEffect`, `useLanguage` |
| `JobDetails.jsx` | Shows full details of a specific job and allows applying. | `useState`, `useEffect`, `useParams`, `useNavigate` |
| `CreateJob.jsx` | Form for recruiters to post a new job opening. | `useState`, `useNavigate` |

#### **Profile**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `UserProfile.jsx` | View and edit user personal details, skills, and resume. | `useState`, `useEffect` |
| `CompanyProfile.jsx` | View and edit company details (for recruiters). | `useState`, `useEffect` |

#### **Admin**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `ManageUsers.jsx` | Admin table to view, edit, or delete registered users. | `useState`, `useEffect` |
| `ManageJobs.jsx` | Admin view to moderate job postings. | `useState`, `useEffect` |
| `ViewLogs.jsx` | visual audit log of system activities. | `useState`, `useEffect` |

### **Components (`/src/components`)**
#### **Layout**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `Navbar.jsx` | Top header with Logo, Language Toggle, and User Profile menu. | `useAuth`, `useLanguage`, `useNavigate` |
| `Sidebar.jsx` | Vertical navigation menu responsive to user role. | `useAuth`, `useLocation` |
| `Layout.jsx` | Wrapper component that applies the standard page structure (Sidebar + Content). | `None` |
| `ProtectedRoute.jsx` | Guard component; redirects unauthenticated users to Login. | `useAuth`, `useNavigate` |
| `RoleRoute.jsx` | Guard component; restricts access based on user role (e.g., Admin only). | `useAuth`, `useNavigate` |

#### **Common**
| File | Purpose | Hooks Used |
| :--- | :--- | :--- |
| `Button.jsx`, `Input.jsx` | Reusable UI elements for consistent styling. | `None` |
| `PageHero.jsx` | Standard page header with title and breadcrumbs. | `None` |
| `Loader.jsx` | Loading spinner/skeleton state. | `None` |

### **Services (`/src/services`)**
*(API Layer - mocked for now)*
| File | Purpose |
| :--- | :--- |
| `api.js` | Axios instance configuration (base URL, interceptors). |
| `authService.js` | Authentication API calls (Login/Register). |
| `jobService.js` | Operations for fetching, creating, and managing jobs. |
| `userService.js` | Operations for user profile data. |
| `adminService.js` | Admin-specific operations (User management, Logs). |

### **Utils (`/src/utils`)**
| File | Purpose |
| :--- | :--- |
| `validators.js` | Form validation helper functions (email, password strength). |
| `helpers.js` | General utility functions (date formatting, currency). |
| `constants.js` | App-wide constants (Roles, Job Types). |
