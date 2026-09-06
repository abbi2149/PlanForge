import {
  reportToCsv,
  reportToJson,
  reportToMarkdown,
  type Diagnostic,
  type FactoryAnalysis,
  type ProductionReport,
} from '@planforge/api';
import type { CliFormat } from './types.js';

export function formatDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map((diagnostic) => `${diagnostic.code}: ${diagnostic.message}${diagnostic.path ? ` [${diagnostic.path}]` : ''}`)
    .join('\n');
}

export function formatCliResult(value: unknown, pretty: boolean): string {
  return pretty ? `${JSON.stringify(value, null, 2)}\n` : `${JSON.stringify(value)}\n`;
}

/** Renders a plan report in the format requested by `--format`. */
export function formatPlanReport(report: ProductionReport, format: CliFormat, pretty: boolean): string {
  if (format === 'csv') return reportToCsv(report);
  if (format === 'markdown') return reportToMarkdown(report);
  return reportToJson(report, pretty);
}

/** Appends schedule metrics and bottlenecks so `analyze` keeps its findings in non-JSON output. */
export function withAnalysisSection(report: ProductionReport, analysis: FactoryAnalysis): ProductionReport {
  return {
    ...report,
    sections: [
      ...report.sections,
      {
        title: 'Analysis',
        rows: [
          {
            ...analysis.schedule,
            bottlenecks: analysis.bottlenecks.join(' '),
            maintenanceConflicts: analysis.maintenanceConflicts,
          },
        ],
      },
    ],
  };
}

/**
 * Turns a failed read or parse of the input document into a diagnostic, so an
 * unreadable path or malformed JSON is reported like every other CLI failure
 * instead of as a bare runtime error.
 */
export function inputFileDiagnostic(inputPath: string, error: unknown): Diagnostic {
  const detail = error instanceof Error ? error.message : String(error);
  return error instanceof SyntaxError
    ? { code: 'CLI_INPUT_JSON', message: `input is not valid JSON: ${detail}`, path: inputPath }
    : { code: 'CLI_INPUT_READ', message: `input cannot be read: ${detail}`, path: inputPath };
}
