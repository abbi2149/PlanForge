import type { Minute, MoneyMinor } from '@planforge/model';
import { orderQuantity } from './quantity.js';
import { bestOffer } from './select.js';
import type { ProcurementPlan, PurchaseOrderLine, PurchaseRequirement, SupplierOffer } from './types.js';

export function planProcurement(
  requirements: readonly PurchaseRequirement[],
  offers: readonly SupplierOffer[],
  planningMinute: Minute,
): ProcurementPlan {
  const lines: PurchaseOrderLine[] = [];
  const uncovered: PurchaseRequirement[] = [];
  for (const requirement of [...requirements].sort((a, b) => a.needByMinute - b.needByMinute || a.itemId.localeCompare(b.itemId))) {
    const feasible = offers.filter(
      (offer) => offer.itemId === requirement.itemId && planningMinute + offer.leadMinutes <= requirement.needByMinute,
    );
    const offer = bestOffer(feasible);
    if (!offer) {
      uncovered.push(requirement);
      continue;
    }
    const quantity = orderQuantity(requirement.quantity, offer);
    lines.push({
      supplierId: offer.supplierId,
      itemId: requirement.itemId,
      quantity,
      orderMinute: planningMinute,
      expectedMinute: (planningMinute + offer.leadMinutes) as Minute,
      unitCostMinor: offer.unitCostMinor,
    });
  }
  const totalCostMinor = lines.reduce((sum, line) => sum + line.quantity * line.unitCostMinor, 0) as MoneyMinor;
  return { lines, uncovered, totalCostMinor };
}
