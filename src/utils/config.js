// Environment configuration and validation

/**
 * Environment configuration with validation and defaults
 */
class Config {
  constructor() {
    this.validateEnvironment();
  }

  // API Configuration
  get apiBaseUrl() {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  }

  get apiTimeout() {
    return parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
  }

  // App Configuration
  get appName() {
    return import.meta.env.VITE_APP_NAME || 'JobSync';
  }

  get appVersion() {
    return import.meta.env.VITE_APP_VERSION || '1.0.0';
  }

  // Environment
  get isDevelopment() {
    return import.meta.env.DEV;
  }

  get isProduction() {
    return import.meta.env.PROD;
  }

  get mode() {
    return import.meta.env.MODE;
  }

  // Feature Flags
  get enableDebugMode() {
    return import.meta.env.VITE_DEBUG_MODE === 'true' || this.isDevelopment;
  }

  get enableErrorReporting() {
    return import.meta.env.VITE_ERROR_REPORTING === 'true' && this.isProduction;
  }

  // Security
  get enableSecureCookies() {
    return import.meta.env.VITE_SECURE_COOKIES === 'true' || this.isProduction;
  }

  // Logging
  get logLevel() {
    return import.meta.env.VITE_LOG_LEVEL || (this.isDevelopment ? 'debug' : 'error');
  }

  // Validate required environment variables
  validateEnvironment() {
    const requiredVars = [
      'VITE_API_BASE_URL'
    ];

    const missingVars = requiredVars.filter(varName => {
      const value = import.meta.env[varName];
      return !value || value.trim() === '';
    });

    if (missingVars.length > 0) {
      const message = `Missing required environment variables: ${missingVars.join(', ')}`;
      console.error(message);
      
      if (this.isProduction) {
        throw new Error(message);
      } else {
        console.warn('Using default values for missing environment variables');
      }
    }

    // Validate API URL format
    try {
      new URL(this.apiBaseUrl);
    } catch (error) {
      const message = `Invalid VITE_API_BASE_URL format: ${this.apiBaseUrl}`;
      console.error(message);
      
      if (this.isProduction) {
        throw new Error(message);
      }
    }
  }

  // Get all configuration as object (for debugging)
  getAll() {
    return {
      apiBaseUrl: this.apiBaseUrl,
      apiTimeout: this.apiTimeout,
      appName: this.appName,
      appVersion: this.appVersion,
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
      mode: this.mode,
      enableDebugMode: this.enableDebugMode,
      enableErrorReporting: this.enableErrorReporting,
      enableSecureCookies: this.enableSecureCookies,
      logLevel: this.logLevel
    };
  }

  // Log configuration (for debugging)
  logConfig() {
    if (this.enableDebugMode) {
      console.group('🔧 Application Configuration');
      console.table(this.getAll());
      console.groupEnd();
    }
  }
}

// Create singleton instance
const config = new Config();

// Log configuration in development
if (config.isDevelopment) {
  config.logConfig();
}

export default config;