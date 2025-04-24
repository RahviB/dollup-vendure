import fs from 'fs';
import path from 'path';

// Ensure vendure-ui-config.json is copied before Vendure looks for it
const src = path.join(__dirname, '../admin-ui/src/vendure-ui-config.json');
const dest = path.join(__dirname, '../admin-ui/dist/vendure-ui-config.json');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ vendure-ui-config.json copied to admin-ui/dist');
} else {
  console.warn('⚠️  vendure-ui-config.json not found in src!');
}
