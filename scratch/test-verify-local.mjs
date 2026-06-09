import fs from 'fs';
import crypto from 'crypto';

const keyPath = 'service-account-key.json';
const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
const { private_key: privateKey } = credentials;

const input = 'hello-world-test-string';

const sign = crypto.createSign('RSA-SHA256');
sign.update(input);
const signature = sign.sign(privateKey);

const publicKey = crypto.createPublicKey(privateKey);

const verify = crypto.createVerify('RSA-SHA256');
verify.update(input);
const isValid = verify.verify(publicKey, signature);

console.log('Is signature valid locally:', isValid);
