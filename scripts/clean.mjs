import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
for (const entry of await readdir(path.join(root, 'packages'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const packageRoot = path.join(root, 'packages', entry.name);
  await rm(path.join(packageRoot, 'dist'), { recursive: true, force: true });
  await rm(path.join(packageRoot, 'tsconfig.tsbuildinfo'), { force: true });
}
await rm(path.join(root, 'tsconfig.tsbuildinfo'), { force: true });
