export interface CliOptions {
  readonly command: 'validate' | 'compile' | 'analyze' | 'explain';
  readonly inputPath: string;
  readonly outputPath?: string;
  readonly dispatchRule?: 'priority' | 'earliest-due' | 'shortest-processing' | 'critical-ratio';
  /** Restricts `explain` to a single order id. */
  readonly orderId?: string;
  readonly pretty: boolean;
}
