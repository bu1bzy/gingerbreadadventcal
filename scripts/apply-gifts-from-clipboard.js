const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const fileArg = process.argv[2];
const shouldCommit = process.argv.includes('--no-commit') ? false : true;

function readClipboard() {
  try {
    // macOS clipboard
    const out = execSync('pbpaste', { encoding: 'utf8' });
    return out;
  } catch (e) {
    return null;
  }
}

async function main() {
  let content = null;
  if (fileArg) {
    const inFile = path.resolve(fileArg);
    if (!fs.existsSync(inFile)) {
      console.error('File not found:', inFile);
      process.exit(1);
    }
    content = fs.readFileSync(inFile, 'utf8');
  } else {
    content = readClipboard();
  }

  if (!content) {
    console.error('Clipboard is empty and no file provided. Use `npm run apply:gifts path/to/file` or copy TS code to clipboard.');
    process.exit(1);
  }

  content = content.trim();
  let out = null;
  if (content.startsWith('export const defaultGifts')) {
    out = content;
  } else if (content.startsWith('[') || content.startsWith('{')) {
    // assume JSON array or object with array
    let json;
    try {
      json = JSON.parse(content);
    } catch (e) {
      console.error('Invalid JSON in clipboard');
      process.exit(1);
    }
    const arr = Array.isArray(json) ? json : json.defaultGifts || json;
    out = `export const defaultGifts = ${JSON.stringify(arr, null, 2)};\n`;
  } else {
    console.error('Clipboard does not contain a valid defaultGifts export or JSON.');
    process.exit(1);
  }

  const outPath = path.resolve('src/data/gifts.ts');
  fs.writeFileSync(outPath, out);
  console.log('Wrote', outPath);

  if (shouldCommit) {
    try {
      execSync(`git add ${outPath}`);
      execSync(`git commit -m "Update defaultGifts via UI/clipboard"`);
      console.log('Committed changes.');
    } catch (e) {
      console.error('Failed to commit:', e.message);
    }
  }
}

main();
