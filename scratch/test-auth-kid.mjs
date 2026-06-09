import fs from 'fs';
import crypto from 'crypto';

const keyPath = 'service-account-key.json';
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const { client_email: clientEmail, private_key: privateKey, private_key_id: privateKeyId } = credentials;

function makeJWT(clientEmail, privateKey, privateKeyId) {
  const header = { 
    alg: 'RS256', 
    typ: 'JWT',
    kid: privateKeyId // Add key ID here
  };
  const now = Math.floor(Date.now() / 1000) - 10;
  const payload = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signatureInput = `${base64UrlHeader}.${base64UrlPayload}`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey).toString('base64url');
  
  return `${signatureInput}.${signature}`;
}

async function testToken(jwt) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const text = await response.text();
  return { ok: response.ok, status: response.status, data: text };
}

async function runTests() {
  console.log('Testing with kid in header...');
  const jwt = makeJWT(clientEmail, privateKey, privateKeyId);
  const res = await testToken(jwt);
  console.log('Result:', res.ok ? 'SUCCESS!' : `FAILED (${res.status}): ${res.data}`);
}

runTests().catch(err => console.error(err));
