import type { ModelResult } from '@planforge/model';
import { scheduleSerial } from './serial.js';
import type { ScheduleInput, ScheduleResult } from './types.js';
import { validateScheduleInput } from './validate.js';

export function compileSchedule(input: ScheduleInput): ModelResult<ScheduleResult> {
  const valid = validateScheduleInput(input);
  if (!valid.ok) return valid;
  return scheduleSerial(valid.value);
}
