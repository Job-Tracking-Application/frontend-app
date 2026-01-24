import { useLanguage } from '../context/LanguageContext';

// Hook for handling backend message keys
export function useBackendMessages() {
  const { t } = useLanguage();
  
  // Handle backend error messages with fallback
  const translateBackendMessage = (message, fallback = null) => {
    if (!message) return fallback || t('An error occurred');
    
    // If message is already a translation key
    if (message.startsWith('error.') || message.startsWith('success.') || message.startsWith('info.')) {
      return t(message, fallback || message);
    }
    
    // Common backend message patterns
    const messageMap = {
      'User not found': 'error.user_not_found',
      'Invalid credentials': 'error.invalid_credentials',
      'Email already exists': 'error.email_exists',
      'Job not found': 'error.job_not_found',
      'Application submitted successfully': 'success.application_submitted',
      'Profile updated successfully': 'success.profile_updated',
      'Job created successfully': 'success.job_created',
      'Access denied': 'error.access_denied',
      'Server error': 'error.server_error'
    };
    
    const translationKey = messageMap[message];
    return translationKey ? t(translationKey, message) : message;
  };
  
  return { translateBackendMessage };
}

// Utility for formatting dynamic messages
export function formatMessage(template, params = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key] || match;
  });
}

// Status translation helper
export function translateStatus(status) {
  const statusMap = {
    'PENDING': 'status.pending',
    'APPROVED': 'status.approved', 
    'REJECTED': 'status.rejected',
    'ACTIVE': 'status.active',
    'INACTIVE': 'status.inactive',
    'DRAFT': 'status.draft',
    'PUBLISHED': 'status.published'
  };
  
  return statusMap[status] || status;
}