import fs from 'fs';
import crypto from 'crypto';

const keyPath = 'service-account-key.json';
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const { client_email: clientEmail, private_key: privateKey } = credentials;

function makeJWT(clientEmail, privateKey, base64UrlSignature) {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
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

  const signature = base64UrlSignature(signatureInput, privateKey);
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
  console.log('Testing Method A: sign.sign(privateKey, "base64url")');
  try {
    const jwtA = makeJWT(clientEmail, privateKey, (input, key) => {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(input);
      return sign.sign(key, 'base64url');
    });
    const resA = await testToken(jwtA);
    console.log('Method A Result:', resA.ok ? 'SUCCESS' : `FAILED (${resA.status}): ${resA.data}`);
  } catch (err) {
    console.error('Method A Error:', err.message);
  }

  console.log('\nTesting Method B: sign.sign(privateKey).toString("base64url")');
  try {
    const jwtB = makeJWT(clientEmail, privateKey, (input, key) => {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(input);
      return sign.sign(key).toString('base64url');
    });
    const resB = await testToken(jwtB);
    console.log('Method B Result:', resB.ok ? 'SUCCESS' : `FAILED (${resB.status}): ${resB.data}`);
  } catch (err) {
    console.error('Method B Error:', err.message);
  }
}

runTests().catch(err => console.error(err));
