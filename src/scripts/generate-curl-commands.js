/**
 * Generate curl commands to create HighLevel custom fields for bulk filing
 * 
 * USAGE:
 * 1. Replace API_KEY and LOCATION_ID below
 * 2. Run: node generate-curl-commands.js > create-fields.sh
 * 3. chmod +x create-fields.sh
 * 4. Run: ./create-fields.sh
 */

const API_KEY = 'YOUR_API_KEY_HERE';
const LOCATION_ID = 'YOUR_LOCATION_ID_HERE';
const API_BASE = 'https://services.leadconnectorhq.com';

const fields = require('./bulk-filing-fields.json');

console.log('#!/bin/bash');
console.log('');
console.log('# ==========================================');
console.log('# HIGHLEVEL BULK FILING CUSTOM FIELDS');
console.log('# Auto-generated curl commands');
console.log('# ==========================================');
console.log('');
console.log(`API_KEY="${API_KEY}"`);
console.log(`LOCATION_ID="${LOCATION_ID}"`);
console.log(`API_BASE="${API_BASE}"`);
console.log('');

Object.entries(fields.folders).forEach(([key, folder]) => {
  console.log('');
  console.log(`# ==========================================`);
  console.log(`# ${folder.folder_name}`);
  console.log(`# ==========================================`);
  console.log('');
  
  folder.fields.forEach((field, index) => {
    const payload = {
      name: field.name,
      dataType: field.dataType,
      position: 0
    };
    
    if (field.placeholder) {
      payload.placeholder = field.placeholder;
    }
    
    if (field.options) {
      payload.options = field.options;
    }
    
    console.log(`echo "Creating ${field.name}..."`);
    console.log(`curl --location "\${API_BASE}/locations/\${LOCATION_ID}/customFields" \\`);
    console.log(`  --header 'Content-Type: application/json' \\`);
    console.log(`  --header "Authorization: Bearer \${API_KEY}" \\`);
    console.log(`  --header 'Version: 2021-07-28' \\`);
    console.log(`  --data '${JSON.stringify(payload)}'`);
    console.log('');
    console.log('sleep 0.5  # Rate limiting');
    console.log('');
  });
});

console.log('echo "✅ All custom fields created!"');
console.log('echo "Next: Organize fields into folders in HighLevel UI"');
