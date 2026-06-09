import { JWT } from 'google-auth-library';
import fs from 'fs';

const keyPath = 'service-account-key.json';
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

async function testOfficial() {
  console.log('Authenticating using official google-auth-library...');
  
  const client = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  try {
    const credentials = await client.authorize();
    console.log('SUCCESS! Access token received:', credentials.access_token ? 'YES' : 'NO');
  } catch (err) {
    console.error('FAILED using official library:', err.message);
  }
}

testOfficial().catch(err => console.error(err));
