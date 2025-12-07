# 🚀 **Job Tracking Application — Frontend (React)**

This is the **React-based frontend** for the **Job Tracking Application**, designed for Job Seekers, Recruiters, and Admin users.
The UI is built according to the Figma design and supports **English + Marathi**, role-based pages, modular components, and a scalable architecture.

---

# ✅ **Tech Stack**

* **React + Vite**
* **React Router**
* **Axios (API calls)**
* **Context API (Auth & Language)**
* **i18n (English + Marathi)**
* **Bootstrap / Custom CSS**
* **Reusable Components Architecture**

---

# ⚙️ **Getting Started**

## 1️⃣ Install dependencies

```bash
npm install
```

## 2️⃣ Start development server

```bash
npm run dev
```

## 3️⃣ Build production bundle

```bash
npm run build
```

## 4️⃣ Preview production build

```bash
npm run preview
```

## 5️⃣ Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_ENV=development
```

---

# 📁 **Folder Structure**

```bash
src/
│
├── assets/            # Images, icons, global styles
│
├── components/        # Reusable UI components
│   ├── common/        # Buttons, inputs, modals, loaders, etc.
│   ├── layout/        # Navbar, Sidebar, Dashboard layout
│   └── cards/         # JobCard, ApplicationCard, CompanyCard
│
├── pages/             # Page-level components (screen views)
│   ├── auth/          # Login, Register
│   ├── dashboard/     # Job Seeker / Recruiter dashboards
│   ├── jobs/          # Job list, details, create job
│   ├── applications/  # Apply, manage applications
│   ├── profile/       # User / company profile
│   ├── admin/         # Admin panel pages
│   └── settings/      # Language settings, preferences
│
├── services/          # All API request functions
│   ├── api.js         # axios setup
│   ├── authService.js
│   ├── jobService.js
│   ├── userService.js
│   └── applicationService.js
│
├── context/           # Global state management
│   ├── AuthContext.jsx
│   └── LanguageContext.js
│
├── hooks/             # Custom hooks (useAuth, useFetch, etc.)
│
├── routes/            # App routing (Protected, Role-based)
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
│
├── i18n/              # Multi-language support
│   ├── en.json
│   └── mr.json
│
├── utils/             # Helper functions, constants
│   ├── helpers.js
│   └── validators.js
│
├── App.jsx            # Root app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

---

# 🔐 **Authentication Flow**

The frontend is fully role-based:

* **Job Seeker**
* **Recruiter**
* **Admin**

Authentication is handled using:

* `AuthContext.jsx`
* JWT stored in **localStorage**
* Protected routes using `ProtectedRoute`

Example:

```jsx
<Route
  path="/dashboard"
  element={<ProtectedRoute><JobSeekerDashboard /></ProtectedRoute>}
/>
```

---

# 🌐 **API Integration**

All API calls are grouped inside `/src/services/`.

Example:

```js
// jobService.js
import api from "./api";

export const getJobs = () => api.get("/jobs");
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post("/jobs", data);
```

Central Axios Configuration:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

---

# 🌍 **Multi-Language Support (EN + MR)**

Located in:

```
src/i18n/en.json
src/i18n/mr.json
```

Language selection stored in:

```
LanguageContext.jsx
```

Usage example:

```jsx
const { t } = useLanguage();
<p>{t("login.welcome")}</p>
```

---

# 🎨 **UI Guidelines (Based on Figma)**

* Consistent card designs for jobs & applications
* Sidebar + Navbar layout for Dashboard
* Simple theme: white, blue, and grey
* Clean form components (Input, Select, Button)
* Performance optimized (lazy-loaded pages)

---

# 🧪 **Testing (optional future integration)**

You may add:

* Jest
* React Testing Library

---

# 🧩 **How to Contribute (Team Guidelines)**

1. Create a feature branch

   ```
   git checkout -b feature/<name>
   ```
2. Write clean, modular code
3. Follow folder structure strictly
4. Make meaningful commit messages
5. Push & create PR

   ```
   git push origin feature/<name>
   ```

Example Commit Messages:

* `feat(auth): add login page`
* `fix(job-list): improve search filter`
* `refactor(components): move card to separate folder`

---

# 🔮 **Future Enhancements**

✔ Dark mode
✔ Resume builder
✔ Notification system
✔ Chat between recruiter & applicant
✔ Email/SMS alerts

---

# 🙌 **Team Notes**

This project includes:

* Role-based UI
* Summary & matrix report support
* Log tracking (frontend + backend)
* Figma-based responsive design
* Fully modular architecture

