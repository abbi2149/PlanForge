import { grossRequirements } from './gross.js';
import { netRequirements } from './net.js';
import { purchaseRequirements } from './purchases.js';
import type { MaterialPlan, PlanningInput } from './types.js';

export function buildMaterialPlan(input: PlanningInput): MaterialPlan {
  const gross = grossRequirements(input);
  const requirements = netRequirements(gross, input.openingInventory);
  return { horizon: input.horizon, requirements, purchases: purchaseRequirements(requirements) };
}
