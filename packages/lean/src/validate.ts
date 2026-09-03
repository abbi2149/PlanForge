import { failure, success, type ModelResult } from '@planforge/model';
import type { FlowCell, SetupObservation } from './types.js';

export function validateLeanInputs(
  setups: readonly SetupObservation[],
  cells: readonly FlowCell[],
): ModelResult<true> {
  for (const setup of setups) {
    if (setup.internalMinutes < 0 || setup.externalMinutes < 0 || setup.familyFrom.length === 0 || setup.familyTo.length === 0) {
      return failure({ code: 'LEAN_SETUP', message: `invalid setup observation ${setup.workCenterId}` });
    }
  }
  const centers = new Set<string>();
  for (const cell of cells) {
    if (centers.has(cell.workCenterId) || cell.cycleMinutes <= 0 || cell.operators <= 0 || cell.bufferUnits < 0) {
      return failure({ code: 'LEAN_CELL', message: `invalid flow cell ${cell.workCenterId}` });
    }
    centers.add(cell.workCenterId);
  }
  return success(true);
}
