#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import {
  analyzeFactory,
  compileFactory,
  explainFactoryDelays,
  explainOrderDelay,
  validateFactoryModel,
} from '../packages/api/dist/index.js';
import { CLI_HELP, formatCliResult, formatDiagnostics, parseCliArguments } from '../packages/cli/dist/index.js';

const parsed = parseCliArguments(process.argv.slice(2));
if (!parsed.ok) {
  process.stderr.write(`${formatDiagnostics(parsed.diagnostics)}\n\n${CLI_HELP}`);
  process.exitCode = 2;
} else {
  try {
    const model = JSON.parse(await readFile(parsed.value.inputPath, 'utf8'));
    let output;
    if (parsed.value.command === 'validate') {
      const result = validateFactoryModel(model);
      if (!result.ok) throw new Error(formatDiagnostics(result.diagnostics));
      output = { ok: true, name: result.value.name };
    } else {
      const compiled = compileFactory(model, {
        ...(parsed.value.dispatchRule ? { dispatchRule: parsed.value.dispatchRule } : {}),
        includeReport: true,
      });
      if (!compiled.ok) throw new Error(formatDiagnostics(compiled.diagnostics));
      if (parsed.value.command === 'compile') {
        output = compiled.value;
      } else if (parsed.value.command === 'analyze') {
        output = { ...compiled.value, analysis: analyzeFactory(model, compiled.value.plan) };
      } else {
        const explained = parsed.value.orderId
          ? explainOrderDelay(model, compiled.value.plan, parsed.value.orderId)
          : explainFactoryDelays(model, compiled.value.plan);
        if (!explained.ok) throw new Error(formatDiagnostics(explained.diagnostics));
        output = { plan: { name: compiled.value.plan.name, digest: compiled.value.plan.digest }, explanation: explained.value };
      }
    }
    const text = formatCliResult(output, parsed.value.pretty);
    if (parsed.value.outputPath) await writeFile(parsed.value.outputPath, text, 'utf8');
    else process.stdout.write(text);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
