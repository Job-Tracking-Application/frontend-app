# Job Tracking Frontend Application

A modern React-based web application for job tracking with role-based dashboards, job management, and application tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn (for frontend development)
- Spring Boot backend API running (typically on `http://localhost:8080`)
- Modern web browser

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   ```bash
   # .env file
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=JobSync
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8080` (Spring Boot)
   - Login with demo accounts or register new users

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React 19 with Vite 7
- **Backend**: Spring Boot (Java) - REST API
- **Routing**: React Router v6
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Internationalization**: i18next, react-i18next
- **Notifications**: React Toastify
- **Build Tool**: Vite
- **Package Manager**: npm/yarn

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   ├── cards/           # Card components (JobCard, ApplicationCard)
│   └── layout/          # Layout components (Header, Sidebar)
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Role-based dashboards
│   ├── jobs/           # Job management pages
│   ├── applications/   # Application management pages
│   ├── profile/        # User profile pages
│   ├── admin/          # Admin management pages
│   └── settings/       # Settings pages
├── services/           # API service functions
├── context/            # React Context providers
├── routes/             # Route configuration and protection
├── utils/              # Utility functions and helpers
├── i18n/               # Internationalization files
└── assets/             # Static assets (images, styles)
```

## 🔐 Authentication & Authorization

### User Roles
- **Job Seeker**: Search jobs, apply, manage applications
- **Recruiter**: Post jobs, manage applications, view candidates
- **Admin**: Full system management and analytics

### Authentication Flow
1. User registers/logs in
2. JWT token stored in localStorage
3. Token included in API requests
4. Role-based route protection
5. Automatic logout on token expiration

### Protected Routes
```jsx
// Role-based route protection
<Route element={<RoleRoute allowedRoles={["JOB_SEEKER"]} />}>
  <Route path="/applications" element={<MyApplications />} />
</Route>

<Route element={<RoleRoute allowedRoles={["RECRUITER"]} />}>
  <Route path="/jobs/create" element={<CreateJob />} />
</Route>

<Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
  <Route path="/admin/*" element={<AdminRoutes />} />
</Route>
```

## 📱 User Interface

### Authentication Pages

#### Registration (`/register`)
- **Fields**: Full Name, Username, Email, Phone, Password, Role
- **Validation**: Real-time form validation
- **Roles**: Job Seeker, Recruiter (Admin registration disabled for security)
- **Features**: 
  - Username uniqueness validation
  - Phone number format validation
  - Password strength requirements
  - Role-based registration

#### Login (`/login`)
- **Fields**: Email, Password
- **Features**: Remember me, error handling
- **Redirects**: Role-based dashboard redirection

#### Admin Login (`/admin/login`)
- **Separate secure login** for administrators
- **Enhanced security**: Hidden from regular users
- **Direct access**: Must know URL to access

### Dashboard Pages

#### Job Seeker Dashboard (`/dashboard/jobseeker`)
```jsx
// Features
- Profile completion progress
- Recent job recommendations
- Application status overview
- Quick actions (search jobs, update profile)
```

#### Recruiter Dashboard (`/dashboard/recruiter`)
```jsx
// Features
- Posted jobs statistics
- Recent applications
- Candidate pipeline overview
- Quick actions (post job, review applications)
```

#### Admin Dashboard (`/dashboard/admin`)
```jsx
// Features
- System-wide statistics
- User management overview
- Platform analytics
- System health monitoring
```

### Job Management

#### Job List (`/jobs`)
```jsx
// Features
- Search and filter jobs
- Pagination
- Sort by date, salary, relevance
- Job cards with key information
- Apply button for job seekers
```

#### Job Details (`/jobs/:id`)
```jsx
// Features
- Complete job description
- Company information
- Requirements and qualifications
- Apply functionality
- Share job option
```

#### Create Job (`/jobs/create`) - Recruiter Only
```jsx
// Form Fields
- Job title and description
- Salary range
- Location and job type
- Required skills
- Company selection
- Application deadline
```

### Application Management

#### My Applications (`/applications`) - Job Seeker
```jsx
// Features
- Application status tracking
- Applied jobs list
- Application timeline
- Withdraw application option
- Status filters (Applied, Shortlisted, Rejected)
```

#### Manage Applications (`/applications/manage`) - Recruiter
```jsx
// Features
- Candidate applications list
- Status update functionality
- Candidate profile preview
- Bulk actions
- Application filters and search
```

### Profile Management

#### Job Seeker Profile (`/profile`)
```jsx
// Sections
- Basic Information (Name, Email, Username, Phone)
- About Me
- Education (Degree, College, Year)
- Skills
- Resume Upload
- Profile Completion Progress
```

#### Recruiter Profile (`/profile`)
```jsx
// Sections
- Basic Information
- Professional Bio
- Company Information
- LinkedIn Profile
- Years of Experience
- Specialization
```

## 🌐 API Integration

### Backend Architecture
This React frontend connects to a **Spring Boot backend** that provides:
- RESTful API endpoints
- JWT-based authentication
- Role-based authorization
- Database integration (MySQL/PostgreSQL)
- File upload handling
- Email notifications

### Service Architecture
```javascript
// services/api.js - Base API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Spring Boot API URL
  timeout: 10000,
});

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Authentication Service
```javascript
// services/authService.js - Connects to Spring Boot auth endpoints
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // JWT token from Spring Boot
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data; // User profile from Spring Boot
};
```

