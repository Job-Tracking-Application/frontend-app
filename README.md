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

This project is for educational purposes.
