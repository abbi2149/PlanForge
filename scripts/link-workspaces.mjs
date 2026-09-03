import { mkdir, readdir, readFile, rm, symlink } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packagesRoot = path.join(root, 'packages');
const scopeRoot = path.join(root, 'node_modules', '@planforge');

await mkdir(scopeRoot, { recursive: true });

for (const entry of await readdir(packagesRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const packageRoot = path.join(packagesRoot, entry.name);
  const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
  if (typeof manifest.name !== 'string' || !manifest.name.startsWith('@planforge/')) continue;
  const shortName = manifest.name.slice('@planforge/'.length);
  const destination = path.join(scopeRoot, shortName);
  await rm(destination, { recursive: true, force: true });
  await symlink(packageRoot, destination, 'dir');
}
