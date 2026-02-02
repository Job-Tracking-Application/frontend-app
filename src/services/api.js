import axios from "axios";
import { getAuthToken, removeAuthToken } from "../utils/cookies";
import { toast } from "react-toastify";
import config from "../utils/config";

const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, request, message } = error;

    // Network error (no response received)
    if (!response) {
      if (request) {
        console.error('Network error - no response received:', message);
        // Don't show toast for auth pages - let components handle it
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          toast.error('Network error. Please check your connection.');
        }
      } else {
        console.error('Request setup error:', message);
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
          toast.error('Request failed. Please try again.');
        }
      }
      return Promise.reject(error);
    }

    // HTTP error responses
    const { status, data } = response;
    
    // Don't show automatic toasts for auth pages - let components handle them
    const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
    
    switch (status) {
      case 401:
        // Unauthorized - token expired or invalid
        console.warn('Unauthorized access - clearing token');
        removeAuthToken();
        
        // Don't show toast for auth pages
        if (!isAuthPage) {
          toast.error('Session expired. Please login again.');
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        break;
        
      case 403:
        // Forbidden
        console.warn('Access forbidden:', data?.message);
        if (!isAuthPage) {
          toast.error('Access denied. You don\'t have permission for this action.');
        }
        break;
        
      case 404:
        // Not found
        console.warn('Resource not found:', data?.message);
        if (!isAuthPage) {
          toast.error('Requested resource not found.');
        }
        break;
        
      case 400:
        // Bad Request - let component handle the specific error message
        console.warn('Bad request:', data?.message);
        // Don't show automatic toast for 400 errors - let components handle them
        break;
        
      case 422:
        // Validation error
        console.warn('Validation error:', data?.message);
        if (!isAuthPage) {
          if (data?.message) {
            toast.error(data.message);
          } else {
            toast.error('Invalid data provided.');
          }
        }
        break;
        
      case 429:
        // Rate limiting
        console.warn('Rate limit exceeded');
        if (!isAuthPage) {
          toast.error('Too many requests. Please wait a moment.');
        }
        break;
        
      case 500:
        // Server error
        console.error('Server error:', data?.message);
        if (!isAuthPage) {
          toast.error('Server error. Please try again later.');
        }
        break;
        
      case 503:
        // Service unavailable
        console.error('Service unavailable');
        if (!isAuthPage) {
          toast.error('Service temporarily unavailable. Please try again later.');
        }
        break;
        
      default:
        // Other errors
        console.error(`HTTP ${status} error:`, data?.message || message);
        if (!isAuthPage) {
          toast.error(data?.message || 'An unexpected error occurred.');
        }
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API calls with consistent error handling
export const apiCall = async (apiFunction, errorMessage = 'Operation failed') => {
  try {
    const response = await apiFunction();
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    
    // If error wasn't handled by interceptor, show generic message
    if (!error.response) {
      toast.error(errorMessage);
    }
    
    throw error;
  }
};

export default api;