import { AxiosError, AxiosRequestConfig } from 'axios';

export type Requester = <T>(
  url: string,
  config?: AxiosRequestConfig & {
    errorProcessingMiddleware?: (originalError: AxiosError | Error, parsedError: ParsedError) => void;
  },
) => Promise<T>;

export type ErrorResponseCode = 400 | 403 | 404 | 500 | 503 | 599;

export interface ParsedError {
  code: ErrorResponseCode;
  message: string;
}