### Job Service
```javascript
// services/jobService.js - Connects to Spring Boot job endpoints
export const getJobs = async (params) => {
  const response = await api.get('/jobs', { params });
  return response.data; // Paginated job list from Spring Boot
};

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data; // Created job from Spring Boot
};

export const getJobDetails = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data; // Job details from Spring Boot
};

export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data; // Updated job from Spring Boot
};
```

### Application Service
```javascript
// services/applicationService.js - Connects to Spring Boot application endpoints
export const applyForJob = async (applicationData) => {
  const response = await api.post('/applications/apply', applicationData);
  return response.data; // Application confirmation from Spring Boot
};

export const getMyApplications = async (params) => {
  const response = await api.get('/applications/my-applications', { params });
  return response.data; // User's applications from Spring Boot
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.put(`/applications/${applicationId}/status`, { status });
  return response.data; // Updated application from Spring Boot
};

export const getApplicationsForJob = async (jobId, params) => {
  const response = await api.get(`/applications/job/${jobId}`, { params });
  return response.data; // Applications for specific job from Spring Boot
};
```

### Profile Service
```javascript
// services/userService.js - Connects to Spring Boot profile endpoints
export const getUserProfile = async () => {
  const response = await api.get('/profile/jobseeker');
  return response.data; // Job seeker profile from Spring Boot
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/profile/jobseeker', profileData);
  return response.data; // Updated profile from Spring Boot
};

// services/recruiterProfileService.js
export const getRecruiterProfile = async () => {
  const response = await api.get('/profile/recruiter');
  return response.data; // Recruiter profile from Spring Boot
};

export const updateRecruiterProfile = async (profileData) => {
  const response = await api.put('/profile/recruiter', profileData);
  return response.data; // Updated recruiter profile from Spring Boot
};

export const getCompanyProfile = async () => {
  const response = await api.get('/profile/company');
  return response.data; // Company profile from Spring Boot
};
```

## 🎨 Styling & Theming

### Bootstrap Integration
```css
/* Custom Bootstrap theme */
:root {
  --bs-primary: #0d6efd;
  --bs-secondary: #6c757d;
  --bs-success: #198754;
  --bs-danger: #dc3545;
  --bs-warning: #ffc107;
  --bs-info: #0dcaf0;
}
```

### Component Styling
```jsx
// Consistent styling patterns
<div className="card shadow-sm border-0">
  <div className="card-body p-4">
    <h5 className="fw-bold mb-3">Card Title</h5>
    <p className="text-muted">Card content</p>
  </div>
</div>
```

### Responsive Design
- Mobile-first approach
- Bootstrap grid system
- Responsive navigation
- Touch-friendly interfaces

## 🔧 State Management

### Auth Context
```jsx
// context/AuthContext.jsx
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async ({ email, password }) => {
    const response = await authService.loginUser(email, password);
    const { token, userId, roleId, fullname, email: userEmail } = response;
    
    const userData = {
      id: userId,
      email: userEmail,
      roleId,
      role: mapRoleIdToName(roleId),
      fullname,
    };

    setToken(token);
    setUser(userData);
    authService.setStoredAuth(token, userData);
    return userData;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Language Context
```jsx
// context/LanguageContext.jsx
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

## 🛡️ Form Validation

### Validation Utilities
```javascript
// utils/validators.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
  const cleanPhone = phone.replace(/[-\s()]/g, '');
  return phoneRegex.test(cleanPhone);
};

export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

export const getValidationErrors = (formData) => {
  const errors = {};
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }
  
  if (!validatePhone(formData.phone)) {
    errors.phone = 'Please provide a valid phone number';
  }
  
  return errors;
};
```

### Form Implementation
```jsx
// Real-time validation example
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Clear error when user starts typing
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const validationErrors = getValidationErrors(formData);
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  // Submit form
};
```

## 🌍 Internationalization

### Language Support
- English (en)
- Marathi (mr)
- Extensible for additional languages

### Translation Files
```json
// i18n/en.json
{
  "nav_dashboard": "Dashboard",
  "nav_jobs": "Jobs",
  "nav_applications": "Applications",
  "nav_profile": "Profile",
  "login_title": "Welcome Back",
  "register_title": "Create Account"
}

// i18n/mr.json
{
  "nav_dashboard": "डॅशबोर्ड",
  "nav_jobs": "नोकऱ्या",
  "nav_applications": "अर्ज",
  "nav_profile": "प्रोफाइल",
  "login_title": "परत स्वागत",
  "register_title": "खाते तयार करा"
}
```

### Usage
```jsx
import { useLanguage } from '../context/LanguageContext';

function Component() {
  const { t } = useLanguage();
  
  return (
    <h1>{t('nav_dashboard')}</h1>
  );
}
```

