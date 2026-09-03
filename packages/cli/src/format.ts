import type { Diagnostic } from '@planforge/api';

export function formatDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map((diagnostic) => `${diagnostic.code}: ${diagnostic.message}${diagnostic.path ? ` [${diagnostic.path}]` : ''}`)
    .join('\n');
}

export function formatCliResult(value: unknown, pretty: boolean): string {
  return pretty ? `${JSON.stringify(value, null, 2)}\n` : `${JSON.stringify(value)}\n`;
}
