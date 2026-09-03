import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

test('every workspace package exposes a loadable public dist entry', async (t) => {
  const packages = (await readdir('packages', { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.ok(packages.length >= 20);
  for (const name of packages) {
    await t.test(name, async () => {
      const manifest = JSON.parse(await readFile(path.join('packages', name, 'package.json'), 'utf8'));
      assert.equal(manifest.name, `@planforge/${name}`);
      const module = await import(pathToFileURL(path.resolve('packages', name, 'dist/index.js')).href);
      assert.ok(Object.keys(module).length > 0, `${name} has no public exports`);
    });
  }
});
