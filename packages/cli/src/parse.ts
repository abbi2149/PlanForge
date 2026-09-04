import { failure, success, type ModelResult } from '@planforge/api';
import type { CliOptions } from './types.js';

const commands = new Set(['validate', 'compile', 'analyze', 'explain']);
const rules = new Set(['priority', 'earliest-due', 'shortest-processing', 'critical-ratio']);

export function parseCliArguments(argv: readonly string[]): ModelResult<CliOptions> {
  const [commandRaw, ...args] = argv;
  if (!commandRaw || !commands.has(commandRaw)) {
    return failure({
      code: 'CLI_COMMAND',
      message: 'command must be validate, compile, analyze, or explain',
    });
  }
  let inputPath = '';
  let outputPath: string | undefined;
  let orderId: string | undefined;
  let dispatchRule: CliOptions['dispatchRule'];
  let pretty = true;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === '--output') {
      outputPath = args[++index];
      if (!outputPath) return failure({ code: 'CLI_ARGUMENT', message: '--output requires a path' });
    } else if (arg === '--dispatch') {
      const value = args[++index];
      if (!value || !rules.has(value)) return failure({ code: 'CLI_ARGUMENT', message: '--dispatch has an invalid rule' });
      dispatchRule = value as CliOptions['dispatchRule'];
    } else if (arg === '--order') {
      orderId = args[++index];
      if (!orderId) return failure({ code: 'CLI_ARGUMENT', message: '--order requires an order id' });
    } else if (arg === '--compact') {
      pretty = false;
    } else if (arg.startsWith('-')) {
      return failure({ code: 'CLI_ARGUMENT', message: `unknown option ${arg}` });
    } else if (inputPath.length === 0) {
      inputPath = arg;
    } else {
      return failure({ code: 'CLI_ARGUMENT', message: `unexpected argument ${arg}` });
    }
  }
  if (inputPath.length === 0) return failure({ code: 'CLI_INPUT', message: 'an input JSON path is required' });
  const command = commandRaw as CliOptions['command'];
  if (orderId !== undefined && command !== 'explain') {
    return failure({ code: 'CLI_ARGUMENT', message: '--order is only valid for explain' });
  }
  return success({
    command,
    inputPath,
    pretty,
    ...(outputPath === undefined ? {} : { outputPath }),
    ...(dispatchRule === undefined ? {} : { dispatchRule }),
    ...(orderId === undefined ? {} : { orderId }),
  });
}
