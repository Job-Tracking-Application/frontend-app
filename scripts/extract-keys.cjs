/**
 * List all i18n keys used as t("...") or t('...')
 * Prints actual key names
 */

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "../src");
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// Matches: t("Choose Language") OR t('Choose Language')
const T_REGEX = /t\s*\(\s*["']([^"']+)["']/g;

function walk(dir, files = []) {
  fs.readdirSync(dir).forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!["node_modules", "dist", "build"].includes(item)) {
        walk(fullPath, files);
      }
    } else if (EXTENSIONS.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  });
  return files;
}

function extractKeys() {
  const files = walk(SRC_DIR);
  const keys = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(file, "utf8");
    let match;

    while ((match = T_REGEX.exec(content)) !== null) {
      keys.add(match[1]);
    }
  });

  return [...keys].sort();
}

// ---------- RUN ----------
const keys = extractKeys();

// Print to console
console.log("\n🔑 i18n Keys Found:\n");
keys.forEach(key => console.log(key));

// Optional: write to file
fs.writeFileSync(
  path.join(__dirname, "i18n-keys.txt"),
  keys.join("\n"),
  "utf8"
);

console.log(`\n📄 Saved to scripts/i18n-keys.txt`);