import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packagesRoot = path.join(root, 'packages');
let sourceFiles = 0;
let sourceLines = 0;
let nonBlankLines = 0;

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'dist' || entry.name === 'test') continue;
      await walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const text = await readFile(full, 'utf8');
      const lines = text.split('\n');
      sourceFiles += 1;
      sourceLines += lines.length - (text.endsWith('\n') ? 1 : 0);
      nonBlankLines += lines.filter((line) => line.trim().length > 0).length;
    }
  }
}

await walk(packagesRoot);
const packages = (await readdir(packagesRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory()).length;
console.log(JSON.stringify({ packages, sourceFiles, sourceLines, nonBlankLines }, null, 2));
