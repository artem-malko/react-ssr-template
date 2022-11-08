export type AnyLogParams = {
  /**
   * Uniq ID [a-z0-9]{5} of the log message.
   * Generate it here: https://www.random.org/strings/?num=50&len=5&digits=on&loweralpha=on&unique=on&format=plain&rnd=new
   */
  id: string;
};

export type InfoLogParams = {
  message: string;
  data?: Record<string, unknown>;
} & AnyLogParams;

export interface PerformanceLogParams {
  waiting: number;
  download: number;
  scriptLoading: number;
  interactive: number;
  complete: number;
  full: number;
}

export type ErrorLogParams = {
  message?: string;
  source: 'router' | 'windowerror' | 'unhandledrejection' | 'service' | 'unknown';
  stack?: string;
  lineNumber?: number;
  columnNumber?: number;
  data?: Record<string, unknown>;
} & AnyLogParams;

export type FatalLogParams = {
  message?: string;
  stack?: string;
  lineNumber?: number;
  columnNumber?: number;
  data?: Record<string, unknown>;
} & AnyLogParams;
