import { mkdir, readdir, readFile, realpath, rm, symlink } from 'node:fs/promises';
import path from 'node:path';

async function linksTo(destination, packageRoot) {
  try {
    return (await realpath(destination)) === (await realpath(packageRoot));
  } catch {
    return false;
  }
}

const root = process.cwd();
const packagesRoot = path.join(root, 'packages');
const scopeRoot = path.join(root, 'node_modules', '@planforge');

// Windows only grants directory-symlink permission to elevated processes or
// machines in developer mode. A junction points at an absolute directory, which
// is exactly what a workspace link is, and needs no such privilege.
const linkType = process.platform === 'win32' ? 'junction' : 'dir';

await mkdir(scopeRoot, { recursive: true });

for (const entry of await readdir(packagesRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const packageRoot = path.join(packagesRoot, entry.name);
  const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
  if (typeof manifest.name !== 'string' || !manifest.name.startsWith('@planforge/')) continue;
  const shortName = manifest.name.slice('@planforge/'.length);
  const destination = path.join(scopeRoot, shortName);
  if (await linksTo(destination, packageRoot)) continue;
  await rm(destination, { recursive: true, force: true });
  await symlink(packageRoot, destination, linkType);
}
