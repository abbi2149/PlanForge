#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import {
  analyzeFactory,
  compileFactory,
  explainFactoryDelays,
  explainOrderDelay,
  validateFactoryModel,
} from '../packages/api/dist/index.js';
import {
  CLI_HELP,
  formatCliResult,
  formatDiagnostics,
  formatPlanReport,
  parseCliArguments,
  withAnalysisSection,
} from '../packages/cli/dist/index.js';

async function planforgeVersion() {
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  return manifest.version;
}

const parsed = parseCliArguments(process.argv.slice(2));
if (!parsed.ok) {
  process.stderr.write(`${formatDiagnostics(parsed.diagnostics)}\n\n${CLI_HELP}`);
  process.exitCode = 2;
} else if (parsed.value.command === 'help') {
  process.stdout.write(CLI_HELP);
} else if (parsed.value.command === 'version') {
  process.stdout.write(`planforge ${await planforgeVersion()}\n`);
} else {
  try {
    const model = JSON.parse(await readFile(parsed.value.inputPath, 'utf8'));
    let output;
    let report;
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
        report = compiled.value.report;
      } else if (parsed.value.command === 'analyze') {
        const analysis = analyzeFactory(model, compiled.value.plan);
        output = { ...compiled.value, analysis };
        report = withAnalysisSection(compiled.value.report, analysis);
      } else {
        const explained = parsed.value.orderId
          ? explainOrderDelay(model, compiled.value.plan, parsed.value.orderId)
          : explainFactoryDelays(model, compiled.value.plan);
        if (!explained.ok) throw new Error(formatDiagnostics(explained.diagnostics));
        output = { plan: { name: compiled.value.plan.name, digest: compiled.value.plan.digest }, explanation: explained.value };
      }
    }
    const text =
      parsed.value.format === 'json'
        ? formatCliResult(output, parsed.value.pretty)
        : formatPlanReport(report, parsed.value.format, parsed.value.pretty);
    if (parsed.value.outputPath) await writeFile(parsed.value.outputPath, text, 'utf8');
    else process.stdout.write(text);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
