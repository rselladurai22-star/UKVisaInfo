import fs from 'fs';

const keyPath = 'service-account-key.json';
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const { client_email: clientEmail, private_key: privateKey } = credentials;

console.log('Client Email:', clientEmail);
console.log('Private Key is string:', typeof privateKey === 'string');
if (typeof privateKey === 'string') {
  console.log('Private Key length:', privateKey.length);
  console.log('Starts with -----BEGIN PRIVATE KEY-----:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'));
  console.log('Ends with -----END PRIVATE KEY-----\n:', privateKey.endsWith('-----END PRIVATE KEY-----\n') || privateKey.endsWith('-----END PRIVATE KEY-----'));
  console.log('Contains literal newlines (ASCII 10):', privateKey.includes('\n'));
  console.log('Contains escaped backslash-n (\\n):', privateKey.includes('\\n'));
}
