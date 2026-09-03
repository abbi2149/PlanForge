import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packagesRoot = path.join(root, 'packages');
const entries = (await readdir(packagesRoot)).sort();
const manifests = new Map();

for (const name of entries) {
  const packageRoot = path.join(packagesRoot, name);
  if (!(await stat(packageRoot)).isDirectory()) continue;
  const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
  if (manifest.name !== `@planforge/${name}`) {
    throw new Error(`${name}: package name must be @planforge/${name}`);
  }
  manifests.set(name, manifest);
}

const rootConfig = JSON.parse(await readFile(path.join(root, 'tsconfig.json'), 'utf8'));
const baseConfig = JSON.parse(await readFile(path.join(root, 'tsconfig.base.json'), 'utf8'));
const rootReferences = new Set((rootConfig.references ?? []).map((entry) => entry.path.replace('./packages/', '')));
const paths = baseConfig.compilerOptions?.paths ?? {};

for (const [name, manifest] of manifests) {
  if (!rootReferences.has(name)) throw new Error(`${name}: missing root TypeScript reference`);
  const alias = `@planforge/${name}`;
  if (paths[alias]?.[0] !== `packages/${name}/src/index.ts`) {
    throw new Error(`${name}: root path alias is missing or incorrect`);
  }
  const config = JSON.parse(await readFile(path.join(packagesRoot, name, 'tsconfig.json'), 'utf8'));
  const references = new Set((config.references ?? []).map((entry) => entry.path.replace('../', '')));
  const dependencies = Object.keys(manifest.dependencies ?? {})
    .filter((dependency) => dependency.startsWith('@planforge/'))
    .map((dependency) => dependency.slice('@planforge/'.length))
    .sort();
  for (const dependency of dependencies) {
    if (!manifests.has(dependency)) throw new Error(`${name}: unknown workspace dependency ${dependency}`);
    if (!references.has(dependency)) throw new Error(`${name}: missing TypeScript reference to ${dependency}`);
  }
  for (const reference of references) {
    if (!dependencies.includes(reference)) throw new Error(`${name}: undeclared TypeScript workspace reference ${reference}`);
  }
}

for (const reference of rootReferences) {
  if (!manifests.has(reference)) throw new Error(`root TypeScript reference points to unknown package ${reference}`);
}

console.log(`workspace metadata OK (${manifests.size} packages)`);
