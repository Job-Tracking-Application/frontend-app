const fs = require('fs');
const path = require('path');

// Simple translation mapping for common terms
const translationMap = {
  // Navigation & Common
  'Dashboard': 'डॅशबोर्ड',
  'Jobs': 'नोकऱ्या',
  'Applications': 'अर्ज',
  'Profile': 'प्रोफाइल',
  'Settings': 'सेटिंग्स',
  'Login': 'लॉगिन',
  'Logout': 'लॉगआउट',
  'Register': 'नोंदणी करा',
  'Submit': 'सबमिट करा',
  'Cancel': 'रद्द करा',
  'Save': 'सेव्ह करा',
  'Edit': 'संपादित करा',
  'Delete': 'हटवा',
  'Search': 'शोधा',
  'Filter': 'फिल्टर',
  'Loading': 'लोड होत आहे',
  'View All': 'सर्व पहा',
  'See More': 'अधिक पहा',
  
  // Job related
  'Create Job': 'जॉब पोस्ट करा',
  'My Jobs': 'माझ्या जॉब्स',
  'Job Title': 'जॉब शीर्षक',
  'Company': 'कंपनी',
  'Location': 'स्थान',
  'Salary': 'पगार',
  'Experience': 'अनुभव',
  'Skills': 'कौशल्ये',
  'Description': 'वर्णन',
  'Apply Now': 'आता अर्ज करा',
  'Job Details': 'जॉब तपशील',
  
  // User & Auth
  'Email': 'ईमेल',
  'Password': 'पासवर्ड',
  'Name': 'नाव',
  'Phone': 'फोन',
  'Welcome': 'स्वागत',
  'Sign In': 'साइन इन',
  'Sign Up': 'साइन अप',
  'Create Account': 'खाते तयार करा',
  
  // Admin
  'Admin': 'प्रशासक',
  'Manage Users': 'युजर्स व्यवस्थापन',
  'Manage Companies': 'कंपनी व्यवस्थापन',
  'Manage Jobs': 'जॉब व्यवस्थापन',
  'System Logs': 'सिस्टम लॉग्स',
  'Total Users': 'एकूण युजर्स',
  'Total Companies': 'एकूण कंपन्या',
  'Total Jobs': 'एकूण नोकऱ्या',
  
  // Status & Messages
  'Active': 'सक्रिय',
  'Inactive': 'निष्क्रिय',
  'Pending': 'प्रलंबित',
  'Approved': 'मंजूर',
  'Rejected': 'नाकारले',
  'Success': 'यशस्वी',
  'Error': 'त्रुटी',
  'Warning': 'चेतावणी',
  'Info': 'माहिती'
};

function translateText(text) {
  // Direct mapping
  if (translationMap[text]) {
    return translationMap[text];
  }
  
  // Pattern-based translations
  if (text.includes('Welcome Back')) return 'पुन्हा स्वागत';
  if (text.includes('Sign in to continue')) return 'सुरू ठेवण्यासाठी साइन इन करा';
  if (text.includes('New here?')) return 'नवीन आहात?';
  if (text.includes('Enter password')) return 'पासवर्ड टाका';
  if (text.includes('Email Address')) return 'ईमेल पत्ता';
  if (text.includes('Signing in')) return 'साइन इन होत आहे';
  if (text.includes('Find Your Dream Job')) return 'तुमची स्वप्नातील नोकरी शोधा';
  if (text.includes('Search by')) return text.replace('Search by', 'यानुसार शोधा');
  if (text.includes('No jobs found')) return 'कोणत्याही नोकऱ्या सापडल्या नाहीत';
  
  // Return original if no translation found
  return text;
}

function translateJsonFile() {
  const enPath = path.join(__dirname, '../src/i18n/en.json');
  const mrPath = path.join(__dirname, '../src/i18n/mr.json');
  
  try {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    let mrData = {};
    
    // Load existing Marathi translations if file exists
    if (fs.existsSync(mrPath)) {
      mrData = JSON.parse(fs.readFileSync(mrPath, 'utf8'));
    }
    
    // Translate missing keys
    let newTranslations = 0;
    for (const [key, value] of Object.entries(enData)) {
      if (!mrData[key]) {
        mrData[key] = translateText(value);
        newTranslations++;
        console.log(`✓ Translated: ${key} -> ${mrData[key]}`);
      }
    }
    
    // Remove keys that don't exist in English file (cleanup)
    const keysToRemove = Object.keys(mrData).filter(key => !enData.hasOwnProperty(key));
    keysToRemove.forEach(key => {
      delete mrData[key];
      console.log(`🗑️  Removed obsolete key: ${key}`);
    });
    
    // Write updated Marathi file
    fs.writeFileSync(mrPath, JSON.stringify(mrData, null, 2), 'utf8');
    
    console.log(`\n🎉 Translation complete!`);
    console.log(`📊 New translations: ${newTranslations}`);
    console.log(`📊 Removed obsolete keys: ${keysToRemove.length}`);
    console.log(`📊 Total keys: ${Object.keys(mrData).length}`);
    
  } catch (error) {
    console.error('❌ Translation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  translateJsonFile();
}

module.exports = { translateText, translateJsonFile };