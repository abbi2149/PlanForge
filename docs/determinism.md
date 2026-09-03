# Determinism and reproducibility

Manufacturing plans are often compared, cached, signed, audited, or reproduced later. PlanForge treats deterministic semantics as a product feature rather than a testing convenience.

## Canonical data

`canonicalJson` recursively sorts object keys and omits undefined object values. Arrays preserve their semantic order. `digestOf` applies SHA-256 to that canonical representation.

A plan digest therefore changes when the plan's logical data changes, but not because an object happened to be constructed with a different key insertion order.

## Stable collection order

Functions that return sets of diagnostics, work centers, lots, scenarios, allocation groups, or other public collection data establish an explicit sort order before returning. Map iteration order is never treated as an externally meaningful contract by accident.

## No ambient time

Domain APIs accept minutes or periods as input. They do not call `Date.now()` to determine planning behavior. This allows the same input to be reproduced later.

## No random simulation

Simulation uses explicit deterministic delay and yield rules. An ensemble is a named collection of simulation inputs, not an implicit pseudorandom run. If stochastic behavior is added in the future, the random stream must be explicit and seeded as part of the public input.

## Integer core units

Durations, quantities, basis points, and currency minor units use integer values. Fractional statistics are allowed in analytical outputs, but core inventory and schedule arithmetic avoids binary floating-point quantities where rounding would become hidden behavior.

## Filesystem independence

The library packages do not read the filesystem. Only the CLI entry point loads and writes JSON files. Production plans therefore do not depend on path locations or host-specific metadata.
