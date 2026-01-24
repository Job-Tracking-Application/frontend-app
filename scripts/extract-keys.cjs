const fs = require('fs');
const path = require('path');

// Simple regex-based key extraction
function extractTranslationKeys(content) {
  const keys = new Set();
  
  // Match t("key") and t('key') patterns
  const tFunctionRegex = /t\s*\(\s*["']([^"']+)["']/g;
  let match;
  
  while ((match = tFunctionRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

function scanDirectory(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  const allKeys = new Set();
  
  function scanFile(filePath) {
    if (!extensions.some(ext => filePath.endsWith(ext))) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const keys = extractTranslationKeys(content);
      keys.forEach(key => allKeys.add(key));
      
      if (keys.length > 0) {
        console.log(`📄 ${path.relative(process.cwd(), filePath)}: ${keys.length} keys`);
      }
    } catch (error) {
      console.warn(`⚠️  Could not read ${filePath}: ${error.message}`);
    }
  }
  
  function scanDir(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and other irrelevant directories
          if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
            scanDir(fullPath);
          }
        } else {
          scanFile(fullPath);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not scan directory ${currentDir}: ${error.message}`);
    }
  }
  
  scanDir(dir);
  return Array.from(allKeys).sort();
}

function updateTranslationFile(keys, locale = 'en') {
  const filePath = path.join(__dirname, `../src/i18n/${locale}.json`);
  let existingTranslations = {};
  
  // Load existing translations
  if (fs.existsSync(filePath)) {
    try {
      existingTranslations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.warn(`⚠️  Could not parse existing ${locale}.json: ${error.message}`);
    }
  }
  
  // Add new keys with default values
  let newKeysCount = 0;
  keys.forEach(key => {
    if (!existingTranslations[key]) {
      existingTranslations[key] = key; // Use key as default value
      newKeysCount++;
    }
  });
  
  // Write updated file
  fs.writeFileSync(filePath, JSON.stringify(existingTranslations, null, 2), 'utf8');
  
  console.log(`📝 Updated ${locale}.json: ${newKeysCount} new keys, ${Object.keys(existingTranslations).length} total`);
  return existingTranslations;
}

function main() {
  console.log('🔍 Extracting translation keys...\n');
  
  const srcDir = path.join(__dirname, '../src');
  const keys = scanDirectory(srcDir);
  
  console.log(`\n✅ Found ${keys.length} unique translation keys\n`);
  
  // Update English file
  const enTranslations = updateTranslationFile(keys, 'en');
  
  console.log('\n🎉 Key extraction complete!');
  console.log(`📊 Total keys: ${keys.length}`);
  console.log(`📁 Files updated: src/i18n/en.json`);
  
  return keys;
}

if (require.main === module) {
  main();
}

module.exports = { extractTranslationKeys, scanDirectory, updateTranslationFile };