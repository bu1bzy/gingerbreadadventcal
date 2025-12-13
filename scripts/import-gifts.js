const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/import-gifts.js path/to/gifts.json');
  process.exit(1);
}

const inFile = path.resolve(inputPath);
if (!fs.existsSync(inFile)) {
  console.error('File not found:', inFile);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inFile, 'utf-8'));
if (!Array.isArray(data)) {
  console.error('Expected an array of gifts');
  process.exit(1);
}

// Normalize and write src/data/gifts.ts
const out = data.map((item, idx) => {
  return {
    day_number: item.day_number ?? idx + 1,
    content_text: item.content_text ?? null,
    content_image_url: item.content_image_url ?? null,
    content_link: item.content_link ?? null,
  };
});

const outPath = path.resolve('src/data/gifts.ts');
const content = `export const defaultGifts = ${JSON.stringify(out, null, 2)};\n`;
fs.writeFileSync(outPath, content);
console.log('Wrote', outPath);