## 🧪 Testing

### Test Setup
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Component Testing
```jsx
// __tests__/Login.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/auth/Login';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
```

### Run Tests
```bash
npm run test
# or
yarn test
```

## 🚀 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Docker Deployment

#### Single Container
```bash
# Build the frontend image
docker build -t jobsync-frontend .

# Run the frontend container
docker run -d -p 3000:80 \
  -e VITE_API_BASE_URL=http://your-spring-boot-api:8080/api \
  --name jobsync-frontend \
  jobsync-frontend
```

#### Docker Compose (Full Stack)
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api
    depends_on:
      - backend
    restart: unless-stopped
    
  backend:
    image: jobsync-backend:latest  # Your Spring Boot application
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=production
      - DATABASE_URL=jdbc:mysql://db:3306/jobsync
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - db
    restart: unless-stopped
    
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=jobsync
      - MYSQL_USER=jobsync_user
      - MYSQL_PASSWORD=jobsync_password
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```
```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=JobSync
VITE_DEBUG_MODE=true

# .env.production
VITE_API_BASE_URL=https://api.jobsync.com/api
VITE_APP_NAME=JobSync
VITE_ERROR_REPORTING=true
```

## 📊 Performance Optimization

### Code Splitting
```jsx
// Lazy loading for better performance
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard'));
const JobList = lazy(() => import('../pages/jobs/JobList'));

// Usage with Suspense
<Suspense fallback={<Loader />}>
  <AdminDashboard />
</Suspense>
```

### Image Optimization
- WebP format support
- Lazy loading for images
- Responsive image sizes

### Bundle Optimization
- Tree shaking enabled
- Code splitting by routes
- Vendor chunk separation

## 🔧 Development Tools

### ESLint Configuration
```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "@vitejs/eslint-config-react"
  ],
  "rules": {
    "react/prop-types": "warn",
    "no-unused-vars": "warn"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 🐛 Error Handling

### Global Error Boundary
```jsx
// components/ErrorBoundary.jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### API Error Handling
```javascript
// services/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 📱 Responsive Design

### Breakpoints
```css
/* Custom breakpoints */
@media (max-width: 576px) { /* Mobile */ }
@media (min-width: 577px) and (max-width: 768px) { /* Tablet */ }
@media (min-width: 769px) and (max-width: 992px) { /* Desktop */ }
@media (min-width: 993px) { /* Large Desktop */ }
```

### Mobile Navigation
- Collapsible sidebar
- Touch-friendly buttons
- Swipe gestures support

## 🔒 Security Features

### XSS Prevention
- Input sanitization
- Content Security Policy
- Safe HTML rendering

### CSRF Protection
- Token-based authentication
- SameSite cookie attributes
- Origin validation

### Data Validation
- Client-side validation
- Server-side validation
- Input sanitization

## 📈 Analytics & Monitoring

### User Analytics
- Page view tracking
- User interaction events
- Performance metrics

### Error Monitoring
- Error logging
- Performance monitoring
- User feedback collection

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linting and tests
6. Submit a pull request

### Code Standards
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

## 📄 License

This project is licensed under the MIT License.

## � Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Verify all environment variables are set correctly

2. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` points to your Spring Boot API (usually `http://localhost:8080/api`)
   - Check Spring Boot backend is running on correct port
   - Verify CORS configuration in Spring Boot allows frontend origin
   - Check Spring Boot application logs for errors
   - Test API endpoints directly: `curl http://localhost:8080/api/health`

3. **Authentication Issues**
   - Check JWT token format and expiration
   - Verify Spring Boot JWT configuration matches frontend expectations
   - Clear browser localStorage and cookies
   - Check Spring Boot security configuration

4. **Docker Issues**
   - Ensure Docker daemon is running
   - Check port conflicts: `docker ps`
   - View frontend logs: `docker logs jobsync-frontend`
   - View backend logs: `docker logs jobsync-backend`
   - Verify network connectivity between containers

### Health Checks

- **Frontend**: `http://localhost:3000/health`
- **Spring Boot API**: `http://localhost:8080/actuator/health`
- **Database Connection**: Check Spring Boot actuator endpoints

### Backend Integration

This frontend is designed to work with a **Spring Boot backend** that should provide:

- **Authentication endpoints**: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
- **Job endpoints**: `/api/jobs`, `/api/jobs/{id}`, `/api/jobs/my-jobs`
- **Application endpoints**: `/api/applications/apply`, `/api/applications/my-applications`
- **Profile endpoints**: `/api/profile/jobseeker`, `/api/profile/recruiter`
- **Admin endpoints**: `/api/admin/users`, `/api/admin/companies`, `/api/admin/jobs`

Ensure your Spring Boot application implements these REST endpoints with proper CORS configuration.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above
- Review Spring Boot backend logs for API-related issues

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Frontend**: React 19 + Vite 7  
**Backend**: Spring Boot (Java)  
**Maintainer**: JobSync Development Team