export const CLI_HELP = `PlanForge

Usage:
  planforge validate <factory.json>
  planforge compile <factory.json> [--dispatch <rule>] [--output <file>] [--compact]
  planforge analyze <factory.json> [--dispatch <rule>] [--output <file>] [--compact]
  planforge explain <factory.json> [--order <id>] [--dispatch <rule>] [--output <file>] [--compact]

Dispatch rules:
  priority
  earliest-due
  shortest-processing
  critical-ratio

Explain attributes every minute of an order's flow time to one of:
  processing            work running on the critical chain
  calendar-closed       the work center was outside its shifts
  resource-contention   the work center was held by another order
  idle-wait             the work center was open and free
`;
