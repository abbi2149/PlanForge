# Architecture

PlanForge is a layered monorepo. Packages are intentionally small enough to expose a clear domain boundary but large enough to own their validation, types, and algorithms.

## Layer 1: domain primitives

`@planforge/model` owns branded logical IDs, integer units, shared diagnostics, time-range helpers, canonical JSON, SHA-256 digests, and basic statistical functions. It has no workspace dependencies.

Packages should use the shared model instead of inventing another result type or unit representation.

## Layer 2: manufacturing facts

Calendar, routing, BOM, inventory, maintenance, quality, workforce, warehousing, supplier, orders, and similar packages describe facts about a manufacturing system. These packages may depend on `model` and on a small number of directly related fact packages.

They do not compile a complete production plan.

## Layer 3: planning engines

Capacity and scheduler convert validated manufacturing facts into reservations and scheduled operations. Forecasting, procurement, planning, dispatch, sequencing, line balancing, and optimization derive decisions around that schedule.

The scheduler is deliberately serial and deterministic. Dispatch policy influences order selection, while routing precedence and capacity availability constrain placement.

## Layer 4: analysis

Simulation, resilience, risk, analytics, OEE, service-level, profitability, value-stream, traceability, reporting, and related packages consume plans and domain facts to produce derived metrics. They should not mutate their inputs.

## Layer 5: application boundary

`@planforge/api` is the public factory-level integration package. It validates a `FactoryModel`, compiles a schedule, evaluates material requirements, and optionally builds reports. `@planforge/cli` owns command parsing and formatting only. `bin/planforge.mjs` performs filesystem I/O.

This separation keeps the planning core reusable in services, CLIs, batch jobs, or tests without importing application-specific filesystem behavior.

## Dependency direction

The intended direction is:

```text
model
  -> domain fact packages
      -> scheduling/planning packages
          -> analysis/reporting packages
              -> api
                  -> cli/bin
```

A dependency from a low-level package back into `api` or `cli` is considered an architecture error.

## Build model

Each package is a composite TypeScript project. Root `tsconfig.json` references every workspace, while `tsconfig.base.json` contains shared strict compiler settings and workspace paths. A package's `tsconfig.json` references exactly the other PlanForge packages declared in its manifest.

The workspace-link script creates local `node_modules/@planforge/*` symlinks so emitted ESM can use package names during local development without publishing packages.
