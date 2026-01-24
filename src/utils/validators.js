// Validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Allow international format with optional + and country code
  // Examples: +1234567890, 1234567890, +91-9876543210
  const phoneRegex = /^[+]?[1-9]\d{1,14}$/;
  const cleanPhone = phone.replace(/[-\s()]/g, ''); // Remove common separators
  return phoneRegex.test(cleanPhone);
};

export const validateUsername = (username) => {
  // Username: 3-50 characters, letters, numbers, underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password) => {
  // Password: minimum 6 characters
  return password && password.length >= 6;
};

export const validateFullName = (fullName) => {
  // Full name: not empty, max 255 characters
  return fullName && fullName.trim().length > 0 && fullName.length <= 255;
};

export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters except +
  return phone.replace(/[^\d+]/g, '');
};

export const getValidationErrors = (formData) => {
  const errors = {};

  if (!validateFullName(formData.fullname)) {
    errors.fullname = 'Full name is required';
  }

  if (!validateUsername(formData.username)) {
    errors.username = 'Username must be 3-50 characters and contain only letters, numbers, and underscores';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please provide a valid phone number';
  }

  return errors;
};