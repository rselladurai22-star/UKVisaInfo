// One-off: generate AI thumbnail images for blog posts via Gemini.
// Usage:
//   node --env-file=.env.local scripts/gen-blog-images.mjs --test   (1 image)
//   node --env-file=.env.local scripts/gen-blog-images.mjs          (full pool)
import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY || KEY === 'MY_GEMINI_API_KEY') {
  console.error('GEMINI_API_KEY missing/placeholder. Add a real key to .env.local');
  process.exit(1);
}
const MODEL = 'gemini-2.5-flash-image';
const OUT = 'public/blog';
const ai = new GoogleGenAI({ apiKey: KEY });

const STYLE =
  'Editorial 3D-render illustration, clean modern UK fintech aesthetic, soft studio lighting, ' +
  'muted professional palette with a deep-green accent (#00875A), generous negative space, ' +
  'no text, no words, no logos, no people faces, 16:9 wide composition, high detail.';

// id -> subject prompt. Built per category (3 each) below.
const PROMPTS = {
  // visa & immigration
  'visa-1': 'a UK passport, boarding pass and a Big Ben silhouette on a desk',
  'visa-2': 'a stylised globe with travel route lines arriving at the United Kingdom',
  'visa-3': 'an official immigration document stamp and a key, symbolising settlement',
  // money & tax
  'money-1': 'British pound coins and banknotes stacked beside a calculator',
  'money-2': 'an upward financial growth chart with a pound symbol',
  'money-3': 'a piggy bank and HMRC-style tax paperwork on a clean desk',
  // property & mortgages
  'property-1': 'a modern UK terraced house with a sold sign and a set of keys',
  'property-2': 'a miniature house resting on stacks of coins, mortgage concept',
  'property-3': 'house keys, a contract and a model home on an architect desk',
  // business & self-employed
  'business-1': 'a laptop, invoice documents and a coffee, freelancer workspace',
  'business-2': 'a briefcase and rising bar chart, small business growth',
  'business-3': 'a VAT ledger, calculator and pen on a tidy office desk',
  // benefits & support
  'benefits-1': 'a protective hand sheltering a small house and family figures',
  'benefits-2': 'a welfare support form and a pound coin, helping-hand concept',
  'benefits-3': 'a shield with a heart, social support and security symbol',
  // family & law
  'family-1': 'a wooden gavel and a family will document on a desk',
  'family-2': 'interlocking wedding rings beside legal paperwork',
  'family-3': 'a balanced scales of justice with a small house',
  // motoring & vehicles
  'motoring-1': 'a modern electric car charging, clean energy motoring',
  'motoring-2': 'a car key, road tax disc and a UK road sign',
  'motoring-3': 'a dashboard fuel gauge and pound coins, running costs',
  // energy & bills
  'energy-1': 'a home with solar panels and a glowing energy meter',
  'energy-2': 'a lightbulb made of leaves beside a utility bill',
  'energy-3': 'a heat pump unit beside a cosy modern house',
  // estate & inheritance
  'estate-1': 'a last will and testament scroll with a wax seal and a house',
  'estate-2': 'a family tree diagram over a property and coins',
  'estate-3': 'a safe deposit box, documents and a pound symbol, estate planning',
};

async function genOne(id, subject) {
  const prompt = `${subject}. ${STYLE}`;
  const res = await ai.models.generateContent({ model: MODEL, contents: prompt });
  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) {
    const txt = parts.map((p) => p.text).filter(Boolean).join(' ');
    throw new Error(`No image returned for ${id}. Model said: ${txt || '(nothing)'}`);
  }
  const raw = Buffer.from(img.inlineData.data, 'base64');
  // Resize to a sensible thumbnail width and ship WebP for CWV/AdSense.
  const webp = await sharp(raw).resize(800, 450, { fit: 'cover' }).webp({ quality: 78 }).toBuffer();
  const path = `${OUT}/${id}.webp`;
  await writeFile(path, webp);
  console.log(`✓ ${path} (${(webp.length / 1024).toFixed(0)} KB)`);
}

const isTest = process.argv.includes('--test');

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const onlyIds = process.argv.filter((a) => PROMPTS[a]);
const entries = Object.entries(PROMPTS);
const todo = onlyIds.length
  ? entries.filter(([id]) => onlyIds.includes(id))
  : isTest
    ? entries.slice(0, 1)
    : entries;

console.log(`Generating ${todo.length} image(s) with ${MODEL}…`);
let ok = 0;
for (const [id, subject] of todo) {
  try {
    await genOne(id, subject);
    ok++;
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
  }
}
console.log(`Done: ${ok}/${todo.length} generated.`);
