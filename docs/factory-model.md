# Factory model

`FactoryModel` is the top-level input consumed by `@planforge/api`.

Required fields:

- `name`: logical factory/model name;
- `items`: item catalog;
- `orders`: demand orders;
- `routings`: production routing for manufactured items;
- `calendar`: planning horizon and work-center shift availability.

Optional fields add richer planning behavior:

- `boms` for material explosion;
- inventory lots, receipts, and demands for material availability;
- maintenance policies/windows for downtime analysis;
- quality profiles for quality planning;
- work-center and material rates for cost analysis;
- demand history for forecasting workflows.

## IDs

Core logical IDs are strings beginning with an ASCII letter followed by letters, numbers, `.`, `_`, `:`, or `-`, up to 64 characters total. IDs are exact values. Case is significant.

## Time

Time is represented as integer minutes relative to a model-defined origin. PlanForge does not impose a particular calendar date. A caller may define minute zero as the beginning of a week, shift, simulation horizon, or another stable planning epoch.

## Capacity

Each work-center shift has a positive integer `capacityUnits`. The default scheduler reserves one unit for an operation. Calendar exceptions can close a center or reduce its capacity for a time range.

## Routing

A routing contains operation specs with setup time, per-unit run time, work center, yield basis points, and predecessor IDs. The routing graph must be acyclic and every predecessor must exist in the same routing.

## Materials

BOM components specify quantity-per and scrap basis points. Explosion rounds upward after scrap so a requirement never understates the integer material quantity.

When material validation is explicitly enabled, `compileFactory` can fail with a material-shortage diagnostic. Otherwise shortages are returned as analysis data alongside the compiled plan.
