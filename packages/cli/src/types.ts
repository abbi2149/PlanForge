export interface CliOptions {
  readonly command: 'validate' | 'compile' | 'analyze';
  readonly inputPath: string;
  readonly outputPath?: string;
  readonly dispatchRule?: 'priority' | 'earliest-due' | 'shortest-processing' | 'critical-ratio';
  readonly pretty: boolean;
}
