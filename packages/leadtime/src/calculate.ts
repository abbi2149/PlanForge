import type { LeadTimeComponent, LeadTimeResult } from './types.js';

export function calculateLeadTime(component: LeadTimeComponent): LeadTimeResult {
  const valueAddedMinutes = component.runMinutes;
  const nonValueAddedMinutes = (component.queueMinutes + component.setupMinutes + component.moveMinutes + component.waitMinutes) as LeadTimeResult['nonValueAddedMinutes'];
  const totalMinutes = (valueAddedMinutes + nonValueAddedMinutes) as LeadTimeResult['totalMinutes'];
  return {
    itemId: component.itemId,
    valueAddedMinutes,
    nonValueAddedMinutes,
    totalMinutes,
    valueAddedBasisPoints: totalMinutes === 0 ? 0 : Math.round((valueAddedMinutes * 10_000) / totalMinutes),
  };
}
