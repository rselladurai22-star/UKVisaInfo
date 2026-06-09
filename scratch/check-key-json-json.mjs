import fs from 'fs';

try {
  const data = JSON.parse(fs.readFileSync('service-account-key.json.json', 'utf8'));
  console.log('JSON.JSON Key ID:', data.private_key_id);
} catch (err) {
  console.error('Error reading JSON.JSON:', err.message);
}
