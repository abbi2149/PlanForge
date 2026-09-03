import { failure, success, type ModelResult } from '@planforge/model';
import type { LeadTimeComponent } from './types.js';

export function validateLeadTime(component: LeadTimeComponent): ModelResult<LeadTimeComponent> {
  for (const value of [component.queueMinutes, component.setupMinutes, component.runMinutes, component.moveMinutes, component.waitMinutes]) {
    if (value < 0) return failure({ code: 'LEADTIME_COMPONENT', message: `negative lead-time component for ${component.itemId}` });
  }
  return success(component);
}
