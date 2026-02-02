/**
 * Validates if a string is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Validates if a URL is from a supported resume platform
 * @param {string} url - The URL to validate
 * @returns {object} - Validation result with isValid and platform info
 */
export const validateResumeUrl = (url) => {
    if (!isValidUrl(url)) {
        return {
            isValid: false,
            message: 'Please enter a valid URL starting with http:// or https://'
        };
    }

    const supportedPlatforms = [
        {
            name: 'Google Drive',
            domains: ['drive.google.com', 'docs.google.com'],
            pattern: /drive\.google\.com|docs\.google\.com/i
        },
        {
            name: 'LinkedIn',
            domains: ['linkedin.com', 'www.linkedin.com'],
            pattern: /linkedin\.com/i
        }
    ];

    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    const platform = supportedPlatforms.find(p => 
        p.domains.some(domain => hostname.includes(domain.toLowerCase()))
    );

    if (platform) {
        return {
            isValid: true,
            platform: platform.name,
            message: `Valid ${platform.name} URL`
        };
    }

    return {
        isValid: true,
        platform: 'Other',
        message: 'URL accepted, but we recommend using Google Drive or LinkedIn for better reliability'
    };
};

/**
 * Suggests improvements for common URL issues
 */
export const getUrlSuggestions = (url) => {
    if (!url) return null;

    const suggestions = [];

    if (url.includes('drive.google.com')) {
        if (!url.includes('/view') && !url.includes('/edit')) {
            suggestions.push('Make sure your Google Drive link includes "/view" at the end for public access');
        }
        if (url.includes('/edit')) {
            suggestions.push('Consider changing "/edit" to "/view" in your Google Drive link for better compatibility');
        }
    }

    if (url.includes('linkedin.com/in/')) {
        suggestions.push('LinkedIn profile detected - make sure your profile is public and includes your resume information');
    }

    return suggestions.length > 0 ? suggestions : null;
};

/**
 * Formats a URL for display
 */
export const formatUrlForDisplay = (url, maxLength = 50) => {
    if (!url || url.length <= maxLength) return url;
    
    const start = url.substring(0, maxLength - 10);
    const end = url.substring(url.length - 7);
    return `${start}...${end}`;
};