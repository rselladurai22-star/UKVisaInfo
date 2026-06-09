import fs from 'fs';

const keyPath = 'service-account-key.json';
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

console.log('JSON Key ID:', credentials.private_key_id);
console.log('Project ID:', credentials.project_id);
