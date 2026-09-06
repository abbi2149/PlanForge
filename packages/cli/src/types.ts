export type CliCommand = 'validate' | 'compile' | 'analyze' | 'explain';

export interface CliRunOptions {
  readonly command: CliCommand;
  readonly inputPath: string;
  readonly outputPath?: string;
  readonly dispatchRule?: 'priority' | 'earliest-due' | 'shortest-processing' | 'critical-ratio';
  /** Restricts `explain` to a single order id. */
  readonly orderId?: string;
  readonly pretty: boolean;
}

/** Requests that describe the tool itself and never read a factory document. */
export interface CliInfoOptions {
  readonly command: 'help' | 'version';
}

export type CliOptions = CliRunOptions | CliInfoOptions;

export function isCliRunOptions(options: CliOptions): options is CliRunOptions {
  return options.command !== 'help' && options.command !== 'version';
}
