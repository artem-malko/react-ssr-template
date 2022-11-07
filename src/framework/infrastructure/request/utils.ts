import { AxiosError } from 'axios';
import { v4 as uuid } from 'uuid';

import { isServer } from 'lib/browser';

import { ParsedError, ErrorResponseCode } from './types';

/**
 * Add http for server-side requests to protocol-less urls
 */
export function patchUrl(url: string) {
  if (isServer && !url.indexOf('//')) {
    return `http:${url}`;
  }

  return url;
}

/* istanbul ignore next */
export function generateRequestId(): string {
  return process.env.NODE_ENV === 'test' ? 'requestId' : uuid();
}

export function processAnyAPIError(
  error: AxiosError | Error,
  middleware?: (originalError: AxiosError | Error, parsedError: ParsedError) => void,
): never {
  const parsedError = parseAnyAPIError(error);

  if (middleware) {
    middleware(error, parsedError);
  }

  throw parsedError;
}

function parseAnyAPIError(error: AxiosError | Error): ParsedError {
  // Process any error, except Network errors
  if (!('isAxiosError' in error)) {
    return {
      code: 500 as const,
      message: 'Response parse error: ' + error.message,
    };
  }

  if (!error.isAxiosError) {
    return {
      code: 500,
      message: 'Unknown error: ' + error.message,
    };
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED') {
    return {
      code: 599 as const,
      message: 'Network connect timeout error',
    };
  }
  // Server is not responding or there is no response from server
  if (!error.response) {
    return {
      code: 503 as const,
      message: 'Service is not available',
    };
  }

  const parsedErrorCode = error.response.status
    ? (error.response.status as ErrorResponseCode)
    : (500 as const);

  // Server responded with an error in a body
  let parsedErrorData: Record<string, any> = {};

  if (!error.response.data) {
    return {
      code: parsedErrorCode,
      message: error.message || 'Unknown error',
    };
  }

  if (typeof error.response.data === 'string') {
    try {
      parsedErrorData = JSON.parse(error.response.data);
    } catch (parseError) {
      return {
        code: 500 as const,
        message: 'Response parse error. error.response.data has incorrect JSON string: ',
      };
    }
  }

  if (typeof error.response.data === 'object') {
    parsedErrorData = error.response.data;
  }

  if (!parsedErrorData.error) {
    return {
      code: (error.response.status as ErrorResponseCode) || (500 as const),
      message: `Parsed error body: ${JSON.stringify(parsedErrorData)}`,
    };
  }

  return {
    code: parsedErrorData.error.code || (error.response.status as ErrorResponseCode) || (500 as const),
    message: parsedErrorData.error.message || undefined,
  };
}
