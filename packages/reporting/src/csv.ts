import type { ProductionReport } from './types.js';

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function renderCsv(
  rows: readonly Readonly<Record<string, string | number>>[],
  headers: readonly string[],
): string {
  const lines = [headers.map(csvCell).join(',')];
  for (const row of rows) lines.push(headers.map((header) => csvCell(row[header] ?? '')).join(','));
  return `${lines.join('\n')}\n`;
}

export function rowsToCsv(rows: readonly Readonly<Record<string, string | number>>[]): string {
  if (rows.length === 0) return '';
  return renderCsv(rows, [...new Set(rows.flatMap((row) => Object.keys(row)))].sort());
}

/**
 * Renders every section of a report as one CSV document. A leading `section`
 * column keeps rows attributable because sections carry different columns; the
 * remaining columns are the sorted union of the keys used by any row. Sections
 * without rows contribute no lines, and a row key named `section` is replaced
 * by the section title.
 */
export function reportToCsv(report: ProductionReport): string {
  const rows = report.sections.flatMap((section) =>
    section.rows.map((row) => ({ ...row, section: section.title })),
  );
  if (rows.length === 0) return '';
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))].filter((header) => header !== 'section');
  return renderCsv(rows, ['section', ...columns.sort()]);
}
