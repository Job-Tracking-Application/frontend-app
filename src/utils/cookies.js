// Cookie utility functions for secure authentication storage

export const setCookie = (name, value, days = 7, options = {}) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  const defaultOptions = {
    expires: expires.toUTCString(),
    path: '/',
    SameSite: 'Strict',
    Secure: window.location.protocol === 'https:'
  };
  
  const cookieOptions = { ...defaultOptions, ...options };
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  Object.entries(cookieOptions).forEach(([key, val]) => {
    if (val === true) {
      cookieString += `;${key}`;
    } else if (val !== false && val !== null && val !== undefined) {
      cookieString += `;${key}=${val}`;
    }
  });
  
  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const deleteCookie = (name, path = '/') => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
};

export const getAllCookies = () => {
  const cookies = {};
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    const eqPos = c.indexOf('=');
    if (eqPos > 0) {
      const name = c.substring(0, eqPos);
      const value = decodeURIComponent(c.substring(eqPos + 1));
      cookies[name] = value;
    }
  }
  return cookies;
};

// Authentication-specific cookie functions
export const setAuthToken = (token, days = 7) => {
  // For now, use localStorage for better compatibility
  // TODO: Move to httpOnly cookies for better security
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to store auth token in localStorage:', error);
    // Fallback to cookie
    setCookie('auth_token', token, days, {
      HttpOnly: false, // Can't set HttpOnly from JavaScript
      Secure: window.location.protocol === 'https:',
      SameSite: 'Strict'
    });
  }
};

export const getAuthToken = () => {
  try {
    // Try localStorage first
    const token = localStorage.getItem('auth_token');
    if (token) return token;
    
    // Fallback to cookie
    return getCookie('auth_token');
  } catch (error) {
    console.error('Failed to retrieve auth token from localStorage:', error);
    return getCookie('auth_token');
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove auth token from localStorage:', error);
  }
  
  // Also remove from cookies
  deleteCookie('auth_token');
};

export const clearAuthCookies = () => {
  removeAuthToken();
};

// Language preference functions
export const setLanguagePreference = (language) => {
  setCookie('language', language, 365); // 1 year expiration
};

export const getLanguagePreference = () => {
  return getCookie('language') || 'en';
};