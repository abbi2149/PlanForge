import { readFile } from 'node:fs/promises';
import { analyzeFactory, compileFactory } from '../packages/api/dist/index.js';

const factory = JSON.parse(await readFile(new URL('./factory.json', import.meta.url), 'utf8'));
const compiled = compileFactory(factory, { validateMaterials: true, includeReport: false });

if (!compiled.ok) {
  console.error(compiled.diagnostics);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    plan: compiled.value.plan,
    materialCostMinor: compiled.value.materialCostMinor,
    analysis: analyzeFactory(factory, compiled.value.plan),
  }, null, 2));
}
