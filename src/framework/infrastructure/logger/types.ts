export type AnyLogParams = {
  /**
   * Uniq ID [a-z0-9]{5} of the log message.
   * Generate it here: https://www.random.org/strings/?num=50&len=5&digits=on&loweralpha=on&unique=on&format=plain&rnd=new
   */
  id: string;
};

export type InfoLogParams = {
  message: string;
} & AnyLogParams;

export interface PerformanceLogParams {
  waiting: number;
  download: number;
  scriptLoading: number;
  interactive: number;
  complete: number;
  full: number;
}

// @TODO add warn logs

export type ErrorLogParams =
  | UnhandledErrorParams
  | ApiErrorParams
  | UnknownErrorParams
  | ServerErrorParams
  | ChunkLoadingError;

type LogErrorBaseParams = {
  message?: string;
} & AnyLogParams;

interface UnknownErrorParams extends LogErrorBaseParams {
  'error.type': 'unknown';
}

interface ServerErrorParams extends LogErrorBaseParams {
  'error.type': 'router';
  'error.stack': string;
}

interface UnhandledErrorParams extends LogErrorBaseParams {
  'error.type': 'windowerror' | 'unhandledrejection';
  'error.url': string | undefined;
  'error.lineNumber'?: number;
  'error.columnNumber'?: number;
  'error.stack': string;
}

interface ApiErrorParams extends LogErrorBaseParams {
  'error.type': 'api';
  'error.method': string;
  'error.requestData': string;
  'error.code': string;
  'error.stack': string | undefined;
  requestId?: string;
}

interface ChunkLoadingError extends LogErrorBaseParams {
  'error.type': 'chunkLoadingFailed';
  'error.chunkName': string;
}
