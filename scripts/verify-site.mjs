#!/usr/bin/env node

/**
 * Service Account Site Verification Script (Programmatic Workaround)
 * 
 * Bypasses the Google Search Console UI "email not found" bug by verifying the 
 * service account as an owner directly using the Site Verification API.
 * 
 * Usage:
 *   node scripts/verify-site.mjs [options]
 * 
 * Steps:
 *   1. Enable "Google Site Verification API" in your Google Cloud Project.
 *   2. Run this script to generate a verification file.
 *   3. Commit and push the file to deploy it to Vercel.
 *   4. Run the script again to verify.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const cwd = process.cwd();

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

const options = {
  keyPath: 'service-account-key.json',
  siteUrl: 'https://ukvisainfo.co.uk/',
  mode: 'generate', // 'generate' or 'verify'
};

// Parse arguments
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--key':
      options.keyPath = args[++i];
      break;
    case '--site':
      options.siteUrl = args[++i];
      break;
    case '--verify':
      options.mode = 'verify';
      break;
    case '--generate':
      options.mode = 'generate';
      break;
    default:
      console.warn(`${colors.yellow}Warning: Unknown argument "${args[i]}"${colors.reset}`);
  }
}

// Ensure site URL ends with a slash for standard site-level checks
if (!options.siteUrl.endsWith('/')) {
  options.siteUrl += '/';
}

function generateJWT(clientEmail, privateKey, scope) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signatureInput = `${base64UrlHeader}.${base64UrlPayload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64url');

  return `${signatureInput}.${signature}`;
}

async function getAccessToken(clientEmail, privateKey, scope) {
  const jwt = generateJWT(clientEmail, privateKey, scope);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Authentication failed: ${response.statusText} (${errorText})`);
  }

  const data = await response.json();
  return data.access_token;
}

async function main() {
  console.log(`\n${colors.bright}${colors.cyan}=== Site Verification Workaround ===${colors.reset}\n`);

  const absoluteKeyPath = path.join(cwd, options.keyPath);
  if (!fs.existsSync(absoluteKeyPath)) {
    console.error(`${colors.red}Error: Credentials file not found at: ${absoluteKeyPath}${colors.reset}`);
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(absoluteKeyPath, 'utf8'));
  const { client_email: clientEmail, private_key: privateKey } = credentials;

  if (options.mode === 'generate') {
    console.log(`${colors.bright}Step 1: Fetching verification token from Google...${colors.reset}`);
    
    try {
      const token = await getAccessToken(clientEmail, privateKey, 'https://www.googleapis.com/auth/siteverification');
      
      const res = await fetch('https://www.googleapis.com/siteVerification/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationMethod: 'FILE',
          site: {
            identifier: options.siteUrl,
            type: 'SITE',
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData.error || errData));
      }

      const data = await res.json();
      const filename = data.token; // It will be something like google123456.html
      
      if (!filename || !filename.endsWith('.html')) {
        throw new Error(`Unexpected token format received: ${JSON.stringify(data)}`);
      }

      const content = `google-site-verification: ${filename}`;
      const publicPath = path.join(cwd, 'public', filename);

      // Write the verification file into public folder
      fs.writeFileSync(publicPath, content);
      console.log(`\n${colors.green}✔ Success! Created verification file at:${colors.reset}`);
      console.log(`  ${colors.bright}public/${filename}${colors.reset}\n`);

      console.log(`${colors.yellow}Next Steps Required:${colors.reset}`);
      console.log(`1. Stage and commit this file to GitHub:`);
      console.log(`   ${colors.bright}git add public/${filename}${colors.reset}`);
      console.log(`   ${colors.bright}git commit -m "chore: add verification file for service account"${colors.reset}`);
      console.log(`   ${colors.bright}git push origin main${colors.reset}`);
      console.log(`2. Wait 1-2 minutes for Vercel to build and deploy the update.`);
      console.log(`3. Confirm the file is live by visiting:`);
      console.log(`   ${colors.bright}${options.siteUrl}${filename}${colors.reset}`);
      console.log(`4. Once it is live, run the verification command:`);
      console.log(`   ${colors.bright}node scripts/verify-site.mjs --verify${colors.reset}`);

    } catch (err) {
      console.error(`${colors.red}Error generating token: ${err.message}${colors.reset}`);
      console.error(`${colors.yellow}Tip: Make sure you enabled the "Google Site Verification API" in your Google Cloud Console project.${colors.reset}`);
      process.exit(1);
    }
  } else if (options.mode === 'verify') {
    console.log(`${colors.bright}Step 2: Requesting Google to verify the deployed file...${colors.reset}`);
    
    try {
      const token = await getAccessToken(clientEmail, privateKey, 'https://www.googleapis.com/auth/siteverification');
      
      const res = await fetch('https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=FILE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          site: {
            identifier: options.siteUrl,
            type: 'SITE',
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData.error || errData));
      }

      const data = await res.json();
      console.log(`\n${colors.green}✔ Success! The service account has been verified as an Owner.${colors.reset}`);
      console.log(`Details:`);
      console.log(`  ID: ${data.id}`);
      console.log(`  Site: ${data.site.identifier}`);
      console.log(`  Owners: ${data.owners.join(', ')}\n`);
      console.log(`${colors.green}You can now run the crawl script normally!${colors.reset}`);
      console.log(`Run: ${colors.bright}node scripts/google-index.mjs${colors.reset}\n`);

    } catch (err) {
      console.error(`${colors.red}Verification failed: ${err.message}${colors.reset}`);
      console.error(`${colors.yellow}Tip: Verify that the file exists and is accessible in your browser first.${colors.reset}`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(`${colors.red}Fatal Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
