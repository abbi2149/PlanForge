import type { Quantity } from '@planforge/model';
import type { AllocationLine } from './types.js';

export function allocatedBySource(lines: readonly AllocationLine[]): Readonly<Record<string, Quantity>> {
  const totals: Record<string, Quantity> = {};
  for (const line of lines) totals[line.source] = ((totals[line.source] ?? 0) + line.quantity) as Quantity;
  return Object.fromEntries(Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))) as Readonly<Record<string, Quantity>>;
}

export function allocatedByRequest(lines: readonly AllocationLine[]): Readonly<Record<string, Quantity>> {
  const totals: Record<string, Quantity> = {};
  for (const line of lines) totals[line.requestId] = ((totals[line.requestId] ?? 0) + line.quantity) as Quantity;
  return Object.fromEntries(Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))) as Readonly<Record<string, Quantity>>;
}
