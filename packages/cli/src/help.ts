export const CLI_HELP = `PlanForge

Usage:
  planforge validate <factory.json>
  planforge compile <factory.json> [--dispatch <rule>] [--format <format>] [--strict-materials] [--output <file>] [--compact]
  planforge analyze <factory.json> [--dispatch <rule>] [--format <format>] [--strict-materials] [--output <file>] [--compact]
  planforge explain <factory.json> [--order <id>] [--dispatch <rule>] [--strict-materials] [--output <file>] [--compact]
  planforge compare <factory.json> --against <rule> [--dispatch <rule>] [--output <file>] [--compact]
  planforge rank <factory.json> [--output <file>] [--compact]
  planforge help
  planforge version

Global options:
  --help, -h            print this help and exit
  --version, -v         print the PlanForge version and exit

Dispatch rules:
  priority
  earliest-due
  shortest-processing
  critical-ratio

Output formats (compile and analyze only, default json):
  json                  the full command result
  csv                   the plan report as one CSV document
  markdown              the plan report as a Markdown document

Material handling:
  --strict-materials    fail when planned production would exhaust on-hand
                        material instead of listing the shortages in the result

Compare compiles the model twice and reports how the --against rule moves
makespan, tardiness, on-time delivery, and schedule stability against the
--dispatch baseline, which defaults to priority.

Rank compiles the model under every dispatch rule and orders the outcomes
best-first by on-time delivery, then average tardiness, then makespan, then
average flow time, then warning count, then rule name. It takes no --dispatch
because it scores every rule.

Explain attributes every minute of an order's flow time to one of:
  processing            work running on the critical chain
  calendar-closed       the work center was outside its shifts
  resource-contention   the work center was held by another order
  idle-wait             the work center was open and free

Exit codes:
  0                     the command produced a result
  1                     the model was rejected while planning
  2                     the arguments or the input file could not be used
`;
