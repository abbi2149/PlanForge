export type CliCommand = 'validate' | 'compile' | 'analyze' | 'explain' | 'compare' | 'rank';

export type DispatchRuleName = 'priority' | 'earliest-due' | 'shortest-processing' | 'critical-ratio';

/** Rendering of the command result. `csv` and `markdown` need a plan report. */
export type CliFormat = 'json' | 'csv' | 'markdown';

export interface CliRunOptions {
  readonly command: CliCommand;
  readonly inputPath: string;
  readonly outputPath?: string;
  readonly dispatchRule?: DispatchRuleName;
  /** Candidate rule that `compare` measures against the baseline rule. */
  readonly againstRule?: DispatchRuleName;
  /** Fails the command when planned production would exhaust on-hand material. */
  readonly strictMaterials?: boolean;
  /** Restricts `explain` to a single order id. */
  readonly orderId?: string;
  readonly format: CliFormat;
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
