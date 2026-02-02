// Helper utilities for common operations

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid date';
    
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Format salary range for display
 * @param {number} minSalary - Minimum salary
 * @param {number} maxSalary - Maximum salary
 * @returns {string} Formatted salary range
 */
export const formatSalaryRange = (minSalary, maxSalary) => {
  if (!minSalary && !maxSalary) return 'Salary not specified';
  
  const formatAmount = (amount) => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  if (minSalary && maxSalary) {
    return `₹${formatAmount(minSalary)} - ₹${formatAmount(maxSalary)}`;
  }
  
  if (minSalary) {
    return `₹${formatAmount(minSalary)}+`;
  }
  
  return `Up to ₹${formatAmount(maxSalary)}`;
};

/**
 * Format experience range for display
 * @param {number} minExp - Minimum experience
 * @param {number} maxExp - Maximum experience
 * @returns {string} Formatted experience range
 */
export const formatExperienceRange = (minExp, maxExp) => {
  if (!minExp && !maxExp) return 'Experience not specified';
  
  if (minExp && maxExp) {
    if (minExp === maxExp) {
      return `${minExp} year${minExp !== 1 ? 's' : ''}`;
    }
    return `${minExp}-${maxExp} years`;
  }
  
  if (minExp) {
    return `${minExp}+ years`;
  }
  
  return `Up to ${maxExp} years`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Generate initials from full name
 * @param {string} fullName - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (fullName) => {
  if (!fullName || typeof fullName !== 'string') return 'U';
  
  // Clean the name and split by spaces
  const names = fullName.trim().split(/\s+/).filter(name => name.length > 0);
  
  if (names.length === 0) return 'U';
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  // Take first letter of first name and first letter of last name
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Check if URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * Generate random ID
 * @param {number} length - Length of ID
 * @returns {string} Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};