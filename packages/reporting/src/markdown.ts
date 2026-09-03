import type { ProductionReport } from './types.js';

const cell = (value: string | number): string => String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');

export function reportToMarkdown(report: ProductionReport): string {
  const lines = [`# ${report.title}`, '', `Plan: ${report.plan.name}`, `Digest: \`${report.plan.digest}\``];
  for (const section of report.sections) {
    lines.push('', `## ${section.title}`, '');
    if (section.rows.length === 0) {
      lines.push('_No rows._');
      continue;
    }
    const headers = [...new Set(section.rows.flatMap((row) => Object.keys(row)))].sort();
    lines.push(`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`);
    for (const row of section.rows) lines.push(`| ${headers.map((header) => cell(row[header] ?? '')).join(' | ')} |`);
  }
  return `${lines.join('\n')}\n`;
}
