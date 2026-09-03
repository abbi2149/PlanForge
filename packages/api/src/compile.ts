import { explodeBom } from '@planforge/bom';
import { materialCost, type MaterialUsage } from '@planforge/costing';
import { firstShortageMinute, projectInventory } from '@planforge/inventory';
import { failure, success, type ModelResult, type ProductionPlan, type Quantity } from '@planforge/model';
import { buildPlanReport, type ProductionReport } from '@planforge/reporting';
import { compileSchedule } from '@planforge/scheduler';
import type { CompileFactoryOptions, FactoryModel } from './types.js';
import { validateFactoryModel } from './validate.js';

export interface CompiledFactory {
  readonly plan: ProductionPlan;
  readonly report?: ProductionReport;
  readonly materialCostMinor: number;
  readonly materialShortages: readonly string[];
}

export function compileFactory(
  model: FactoryModel,
  options: CompileFactoryOptions = {},
): ModelResult<CompiledFactory> {
  const valid = validateFactoryModel(model);
  if (!valid.ok) return valid;
  const scheduled = compileSchedule({
    name: model.name,
    orders: model.orders,
    routings: model.routings,
    calendar: model.calendar,
    ...(options.dispatchRule === undefined ? {} : { dispatchRule: options.dispatchRule }),
  });
  if (!scheduled.ok) return scheduled;
  const usages: MaterialUsage[] = [];
  for (const order of model.orders) {
    for (const requirement of explodeBom(model.boms ?? [], order.itemId, order.quantity)) {
      usages.push({ itemId: requirement.itemId, quantity: requirement.quantity });
    }
  }
  const materialCostMinor = materialCost(usages, model.materialRates ?? []);
  const materialShortages: string[] = [];
  if (options.validateMaterials ?? true) {
    const grouped = new Map<string, Quantity>();
    for (const usage of usages) grouped.set(usage.itemId, ((grouped.get(usage.itemId) ?? 0) + usage.quantity) as Quantity);
    for (const [itemId, required] of grouped) {
      const opening = (model.inventoryLots ?? [])
        .filter((lot) => lot.itemId === itemId)
        .reduce((sum, lot) => sum + lot.quantity, 0) as Quantity;
      const projected = projectInventory(
        itemId as Parameters<typeof projectInventory>[0],
        opening,
        model.inventoryReceipts ?? [],
        [
          ...(model.inventoryDemands ?? []),
          { itemId: itemId as Parameters<typeof projectInventory>[0], quantity: required, minute: model.calendar.horizonStart, reference: 'planned-production' },
        ],
      );
      if (firstShortageMinute(projected) !== null) materialShortages.push(itemId);
    }
  }
  if (materialShortages.length > 0 && options.validateMaterials === true) {
    return failure({ code: 'API_MATERIAL_SHORTAGE', message: `material shortages: ${materialShortages.sort().join(', ')}` });
  }
  const result: CompiledFactory = {
    plan: scheduled.value,
    materialCostMinor,
    materialShortages: materialShortages.sort(),
    ...(options.includeReport === false ? {} : { report: buildPlanReport(scheduled.value) }),
  };
  return success(result);
}
