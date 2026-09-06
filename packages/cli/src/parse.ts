import { failure, success, type ModelResult } from '@planforge/api';
import type { CliFormat, CliOptions, CliRunOptions } from './types.js';

const commands = new Set(['validate', 'compile', 'analyze', 'explain']);
const rules = new Set(['priority', 'earliest-due', 'shortest-processing', 'critical-ratio']);
const formats = new Set(['json', 'csv', 'markdown']);
const reportCommands = new Set(['compile', 'analyze']);
const helpAliases = new Set(['help', '--help', '-h']);
const versionAliases = new Set(['version', '--version', '-v']);

export function parseCliArguments(argv: readonly string[]): ModelResult<CliOptions> {
  if (argv.some((arg) => helpAliases.has(arg))) return success({ command: 'help' });
  if (argv.some((arg) => versionAliases.has(arg))) return success({ command: 'version' });
  const [commandRaw, ...args] = argv;
  if (!commandRaw || !commands.has(commandRaw)) {
    return failure({
      code: 'CLI_COMMAND',
      message: 'command must be validate, compile, analyze, explain, help, or version',
    });
  }
  let inputPath = '';
  let outputPath: string | undefined;
  let orderId: string | undefined;
  let dispatchRule: CliRunOptions['dispatchRule'];
  let format: CliFormat = 'json';
  let pretty = true;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === '--output') {
      outputPath = args[++index];
      if (!outputPath) return failure({ code: 'CLI_ARGUMENT', message: '--output requires a path' });
    } else if (arg === '--dispatch') {
      const value = args[++index];
      if (!value || !rules.has(value)) return failure({ code: 'CLI_ARGUMENT', message: '--dispatch has an invalid rule' });
      dispatchRule = value as CliRunOptions['dispatchRule'];
    } else if (arg === '--format') {
      const value = args[++index];
      if (!value || !formats.has(value)) {
        return failure({ code: 'CLI_ARGUMENT', message: '--format must be json, csv, or markdown' });
      }
      format = value as CliFormat;
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
  const command = commandRaw as CliRunOptions['command'];
  if (orderId !== undefined && command !== 'explain') {
    return failure({ code: 'CLI_ARGUMENT', message: '--order is only valid for explain' });
  }
  if (format !== 'json' && !reportCommands.has(command)) {
    return failure({ code: 'CLI_ARGUMENT', message: `--format ${format} is only valid for compile and analyze` });
  }
  return success({
    command,
    inputPath,
    format,
    pretty,
    ...(outputPath === undefined ? {} : { outputPath }),
    ...(dispatchRule === undefined ? {} : { dispatchRule }),
    ...(orderId === undefined ? {} : { orderId }),
  });
}
