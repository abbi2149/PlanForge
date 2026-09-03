import { failure, success, type ModelResult } from '@planforge/model';
import type { TaktInput } from './types.js';

export function validateTaktInput(input: TaktInput): ModelResult<TaktInput> {
  if (input.availableMinutes <= 0 || input.demand <= 0) {
    return failure({ code: 'TAKT_INPUT', message: 'available minutes and demand must be positive' });
  }
  if ((input.plannedDowntimeMinutes ?? 0) < 0 || (input.plannedDowntimeMinutes ?? 0) >= input.availableMinutes) {
    return failure({ code: 'TAKT_DOWNTIME', message: 'planned downtime must fit within available minutes' });
  }
  if ((input.efficiencyBasisPoints ?? 10_000) <= 0 || (input.efficiencyBasisPoints ?? 10_000) > 10_000) {
    return failure({ code: 'TAKT_EFFICIENCY', message: 'efficiency must be within 1..10000 basis points' });
  }
  return success(input);
}
